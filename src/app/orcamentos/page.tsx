'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { initialProposals, initialClients, initialServices } from '@/lib/mockData';
import { Proposal } from '@/lib/types';
import {
  Calculator,
  Plus,
  FileText,
  DollarSign,
  Clock,
  Wrench,
  Percent,
  CheckCircle2,
  Printer,
  Copy,
} from 'lucide-react';

export default function OrcamentosPage() {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [clientId, setClientId] = useState(initialClients[0].id);
  const [title, setTitle] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(150);
  const [setupCost, setSetupCost] = useState(500);
  const [thirdPartyCost, setThirdPartyCost] = useState(250);
  const [marginPercent, setMarginPercent] = useState(30);
  const [paymentTerms, setPaymentTerms] = useState('50% de entrada + 50% na conclusão da entrega');
  const [scopeDetails, setScopeDetails] = useState('');

  // Real-time calculations
  const laborCost = estimatedHours * hourlyRate;
  const subtotalCost = laborCost + setupCost + thirdPartyCost;
  const marginAmount = subtotalCost * (marginPercent / 100);
  const calculatedTotal = subtotalCost + marginAmount;

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = initialClients.find((c) => c.id === clientId);

    const newProp: Proposal = {
      id: `prop-${Date.now()}`,
      code: `PROP-${new Date().getFullYear()}-${String(proposals.length + 1).padStart(3, '0')}`,
      title: title || 'Proposta de Serviços Elohdigital',
      status: 'DRAFT',
      clientId: clientId,
      clientName: selectedClient ? selectedClient.tradeName : 'Cliente',
      estimatedHours,
      hourlyRate,
      laborCost,
      setupCost,
      thirdPartyCost,
      marginPercent,
      totalAmount: Math.round(calculatedTotal),
      paymentTerms,
      scopeDetails: scopeDetails || 'Serviços de consultoria, implantação técnica e validação de entrega.',
      validUntil: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    setProposals([newProp, ...proposals]);
    setShowModal(false);
  };

  return (
    <>
      <Header
        title="Orçamentos & Calculadora de Custos"
        subtitle="Cálculo detalhado de horas técnicas, custos de setup, margem de lucro e geração de propostas"
      >
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-md shadow-cyan-500/10"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Criar Orçamento</span>
        </button>
      </Header>

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Lista de Propostas Existentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {proposals.map((prop) => (
            <div
              key={prop.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    {prop.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prop.status === 'ACCEPTED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : prop.status === 'SENT'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {prop.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white mt-1 leading-snug">{prop.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Cliente: {prop.clientName}</p>

                {/* Grid de Custos */}
                <div className="mt-4 p-3 bg-slate-950/70 rounded-xl space-y-1.5 border border-slate-800/60 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Horas ({prop.estimatedHours}h × R$ {prop.hourlyRate})</span>
                    <span className="text-slate-200 font-mono">R$ {prop.laborCost.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Custo de Setup</span>
                    <span className="text-slate-200 font-mono">R$ {prop.setupCost.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Terceiros / APIs</span>
                    <span className="text-slate-200 font-mono">R$ {prop.thirdPartyCost.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Margem Aplicada</span>
                    <span className="text-emerald-400 font-mono">+{prop.marginPercent}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Valor Total</span>
                  <span className="text-lg font-black text-white font-mono">
                    R$ {prop.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Imprimir / Exportar Proposta"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal da Calculadora Inteligente de Orçamento */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base font-bold text-white">Calculadora Inteligente de Orçamento</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProposal} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Cliente</label>
                    <select
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-cyan-500 outline-none"
                    >
                      {initialClients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.tradeName} ({c.segment || 'Geral'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Título do Serviço</label>
                    <input
                      type="text"
                      placeholder="Ex: Dashboard BI + Setup Automação WhatsApp"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-cyan-500 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Bloco de Cálculo de Custo Homem-Hora e Setup */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    Composição do Custo Técnico & Setup
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Horas Estimadas</label>
                      <input
                        type="number"
                        min="1"
                        value={estimatedHours}
                        onChange={(e) => setEstimatedHours(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Valor da Hora (R$)</label>
                      <input
                        type="number"
                        min="0"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Custo de Setup (R$)</label>
                      <input
                        type="number"
                        min="0"
                        value={setupCost}
                        onChange={(e) => setSetupCost(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                        title="Configuração inicial, hospedagem, APIs, setup de contas"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Custos Terceiros (R$)</label>
                      <input
                        type="number"
                        min="0"
                        value={thirdPartyCost}
                        onChange={(e) => setThirdPartyCost(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                        title="APIs OpenAI, freelancers de apoio, plugins pagos"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-400">Margem de Lucro Desejada:</span>
                      <span className="text-emerald-400 font-bold">{marginPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={marginPercent}
                      onChange={(e) => setMarginPercent(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Resumo do Cálculo em Tempo Real */}
                <div className="p-4 bg-gradient-to-r from-blue-950/60 to-cyan-950/40 rounded-xl border border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Custo Direto Total:</span>
                    <span className="text-sm font-semibold text-slate-200">
                      R$ {subtotalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] text-emerald-400 block mt-0.5">
                      Lucro Líquido: R$ {marginAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-cyan-300 font-bold block uppercase tracking-wider">
                      Valor Final da Proposta
                    </span>
                    <span className="text-2xl font-black text-white font-mono">
                      R$ {calculatedTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Condição de Pagamento</label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Detalhamento do Escopo</label>
                  <textarea
                    rows={3}
                    placeholder="Descreva as entregas, etapas de validação e o que está incluso no serviço..."
                    value={scopeDetails}
                    onChange={(e) => setScopeDetails(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-cyan-500 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-cyan-500/20"
                  >
                    Salvar e Gerar Orçamento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
