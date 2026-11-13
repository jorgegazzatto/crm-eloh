'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { initialTickets, initialClients } from '@/lib/mockData';
import { Ticket } from '@/lib/types';
import { Headphones, Plus, AlertCircle, CheckCircle2, Clock, Filter, AlertTriangle } from 'lucide-react';

export default function ChamadosPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [showModal, setShowModal] = useState(false);

  // New ticket form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState(initialClients[0].id);
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [category, setCategory] = useState<'BUG' | 'FEATURE_REQUEST' | 'REPORT_ADJUSTMENT' | 'ADS_CAMPAIGN' | 'GENERAL'>('REPORT_ADJUSTMENT');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const client = initialClients.find((c) => c.id === clientId);
    const newTkt: Ticket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: 100 + tickets.length + 1,
      title,
      description,
      clientId,
      clientName: client ? client.tradeName : 'Cliente',
      priority,
      category,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 48 * 3600000).toISOString(),
    };
    setTickets([newTkt, ...tickets]);
    setShowModal(false);
    setTitle('');
    setDescription('');
  };

  const updateTicketStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  return (
    <>
      <Header
        title="Central de Chamados & Demandas"
        subtitle="Abertura de solicitações, controle de bugs, ajustes de relatórios e SLAs de atendimento"
      >
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Abrir Chamado</span>
        </button>
      </Header>

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-3">
          {tickets.map((tkt) => {
            const isUrgent = tkt.priority === 'URGENT' || tkt.priority === 'HIGH';

            return (
              <div
                key={tkt.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{tkt.ticketNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isUrgent
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {tkt.priority}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {tkt.category}
                    </span>
                    <span className="text-xs font-bold text-cyan-400">{tkt.clientName}</span>
                  </div>

                  <h3 className="font-bold text-white text-sm">{tkt.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{tkt.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span>Aberto em: {new Date(tkt.createdAt).toLocaleString('pt-BR')}</span>
                    {tkt.slaDeadline && (
                      <span className="text-amber-400/90 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> SLA: {new Date(tkt.slaDeadline).toLocaleString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Selector */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <select
                    value={tkt.status}
                    onChange={(e) => updateTicketStatus(tkt.id, e.target.value as any)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-500"
                  >
                    <option value="OPEN">Aberto</option>
                    <option value="IN_PROGRESS">Em Execução</option>
                    <option value="WAITING_APPROVAL">Aguardando Cliente</option>
                    <option value="RESOLVED">Resolvido ✅</option>
                    <option value="CLOSED">Encerrado</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Novo Chamado */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white">Abertura de Chamado / Solicitação</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 text-sm">✕</button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Cliente Solicitante</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    {initialClients.map((c) => (
                      <option key={c.id} value={c.id}>{c.tradeName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Título da Demanda</label>
                  <input
                    type="text"
                    placeholder="Ex: Troca de criativo ou correção de métrica no BI"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Prioridade</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="LOW">Baixa</option>
                      <option value="MEDIUM">Média</option>
                      <option value="HIGH">Alta</option>
                      <option value="URGENT">Urgente (Crítica)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Categoria</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="REPORT_ADJUSTMENT">Ajuste em Relatório / BI</option>
                      <option value="ADS_CAMPAIGN">Alteração Campanha Tráfego</option>
                      <option value="BUG">Bug / Erro Técnico</option>
                      <option value="FEATURE_REQUEST">Nova Funcionalidade</option>
                      <option value="GENERAL">Geral</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Descrição Detalhada</label>
                  <textarea
                    rows={3}
                    placeholder="Detalhe o que precisa ser ajustado ou implementado..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    required
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
                    Abrir Chamado
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
