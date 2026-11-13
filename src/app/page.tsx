'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import {
  TrendingUp,
  Users,
  DollarSign,
  Kanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Headphones,
  Calendar,
  MessageSquare,
  Sparkles,
  ChevronRight,
  CheckSquare,
} from 'lucide-react';
import {
  initialClients,
  initialDeals,
  initialProjects,
  initialTickets,
  initialTasks,
  initialTransactions,
  initialContacts,
} from '@/lib/mockData';

export default function DashboardPage() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' }
          : t
      )
    );
  };

  // KPIs
  const totalRevenueMonth = initialTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenseMonth = initialTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const pipelineTotal = initialDeals
    .filter((d) => d.stage !== 'LOST')
    .reduce((acc, d) => acc + d.estimatedValue, 0);

  const activeProjectsCount = initialProjects.filter((p) => p.status === 'IN_PROGRESS').length;
  const openTicketsCount = initialTickets.filter((t) => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;

  return (
    <>
      <Header
        title="Painel Executivo"
        subtitle="Visão geral de negócios, performance comercial, projetos e fluxo financeiro"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Banner de Boas-Vindas & Status */}
        <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-cyan-950/40 rounded-2xl p-6 border border-cyan-500/20 relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Elohdigital — Gestão Estratégica
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Controle Comercial, Operação & Entregas
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1">
                Acompanhe o ciclo completo dos seus clientes em BI, Automação, Criação de Sites e Tráfego Pago.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/pipeline"
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Kanban className="w-4 h-4" />
                Ver Funil de Vendas
              </Link>
              <Link
                href="/orcamentos"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/10 transition-all"
              >
                <DollarSign className="w-4 h-4" />
                Calcular Proposta
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Cards de Métricas Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Faturamento do Mês */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Receitas do Mês</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white">
                R$ {totalRevenueMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Previsto + Realizado</span>
              </div>
            </div>
          </div>

          {/* Card 2: Funil / Pipeline */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Pipeline Ativo</span>
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Kanban className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white">
                R$ {pipelineTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-cyan-400">
                <span>{initialDeals.length} negociações em andamento</span>
              </div>
            </div>
          </div>

          {/* Card 3: Projetos Ativos */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Projetos em Execução</span>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white">{activeProjectsCount} Projetos</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-indigo-300">
                <span>BI, Sites e Automação</span>
              </div>
            </div>
          </div>

          {/* Card 4: Chamados & Atendimento */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Chamados Abertos</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Headphones className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white">{openTicketsCount} Demandas</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Dentro do prazo SLA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Dupla: Follow-ups do Dia + Funil Resumido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Follow-ups & Contatos Recentes (Coluna 1 & 2) */}
          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Histórico de Contatos & Próximos Follow-ups</h3>
              </div>
              <Link href="/contatos" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {initialContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {contact.channel}
                        </span>
                        <h4 className="text-xs font-bold text-white">{contact.clientName}</h4>
                        <span className="text-[11px] text-slate-500">
                          {new Date(contact.date).toLocaleString('pt-BR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">{contact.summary}</p>
                    </div>
                  </div>

                  {contact.nextFollowUp && (
                    <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between text-xs">
                      <span className="text-amber-300 font-medium flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3 h-3 text-amber-400" />
                        Próximo retorno: {new Date(contact.nextFollowUp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                      <a
                        href="https://web.whatsapp.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Abrir WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tarefas Operacionais To-Do do Dia (Coluna 3) */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">To-Do do Dia</h3>
              </div>
              <Link href="/tarefas" className="text-xs text-cyan-400 hover:underline">
                Gerenciar
              </Link>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                    task.status === 'COMPLETED'
                      ? 'bg-slate-950/40 border-slate-800/50 opacity-60 line-through'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.status === 'COMPLETED'}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-200">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {task.clientName && (
                        <span className="text-[10px] text-cyan-400">{task.clientName}</span>
                      )}
                      {task.priority === 'URGENT' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                          URGENTE
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="text-[10px] text-slate-500">
                          {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projetos em Andamento & Chamados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projetos */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Projetos & Entregas Ativas</h3>
              <Link href="/projetos" className="text-xs text-cyan-400 hover:underline">
                Ver todos
              </Link>
            </div>

            <div className="space-y-4">
              {initialProjects.map((proj) => (
                <div key={proj.id} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-white">{proj.name}</h4>
                    <span className="text-[11px] font-bold text-cyan-400">{proj.progressPercent}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">Cliente: {proj.clientName}</p>

                  {/* Barra de Progresso */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all"
                      style={{ width: `${proj.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                    <span>Prazo: {new Date(proj.targetEndDate).toLocaleDateString('pt-BR')}</span>
                    <span className="font-semibold text-slate-300">
                      Orçamento: R$ {proj.budget.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chamados Recentes */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Central de Chamados / Solicitações</h3>
              <Link href="/chamados" className="text-xs text-cyan-400 hover:underline">
                Abrir Chamado
              </Link>
            </div>

            <div className="space-y-3">
              {initialTickets.map((ticket) => (
                <div key={ticket.id} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      #{ticket.ticketNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ticket.priority === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 mt-1">{ticket.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{ticket.description}</p>

                  <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Cliente: {ticket.clientName}</span>
                    <span className="text-cyan-400 font-medium">Status: {ticket.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
