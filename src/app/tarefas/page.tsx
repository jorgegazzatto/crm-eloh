'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { initialTasks, initialClients } from '@/lib/mockData';
import { Task } from '@/lib/types';
import { CheckSquare, Plus, Clock, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';

export default function TarefasPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Task['priority']>('MEDIUM');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' }
          : t
      )
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const client = initialClients.find((c) => c.id === selectedClientId);
    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      title: newTitle,
      status: 'PENDING',
      priority: newPriority,
      dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      clientId: selectedClientId || undefined,
      clientName: client ? client.tradeName : undefined,
    };
    setTasks([newTask, ...tasks]);
    setShowModal(false);
    setNewTitle('');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'PENDING') return t.status !== 'COMPLETED';
    if (filter === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  return (
    <>
      <Header
        title="Gestão de Tarefas (To-Do)"
        subtitle="Central de afazeres diários, entregas operacionais e prioridades da Elohdigital"
      >
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nova Tarefa</span>
        </button>
      </Header>

      <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Filtros */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              Todas ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'PENDING' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              Pendentes ({tasks.filter((t) => t.status !== 'COMPLETED').length})
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
              }`}
            >
              Concluídas ({tasks.filter((t) => t.status === 'COMPLETED').length})
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';

            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-950/40 border-slate-900 opacity-60'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <h4 className={`text-sm font-semibold text-slate-200 ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                      {task.clientName && (
                        <span className="text-cyan-400 font-medium">Cliente: {task.clientName}</span>
                      )}
                      {task.projectName && (
                        <span className="text-indigo-300">Projeto: {task.projectName}</span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      task.priority === 'URGENT'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : task.priority === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Nova Tarefa */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white">Adicionar Tarefa</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 text-sm">✕</button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Título da Tarefa</label>
                  <input
                    type="text"
                    placeholder="Ex: Atualizar script de webhook n8n"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Prioridade</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="LOW">Baixa</option>
                      <option value="MEDIUM">Média</option>
                      <option value="HIGH">Alta</option>
                      <option value="URGENT">Urgente</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Cliente Vinculado</label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="">Nenhum (Avulsa)</option>
                      {initialClients.map((c) => (
                        <option key={c.id} value={c.id}>{c.tradeName}</option>
                      ))}
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
                    Criar Tarefa
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
