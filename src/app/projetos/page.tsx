'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { initialProjects, initialClients } from '@/lib/mockData';
import { Project } from '@/lib/types';
import { FolderKanban, Plus, Users, Lightbulb, Calendar, CheckSquare, Sparkles } from 'lucide-react';

export default function ProjetosPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showModal, setShowModal] = useState(false);

  // New Project Form
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState(initialClients[0].id);
  const [serviceType, setServiceType] = useState('DATA_BI');
  const [budget, setBudget] = useState(4000);
  const [brainstormNotes, setBrainstormNotes] = useState('');
  const [partnersInvolved, setPartnersInvolved] = useState('');
  const [targetEndDate, setTargetEndDate] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const client = initialClients.find((c) => c.id === clientId);
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      status: 'PLANNING',
      serviceType,
      clientId,
      clientName: client ? client.tradeName : 'Cliente',
      startDate: new Date().toISOString().split('T')[0],
      targetEndDate: targetEndDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      budget,
      brainstormNotes,
      partnersInvolved,
      progressPercent: 10,
    };
    setProjects([newProj, ...projects]);
    setShowModal(false);
  };

  return (
    <>
      <Header
        title="Gestão de Projetos & Brainstorming"
        subtitle="Controle de entregas, notas de concepção, parceiros alocados e marcos contratuais"
      >
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Projeto</span>
        </button>
      </Header>

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 uppercase tracking-wider">
                      {proj.serviceType}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1.5">{proj.name}</h3>
                    <p className="text-xs text-slate-400">Cliente: {proj.clientName}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    R$ {proj.budget.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Progresso */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Progresso da Entrega</span>
                    <span className="text-cyan-400 font-bold">{proj.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
                      style={{ width: `${proj.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Área de Brainstorming & Ideias */}
                <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Brainstorm & Notas Técnicas:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {proj.brainstormNotes || 'Nenhuma anotação de brainstorm cadastrada.'}
                  </p>
                </div>

                {/* Parceiros / Equipe Envolvida */}
                {proj.partnersInvolved && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span><strong className="text-slate-200">Parceiros:</strong> {proj.partnersInvolved}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Entrega: {new Date(proj.targetEndDate).toLocaleDateString('pt-BR')}
                </span>
                <span className="text-cyan-400 font-medium">{proj.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Novo Projeto */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white">Criar Novo Projeto</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 text-sm">✕</button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Nome do Projeto</label>
                  <input
                    type="text"
                    placeholder="Ex: Implantação ETL & Relatórios de Vendas"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Cliente</label>
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
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Orçamento (R$)</label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Parceiros Envolvidos / Freelancers</label>
                  <input
                    type="text"
                    placeholder="Ex: Felipe Ramos (Front), Matheus (Tráfego)"
                    value={partnersInvolved}
                    onChange={(e) => setPartnersInvolved(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Área de Brainstorming & Ideias</label>
                  <textarea
                    rows={3}
                    placeholder="Inspirações, referências visuais, arquitetura planejada, requisitos..."
                    value={brainstormNotes}
                    onChange={(e) => setBrainstormNotes(e.target.value)}
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
                    Salvar Projeto
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
