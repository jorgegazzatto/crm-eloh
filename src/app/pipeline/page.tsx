'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { initialDeals, initialClients } from '@/lib/mockData';
import { LeadDeal, PipelineStage } from '@/lib/types';
import { Kanban, Plus, DollarSign, ArrowRight, ArrowLeft, Trophy, XCircle, AlertCircle } from 'lucide-react';

const stages: { id: PipelineStage; name: string; color: string }[] = [
  { id: 'DISCOVERY', name: '1. Descoberta / Lead', color: 'border-slate-700' },
  { id: 'QUALIFIED', name: '2. Qualificado / Diagnóstico', color: 'border-blue-500/50' },
  { id: 'PROPOSAL_SENT', name: '3. Proposta Enviada', color: 'border-cyan-500/50' },
  { id: 'NEGOTIATION', name: '4. Negociação', color: 'border-amber-500/50' },
  { id: 'WON', name: '5. Fechado (Ganho) 🎉', color: 'border-emerald-500/60' },
  { id: 'LOST', name: '6. Perdido', color: 'border-rose-500/50' },
];

export default function PipelinePage() {
  const [deals, setDeals] = useState<LeadDeal[]>(initialDeals);
  const [showModal, setShowModal] = useState(false);

  // New Deal form
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState(initialClients[0].id);
  const [estimatedValue, setEstimatedValue] = useState(3500);
  const [probability, setProbability] = useState(50);
  const [serviceType, setServiceType] = useState('DATA_BI');

  const moveStage = (dealId: string, direction: 'prev' | 'next') => {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id !== dealId) return deal;
        const currentIndex = stages.findIndex((s) => s.id === deal.stage);
        const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex < 0 || nextIndex >= stages.length) return deal;
        return { ...deal, stage: stages[nextIndex].id };
      })
    );
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const client = initialClients.find((c) => c.id === clientId);
    const newDeal: LeadDeal = {
      id: `deal-${Date.now()}`,
      title,
      stage: 'DISCOVERY',
      estimatedValue,
      probability,
      clientId,
      clientName: client ? client.tradeName : 'Cliente',
      serviceType,
      priority: 'MEDIUM',
      createdAt: new Date().toISOString(),
    };
    setDeals([newDeal, ...deals]);
    setShowModal(false);
    setTitle('');
  };

  const totalValue = deals
    .filter((d) => d.stage !== 'LOST')
    .reduce((acc, d) => acc + d.estimatedValue, 0);

  return (
    <>
      <Header
        title="Funil de Vendas & Prospecção (Kanban)"
        subtitle={`Total em negociação: R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
      >
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Lead</span>
        </button>
      </Header>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full overflow-x-auto">
        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 min-w-[1200px]">
          {stages.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.id);
            const stageTotal = stageDeals.reduce((acc, d) => acc + d.estimatedValue, 0);

            return (
              <div
                key={stage.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col max-h-[80vh]"
              >
                {/* Stage Header */}
                <div className={`p-3.5 border-b border-slate-800 border-t-2 ${stage.color} bg-slate-950/40 rounded-t-xl`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-white truncate">{stage.name}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {stageDeals.length}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-cyan-400 mt-1 font-semibold">
                    R$ {stageTotal.toLocaleString('pt-BR')}
                  </p>
                </div>

                {/* Cards Container */}
                <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5">
                  {stageDeals.length === 0 ? (
                    <div className="p-6 text-center text-[11px] text-slate-600">Nenhum lead nesta etapa</div>
                  ) : (
                    stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-slate-950 p-3 rounded-lg border border-slate-800/90 hover:border-slate-700 transition-all shadow-sm space-y-2.5"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800/40">
                              {deal.serviceType}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {deal.probability}% prob.
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-200 mt-1.5 leading-snug">{deal.title}</h4>
                          <p className="text-[11px] text-slate-400">{deal.clientName}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                          <span className="font-mono font-bold text-white text-[11px]">
                            R$ {deal.estimatedValue.toLocaleString('pt-BR')}
                          </span>

                          {/* Stage Transition Controls */}
                          <div className="flex items-center gap-1">
                            {stage.id !== 'DISCOVERY' && (
                              <button
                                onClick={() => moveStage(deal.id, 'prev')}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                                title="Voltar etapa"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {stage.id !== 'LOST' && (
                              <button
                                onClick={() => moveStage(deal.id, 'next')}
                                className="p-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40"
                                title="Avançar etapa"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Novo Lead */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white">Adicionar Novo Lead ao Funil</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 text-sm">✕</button>
              </div>

              <form onSubmit={handleAddDeal} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Título da Oportunidade</label>
                  <input
                    type="text"
                    placeholder="Ex: Auditoria de Dados + Tráfego Pago"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Cliente / Empresa</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    {initialClients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.tradeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Valor Estimado (R$)</label>
                    <input
                      type="number"
                      value={estimatedValue}
                      onChange={(e) => setEstimatedValue(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Tipo de Serviço</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="DATA_BI">Análise de Dados / BI</option>
                      <option value="AUTOMATION">Automação de Apps</option>
                      <option value="WEB_DEV">Site / Landing Page</option>
                      <option value="PAID_TRAFFIC">Gestão de Tráfego</option>
                      <option value="CONSULTING">Consultoria</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg"
                  >
                    Adicionar ao Funil
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
