'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { initialOnboardingSteps, initialClients } from '@/lib/mockData';
import { OnboardingStep } from '@/lib/types';
import { Rocket, CheckCircle2, Clock, AlertCircle, Plus, ShieldCheck, Key, MessageCircle, FileSignature } from 'lucide-react';

export default function OnboardingPage() {
  const [steps, setSteps] = useState<OnboardingStep[]>(initialOnboardingSteps);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'CONTRACT' | 'ACCESS' | 'COMMUNICATION' | 'KICKOFF' | 'SETUP'>('ACCESS');
  const [selectedClientId, setSelectedClientId] = useState(initialClients[2].id);

  const toggleStatus = (stepId: string) => {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id !== stepId) return s;
        const nextStatus = s.status === 'COMPLETED' ? 'PENDING' : s.status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED';
        return {
          ...s,
          status: nextStatus,
          completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
        };
      })
    );
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    const client = initialClients.find((c) => c.id === selectedClientId);
    const newStep: OnboardingStep = {
      id: `onb-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      status: 'PENDING',
      clientId: selectedClientId,
      clientName: client ? client.tradeName : 'Cliente',
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    };
    setSteps([...steps, newStep]);
    setShowModal(false);
    setNewTitle('');
  };

  const completedCount = steps.filter((s) => s.status === 'COMPLETED').length;
  const progressPercent = Math.round((completedCount / steps.length) * 100) || 0;

  return (
    <>
      <Header
        title="Onboarding do Cliente"
        subtitle="Checklist estruturado para entrada de novos clientes, coleta de acessos e alinhamento de kick-off"
      >
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Passo</span>
        </button>
      </Header>

      <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
        {/* Barra de Progresso Geral */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Progresso Geral do Onboarding</h3>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {completedCount} de {steps.length} etapas concluídas ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Lista de Passos */}
        <div className="space-y-3">
          {steps.map((step) => {
            const isCompleted = step.status === 'COMPLETED';
            const isInProgress = step.status === 'IN_PROGRESS';

            return (
              <div
                key={step.id}
                onClick={() => toggleStatus(step.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-950/40 border-emerald-950/40 opacity-75'
                    : isInProgress
                    ? 'bg-slate-900 border-cyan-500/50 shadow-md shadow-cyan-500/5'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isInProgress ? (
                      <Clock className="w-5 h-5 text-cyan-400 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {step.category}
                      </span>
                      <span className="text-xs font-bold text-cyan-400">{step.clientName}</span>
                    </div>
                    <h4 className={`text-sm font-semibold text-slate-200 mt-1 ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                      {step.title}
                    </h4>
                    {step.notes && <p className="text-xs text-amber-300/80 mt-1">{step.notes}</p>}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isInProgress
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.status}
                  </span>
                  {step.dueDate && (
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Prazo: {new Date(step.dueDate).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Novo Passo */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white">Adicionar Etapa de Onboarding</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 text-sm">✕</button>
              </div>

              <form onSubmit={handleAddStep} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Título da Etapa</label>
                  <input
                    type="text"
                    placeholder="Ex: Coleta de credenciais Meta Business Manager"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Cliente</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    {initialClients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.tradeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="ACCESS">Coleta de Acessos / Senhas</option>
                    <option value="CONTRACT">Contrato e Documentação</option>
                    <option value="COMMUNICATION">Canais de Comunicação (WhatsApp/Slack)</option>
                    <option value="KICKOFF">Reunião de Kick-off</option>
                    <option value="SETUP">Setup Inicial de Ferramentas</option>
                  </select>
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
                    Salvar Etapa
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
