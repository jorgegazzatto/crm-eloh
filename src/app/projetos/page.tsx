'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { initialProjects, initialClients, initialSuppliers } from '@/lib/mockData';
import { Project, ProjectStage, Supplier } from '@/lib/types';
import {
  FolderKanban,
  Plus,
  Users,
  Lightbulb,
  Calendar,
  CheckSquare,
  Square,
  Sparkles,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  UserCheck,
  X,
  Search,
  UserPlus,
  Pencil,
} from 'lucide-react';

const STORAGE_PROJECTS_KEY = 'eloh_crm_projects';

export default function ProjetosPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showModal, setShowModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Project Form States
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState(initialClients[0]?.id || '');
  const [serviceType, setServiceType] = useState('DATA_BI');
  const [status, setStatus] = useState<Project['status']>('IN_PROGRESS');
  const [budget, setBudget] = useState(4500);
  const [brainstormNotes, setBrainstormNotes] = useState('');
  
  // Datas com Calendário
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultEndStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [targetEndDate, setTargetEndDate] = useState(defaultEndStr);

  // Parceiros Selecionados (dos cadastrados)
  const [availableSuppliers, setAvailableSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);
  const [customPartnerText, setCustomPartnerText] = useState('');
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');

  // Carregar projetos sincronizados do localStorage
  useEffect(() => {
    try {
      const storedProjs = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (storedProjs) {
        const parsed = JSON.parse(storedProjs);
        if (Array.isArray(parsed) && parsed.length > 0) setProjects(parsed);
      }
    } catch (e) {
      console.error('Erro ao ler projetos do localStorage:', e);
    }
  }, []);

  // Carregar lista sincronizada de fornecedores / parceiros do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('eloh_crm_suppliers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) setAvailableSuppliers(parsed);
      }
    } catch {}
  }, [showPartnerModal]);

  // Controle de expansão das etapas por projeto nos cards (inicia oculto/hide por padrão)
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});

  const toggleExpandStages = (projectId: string) => {
    setExpandedStages((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  // Abrir Modal de Criação (limpo)
  const openCreateModal = () => {
    setEditingProjectId(null);
    setName('');
    setClientId(initialClients[0]?.id || '');
    setServiceType('DATA_BI');
    setStatus('IN_PROGRESS');
    setBudget(4500);
    setStartDate(todayStr);
    setTargetEndDate(defaultEndStr);
    setBrainstormNotes('');
    setSelectedPartnerIds([]);
    setCustomPartnerText('');
    setStages([
      { id: 'stg-1', title: 'Briefing e Levantamento de Requisitos', completed: false },
      { id: 'stg-2', title: 'Setup de Ambiente e Arquitetura', completed: false },
      { id: 'stg-3', title: 'Desenvolvimento e Configurações', completed: false },
      { id: 'stg-4', title: 'Homologação e Validação Final', completed: false },
    ]);
    setShowModal(true);
  };

  // Abrir Modal de Edição (carrega dados do projeto)
  const openEditModal = (proj: Project) => {
    setEditingProjectId(proj.id);
    setName(proj.name);
    setClientId(proj.clientId);
    setServiceType(proj.serviceType);
    setStatus(proj.status);
    setBudget(proj.budget);
    setStartDate(proj.startDate);
    setTargetEndDate(proj.targetEndDate);
    setBrainstormNotes(proj.brainstormNotes || '');
    setSelectedPartnerIds(proj.partnerIds || []);
    setCustomPartnerText('');
    setStages(
      proj.stages && proj.stages.length > 0
        ? proj.stages.map((s) => ({ ...s }))
        : [
            { id: 'stg-1', title: 'Briefing e Levantamento de Requisitos', completed: false },
            { id: 'stg-2', title: 'Setup de Ambiente e Arquitetura', completed: false },
          ]
    );
    setShowModal(true);
  };

  // Excluir Projeto
  const handleDeleteProject = (projectId: string) => {
    if (confirm('Tem certeza de que deseja excluir este projeto?')) {
      const updated = projects.filter((p) => p.id !== projectId);
      setProjects(updated);
      try {
        localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(updated));
      } catch {}
      setShowModal(false);
    }
  };

  // Etapas a serem cumpridas
  const [stages, setStages] = useState<{ id: string; title: string; completed: boolean }[]>([
    { id: 'stg-1', title: 'Briefing e Levantamento de Requisitos', completed: false },
    { id: 'stg-2', title: 'Setup de Ambiente e Arquitetura', completed: false },
    { id: 'stg-3', title: 'Desenvolvimento e Configurações', completed: false },
    { id: 'stg-4', title: 'Homologação e Validação Final', completed: false },
  ]);
  const [newStageTitle, setNewStageTitle] = useState('');

  // Sugestões rápidas de etapas
  const suggestedStages = [
    'Kick-off & Alinhamento',
    'Wireframes & UI/UX',
    'Pipeline ETL & Conexão Banco',
    'Configuração de Campanhas',
    'Testes de Carga & Validação',
    'Treinamento da Equipe',
  ];

  const handleAddStage = () => {
    if (!newStageTitle.trim()) return;
    setStages([
      ...stages,
      {
        id: `stg-${Date.now()}`,
        title: newStageTitle.trim(),
        completed: false,
      },
    ]);
    setNewStageTitle('');
  };

  const handleAddSuggestedStage = (title: string) => {
    if (stages.some((s) => s.title === title)) return;
    setStages([
      ...stages,
      {
        id: `stg-${Date.now()}-${Math.random()}`,
        title,
        completed: false,
      },
    ]);
  };

  const handleRemoveStage = (id: string) => {
    setStages(stages.filter((s) => s.id !== id));
  };

  const handleTogglePartner = (partnerId: string) => {
    if (selectedPartnerIds.includes(partnerId)) {
      setSelectedPartnerIds(selectedPartnerIds.filter((id) => id !== partnerId));
    } else {
      setSelectedPartnerIds([...selectedPartnerIds, partnerId]);
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const client = initialClients.find((c) => c.id === clientId);

    // Nomes dos parceiros selecionados
    const chosenPartners = availableSuppliers
      .filter((s) => selectedPartnerIds.includes(s.id))
      .map((s) => s.name);

    if (customPartnerText.trim()) {
      chosenPartners.push(customPartnerText.trim());
    }

    // Cálculo inicial de progresso baseado nas etapas marcadas
    const completedCount = stages.filter((s) => s.completed).length;
    const calculatedProgress = stages.length > 0 ? Math.round((completedCount / stages.length) * 100) : 0;

    let finalStatus = status;
    if (calculatedProgress === 100) finalStatus = 'COMPLETED';

    let updatedProjects: Project[];
    if (editingProjectId) {
      // Atualizar projeto existente
      updatedProjects = projects.map((proj) => {
        if (proj.id !== editingProjectId) return proj;
        return {
          ...proj,
          name,
          serviceType,
          status: finalStatus,
          clientId,
          clientName: client ? client.tradeName : proj.clientName,
          startDate: startDate || todayStr,
          targetEndDate: targetEndDate || defaultEndStr,
          budget,
          brainstormNotes,
          partnerIds: selectedPartnerIds,
          partnersInvolved: chosenPartners.join(', ') || 'Equipe Interna Elohdigital',
          stages: stages,
          progressPercent: calculatedProgress,
        };
      });
    } else {
      // Criar novo projeto
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        name,
        status: finalStatus,
        serviceType,
        clientId,
        clientName: client ? client.tradeName : 'Cliente',
        startDate: startDate || todayStr,
        targetEndDate: targetEndDate || defaultEndStr,
        budget,
        brainstormNotes,
        partnerIds: selectedPartnerIds,
        partnersInvolved: chosenPartners.join(', ') || 'Equipe Interna Elohdigital',
        stages: stages,
        progressPercent: calculatedProgress,
      };
      updatedProjects = [newProj, ...projects];
    }

    setProjects(updatedProjects);
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(updatedProjects));
    } catch {}

    setShowModal(false);
  };

  // Alternar conclusão de etapa de um projeto existente e recalcular progresso
  const handleToggleProjectStage = (projectId: string, stageId: string) => {
    setProjects((prevProjects) => {
      const updated = prevProjects.map((proj) => {
        if (proj.id !== projectId) return proj;

        const currentStages = proj.stages || [];
        const updatedStages = currentStages.map((stg) =>
          stg.id === stageId ? { ...stg, completed: !stg.completed } : stg
        );

        const total = updatedStages.length;
        const completed = updatedStages.filter((s) => s.completed).length;
        const newProgress = total > 0 ? Math.round((completed / total) * 100) : proj.progressPercent;

        let newStatus = proj.status;
        if (newProgress === 100) newStatus = 'COMPLETED';
        else if (newProgress > 0 && proj.status === 'PLANNING') newStatus = 'IN_PROGRESS';

        return {
          ...proj,
          stages: updatedStages,
          progressPercent: newProgress,
          status: newStatus,
        };
      });

      try {
        localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(updated));
      } catch {}

      return updated;
    });
  };

  // Helper para calcular dias restantes
  const getDaysRemaining = (endDateStr: string) => {
    try {
      const end = new Date(endDateStr);
      const now = new Date();
      const diffTime = end.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors">
      <Header
        title="Gestão de Projetos & Brainstorming"
        subtitle="Acompanhe entregas, etapas com checklist de progresso automático, equipe alocada e prazos"
      >
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md shadow-cyan-500/10 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Projeto</span>
        </button>
      </Header>

      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Grid de Projetos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((proj) => {
            const daysLeft = getDaysRemaining(proj.targetEndDate);
            const totalStages = proj.stages?.length || 0;
            const completedStages = proj.stages?.filter((s) => s.completed).length || 0;

            return (
              <div
                key={proj.id}
                className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800/40 uppercase tracking-wider">
                          {proj.serviceType}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            proj.status === 'COMPLETED'
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40'
                              : proj.status === 'PLANNING'
                              ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800/40'
                              : proj.status === 'IN_REVIEW'
                              ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800/40'
                              : proj.status === 'PAUSED'
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40'
                          }`}
                        >
                          {proj.status === 'COMPLETED'
                            ? 'Concluído'
                            : proj.status === 'PLANNING'
                            ? 'Planejamento'
                            : proj.status === 'IN_REVIEW'
                            ? 'Em Revisão'
                            : proj.status === 'PAUSED'
                            ? 'Pausado'
                            : 'Em Andamento'}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1.5">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Cliente: <strong className="text-slate-700 dark:text-slate-200">{proj.clientName}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Orçamento</span>
                      <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        R$ {proj.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progresso com Atualização Automática */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <span>Progresso da Entrega:</span>
                        {totalStages > 0 && (
                          <span className="text-[11px] font-normal text-slate-400">
                            ({completedStages} de {totalStages} etapas)
                          </span>
                        )}
                      </span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold font-mono">
                        {proj.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${proj.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Etapas / Checklist de Entregas com Expansão (Oculto/Hide por padrão com seta) */}
                  {proj.stages && proj.stages.length > 0 && (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/70 overflow-hidden transition-all">
                      <button
                        type="button"
                        onClick={() => toggleExpandStages(proj.id)}
                        className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-100/70 dark:hover:bg-slate-900/60 transition-colors select-none"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                          <CheckSquare className="w-4 h-4 text-cyan-500" />
                          <span>Etapas do Projeto</span>
                          <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                            ({completedStages} de {totalStages} concluídas)
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">
                            {expandedStages[proj.id] ? 'Recolher' : 'Expandir etapas'}
                          </span>
                          <span
                            className={`p-1 rounded text-slate-400 transition-transform duration-200 ${
                              expandedStages[proj.id] ? 'rotate-180 text-cyan-500' : ''
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </span>
                        </div>
                      </button>

                      {/* Lista de Etapas (Apenas quando expandido) */}
                      {expandedStages[proj.id] && (
                        <div className="p-3 pt-0 border-t border-slate-200 dark:border-slate-800/60 mt-1 space-y-1.5 max-h-56 overflow-y-auto">
                          <p className="text-[11px] text-slate-400 pt-2 pb-1">
                            Marque a etapa para recalcular o progresso automaticamente:
                          </p>
                          {proj.stages.map((stg) => (
                            <button
                              key={stg.id}
                              type="button"
                              onClick={() => handleToggleProjectStage(proj.id, stg.id)}
                              className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-all ${
                                stg.completed
                                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 line-through'
                                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800'
                              }`}
                            >
                              <span className="mt-0.5 flex-shrink-0">
                                {stg.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400" />
                                )}
                              </span>
                              <span className="flex-1 font-medium">{stg.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Área de Brainstorming & Ideias */}
                  {proj.brainstormNotes && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300 text-xs font-semibold">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Brainstorming & Notas Técnicas:</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {proj.brainstormNotes}
                      </p>
                    </div>
                  )}

                  {/* Parceiros Envolvidos */}
                  {proj.partnersInvolved && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                      <Users className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                      <span className="truncate">
                        <strong className="text-slate-800 dark:text-slate-200">Parceiros / Freelancers:</strong>{' '}
                        {proj.partnersInvolved}
                      </span>
                    </div>
                  )}
                </div>

                {/* Rodapé com Datas de Início e Entrega (Calendário) e Botão Editar */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Início: {new Date(proj.startDate).toLocaleDateString('pt-BR')}</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                      <Clock className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Entrega: {new Date(proj.targetEndDate).toLocaleDateString('pt-BR')}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Botão de Editar Projeto na parte de baixo do card */}
                    <button
                      type="button"
                      onClick={() => openEditModal(proj)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-cyan-50 dark:bg-slate-800/80 dark:hover:bg-cyan-950/60 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700/60 text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-xs"
                      title="Editar Informações do Projeto"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Editar</span>
                    </button>

                    {proj.status === 'COMPLETED' ? (
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40">
                        Entrega Concluída ✓
                      </span>
                    ) : daysLeft !== null ? (
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          daysLeft < 0
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            : daysLeft <= 5
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {daysLeft < 0 ? `Atrasado ${Math.abs(daysLeft)}d` : `${daysLeft} dias restantes`}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL: CRIAR OU EDITAR PROJETO */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl my-8">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    {editingProjectId ? <Pencil className="w-5 h-5" /> : <FolderKanban className="w-5 h-5" />}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {editingProjectId ? 'Editar Projeto' : 'Criar Novo Projeto'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {editingProjectId
                        ? 'Atualize escopo, status, equipe parceira, etapas e cronograma'
                        : 'Cadastre escopo, equipe parceira, etapas e cronograma com calendário'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg px-2"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                {/* 1. Nome & Cliente */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nome do Projeto *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Implantação ETL & Relatórios de Vendas"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Cliente *
                    </label>
                    <select
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                    >
                      {initialClients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.tradeName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Tipo de Serviço
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="DATA_BI">BI & Dados</option>
                      <option value="AUTOMATION">Automação & Apps</option>
                      <option value="WEB_DEV">Desenvolvimento Web</option>
                      <option value="PAID_TRAFFIC">Tráfego Pago</option>
                      <option value="CONSULTING">Consultoria</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Status do Projeto
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Project['status'])}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-medium"
                    >
                      <option value="PLANNING">Planejamento</option>
                      <option value="IN_PROGRESS">Em Andamento</option>
                      <option value="IN_REVIEW">Em Revisão</option>
                      <option value="COMPLETED">Concluído</option>
                      <option value="PAUSED">Pausado</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Orçamento (R$)
                    </label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      required
                    />
                  </div>
                </div>

                {/* 2. DATAS COM SELETOR DE CALENDÁRIO (INÍCIO E ENTREGA) */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Calendar className="w-4 h-4 text-cyan-500" />
                    <span>Cronograma do Projeto (Calendário)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Data de Início (Calendário) *
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Data Prevista de Entrega (Calendário) *
                      </label>
                      <input
                        type="date"
                        value={targetEndDate}
                        onChange={(e) => setTargetEndDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 3. PARCEIROS ENVOLVIDOS / FREELANCERS (EXIBE SOMENTE OS ESCOLHIDOS + CAIXA FLUTUANTE) */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-cyan-500" />
                      Parceiros Envolvidos & Freelancers:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPartnerModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{selectedPartnerIds.length > 0 ? 'Gerenciar Parceiros' : '+ Escolher Parceiros'}</span>
                    </button>
                  </div>

                  {/* Exibição SOMENTE DOS ESCOLHIDOS */}
                  {selectedPartnerIds.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableSuppliers
                        .filter((supp) => selectedPartnerIds.includes(supp.id))
                        .map((supp) => (
                          <div
                            key={supp.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-cyan-500/50 shadow-xs"
                          >
                            <div className="flex items-center gap-2.5 truncate pr-1">
                              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {supp.name.charAt(0)}
                              </div>
                              <div className="truncate">
                                <p className="font-semibold text-xs text-slate-800 dark:text-slate-100 truncate">
                                  {supp.name}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {supp.category} {supp.hourlyRate ? `• R$ ${supp.hourlyRate}/h` : ''}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleTogglePartner(supp.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
                              title="Remover parceiro"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div
                      onClick={() => setShowPartnerModal(true)}
                      className="p-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white/60 dark:bg-slate-950/40 cursor-pointer hover:border-cyan-500/50 transition-colors"
                    >
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Nenhum parceiro cadastrado selecionado ainda.
                      </p>
                      <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-1 inline-block">
                        Clique aqui para abrir a caixa de múltipla escolha
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                      Ou informe parceiro pontual complementar:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Designer Externo, Copywriter convidado..."
                      value={customPartnerText}
                      onChange={(e) => setCustomPartnerText(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* 4. ETAPAS A SEREM CUMPRIDAS (CHECKLIST COM AVANÇO AUTOMÁTICO DE PROGRESSO) */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-cyan-500" />
                      Etapas a serem cumpridas (Avançam o progresso ao marcar check):
                    </span>
                    <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                      {stages.length} etapas cadastradas
                    </span>
                  </div>

                  {/* Sugestões rápidas para adicionar */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">Sugestões rápidas:</span>
                    {suggestedStages.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => handleAddSuggestedStage(sug)}
                        className="text-[10px] bg-white dark:bg-slate-950 hover:bg-cyan-50 dark:hover:bg-cyan-950 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 transition-colors"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>

                  {/* Campo de Inserir Nova Etapa */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digitar nova etapa do projeto..."
                      value={newStageTitle}
                      onChange={(e) => setNewStageTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddStage();
                        }
                      }}
                      className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddStage}
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
                    >
                      + Adicionar
                    </button>
                  </div>

                  {/* Lista de Etapas com Checkbox inicial */}
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {stages.map((stg, index) => (
                      <div
                        key={stg.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setStages(
                              stages.map((s) =>
                                s.id === stg.id ? { ...s, completed: !s.completed } : s
                              )
                            );
                          }}
                          className="flex items-center gap-2 text-left flex-1"
                        >
                          <span className="text-cyan-500">
                            {stg.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </span>
                          <span
                            className={`font-medium ${
                              stg.completed
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {index + 1}. {stg.title}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveStage(stg.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="Remover etapa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Brainstorming & Anotações */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Área de Brainstorming & Ideias Técnicas
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Inspirações, referências visuais, arquitetura planejada, requisitos..."
                    value={brainstormNotes}
                    onChange={(e) => setBrainstormNotes(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>

                {/* Botões do Modal */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    {editingProjectId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(editingProjectId)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir Projeto</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      {editingProjectId ? 'Salvar Alterações' : 'Salvar Projeto'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CAIXA FLUTUANTE PARA MÚLTIPLA ESCOLHA DE PARCEIROS */}
        {showPartnerModal && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Users className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Selecionar Parceiros Cadastrados
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Marque os profissionais de acordo com os cadastrados no sistema
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-base p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Busca rápida */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar parceiros por nome ou categoria..."
                  value={partnerSearchQuery}
                  onChange={(e) => setPartnerSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Lista com checkboxes para múltipla escolha */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {availableSuppliers
                  .filter(
                    (supp) =>
                      supp.name.toLowerCase().includes(partnerSearchQuery.toLowerCase()) ||
                      supp.category.toLowerCase().includes(partnerSearchQuery.toLowerCase()) ||
                      (supp.skills && supp.skills.toLowerCase().includes(partnerSearchQuery.toLowerCase()))
                  )
                  .map((supp) => {
                    const isSelected = selectedPartnerIds.includes(supp.id);
                    return (
                      <button
                        key={supp.id}
                        type="button"
                        onClick={() => handleTogglePartner(supp.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all border ${
                          isSelected
                            ? 'bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-500 text-cyan-900 dark:text-cyan-100 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate pr-2">
                          <span className="mt-0.5 flex-shrink-0">
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </span>
                          <div className="truncate">
                            <p className="font-bold text-xs truncate">{supp.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {supp.category}
                              {supp.fixedProjectCost ? ` • Fixo: R$ ${supp.fixedProjectCost.toLocaleString('pt-BR')}` : ''}
                              {supp.monthlyRetainer ? ` • Mensal: R$ ${supp.monthlyRetainer.toLocaleString('pt-BR')}/mês` : ''}
                              {supp.hourlyRate ? ` • R$ ${supp.hourlyRate.toLocaleString('pt-BR')}/h` : ''}
                            </p>
                          </div>
                        </div>
                        {supp.pixKey && (
                          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline-block">
                            PIX cadastrado
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>

              {/* Rodapé da caixa flutuante */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">
                  {selectedPartnerIds.length} selecionado(s)
                </span>
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  Concluir Seleção
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
