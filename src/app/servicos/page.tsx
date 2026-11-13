'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { initialServices } from '@/lib/mockData';
import { ServiceItem } from '@/lib/types';
import { Package, Plus, BarChart3, Bot, Globe, Target, Briefcase } from 'lucide-react';

export default function ServicosPage() {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [showModal, setShowModal] = useState(false);

  // New service form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceItem['category']>('DATA_BI');
  const [billingType, setBillingType] = useState<ServiceItem['billingType']>('FIXED');
  const [basePrice, setBasePrice] = useState(3000);
  const [defaultHours, setDefaultHours] = useState(20);
  const [description, setDescription] = useState('');

  const getCategoryIcon = (cat: ServiceItem['category']) => {
    switch (cat) {
      case 'DATA_BI': return <BarChart3 className="w-4 h-4 text-cyan-400" />;
      case 'AUTOMATION': return <Bot className="w-4 h-4 text-indigo-400" />;
      case 'WEB_DEV': return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'PAID_TRAFFIC': return <Target className="w-4 h-4 text-amber-400" />;
      default: return <Briefcase className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const newSrv: ServiceItem = {
      id: `srv-${Date.now()}`,
      name,
      category,
      billingType,
      basePrice,
      defaultHours,
      description,
    };
    setServices([...services, newSrv]);
    setShowModal(false);
    setName('');
    setDescription('');
  };

  return (
    <>
      <Header
        title="Catálogo de Produtos & Serviços"
        subtitle="Portfólio de soluções da Elohdigital: Inteligência de Dados, Automação, Sites e Tráfego Pago"
      >
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Serviço</span>
        </button>
      </Header>

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    {getCategoryIcon(srv.category)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {srv.billingType === 'MONTHLY' ? 'MENSAL (RECORRENTE)' : srv.billingType === 'HOURLY' ? 'POR HORA' : 'PROJETO FECHADO'}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base mt-3 leading-snug">{srv.name}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{srv.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Preço Base</span>
                  <span className="text-base font-bold font-mono text-cyan-400">
                    R$ {srv.basePrice.toLocaleString('pt-BR')}
                    {srv.billingType === 'MONTHLY' && <span className="text-xs text-slate-400 font-normal">/mês</span>}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Horas Estimadas</span>
                  <span className="font-mono text-slate-300">{srv.defaultHours}h técnicas</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Novo Serviço */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white">Cadastrar Novo Serviço</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 text-sm">✕</button>
              </div>

              <form onSubmit={handleAddService} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Nome do Serviço</label>
                  <input
                    type="text"
                    placeholder="Ex: Auditoria de Dados & BI"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Categoria</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="DATA_BI">Análise de Dados / BI</option>
                      <option value="AUTOMATION">Automação de Apps</option>
                      <option value="WEB_DEV">Criação de Sites</option>
                      <option value="PAID_TRAFFIC">Gestão de Tráfego</option>
                      <option value="CONSULTING">Consultoria</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Modelo de Cobrança</label>
                    <select
                      value={billingType}
                      onChange={(e) => setBillingType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="FIXED">Valor Fixo (Projeto)</option>
                      <option value="MONTHLY">Mensalidade Recorrente</option>
                      <option value="HOURLY">Hora Técnica</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Preço Base (R$)</label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Horas Base</label>
                    <input
                      type="number"
                      value={defaultHours}
                      onChange={(e) => setDefaultHours(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Descrição</label>
                  <textarea
                    rows={3}
                    placeholder="O que está incluso neste pacote ou entrega..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
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
                    Salvar Serviço
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
