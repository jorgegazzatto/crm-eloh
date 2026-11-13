'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { initialProposals, initialClients, initialSuppliers } from '@/lib/mockData';
import { Proposal, Client, Supplier, ProposalTeamMember, ProposalStructureItem, isFreelancerOrTeam, isStructureOrApi } from '@/lib/types';
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
  Pencil,
  Trash2,
  Search,
  AlertCircle,
  Tag,
  Briefcase,
  Users,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  UserPlus,
  Server,
  Banknote,
  Repeat,
} from 'lucide-react';

const STORAGE_PROPOSALS_KEY = 'eloh_crm_proposals';
const STORAGE_CLIENTS_KEY = 'eloh_crm_clients';
const STORAGE_SUPPLIERS_KEY = 'eloh_crm_suppliers';

const STATUS_CONFIG: Record<Proposal['status'], { label: string; badge: string }> = {
  DRAFT: {
    label: 'Rascunho',
    badge: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800/40',
  },
  SENT: {
    label: 'Enviada',
    badge: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800/40',
  },
  ACCEPTED: {
    label: 'Aprovada',
    badge: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/40',
  },
  DECLINED: {
    label: 'Recusada',
    badge: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800/40',
  },
};

export default function OrcamentosPage() {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [availableSuppliers, setAvailableSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [showModal, setShowModal] = useState(false);
  const [editingProposalId, setEditingProposalId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Sub-modal: Calculadora Detalhada de Mão de Obra e Estrutura
  const [showCostCalculatorModal, setShowCostCalculatorModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<ProposalTeamMember[]>([]);
  const [structureItems, setStructureItems] = useState<ProposalStructureItem[]>([]);

  // Form states
  const [clientId, setClientId] = useState(initialClients[0]?.id || '');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Proposal['status']>('DRAFT');
  const [estimatedHours, setEstimatedHours] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(150);
  const [setupCost, setSetupCost] = useState(500);
  const [thirdPartyCost, setThirdPartyCost] = useState(250);
  const [marginPercent, setMarginPercent] = useState(30);
  const [paymentTerms, setPaymentTerms] = useState('50% de entrada + 50% na conclusão da entrega');
  const [scopeDetails, setScopeDetails] = useState('');
  const [validUntil, setValidUntil] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Carregar dados salvos no localStorage
  useEffect(() => {
    try {
      const storedProps = localStorage.getItem(STORAGE_PROPOSALS_KEY);
      if (storedProps) {
        const parsed = JSON.parse(storedProps);
        if (Array.isArray(parsed) && parsed.length > 0) setProposals(parsed);
      } else {
        localStorage.setItem(STORAGE_PROPOSALS_KEY, JSON.stringify(initialProposals));
      }

      const storedClients = localStorage.getItem(STORAGE_CLIENTS_KEY);
      if (storedClients) {
        const parsedClients = JSON.parse(storedClients);
        if (Array.isArray(parsedClients) && parsedClients.length > 0) setClients(parsedClients);
      }

      const storedSuppliers = localStorage.getItem(STORAGE_SUPPLIERS_KEY);
      if (storedSuppliers) {
        const parsedSupp = JSON.parse(storedSuppliers);
        if (Array.isArray(parsedSupp) && parsedSupp.length > 0) setAvailableSuppliers(parsedSupp);
      }
    } catch (e) {
      console.error('Erro ao ler dados de orçamentos:', e);
    }
  }, []);

  // Cálculos em Tempo Real
  const laborCost = (estimatedHours || 0) * (hourlyRate || 0);
  const subtotalCost = laborCost + (setupCost || 0) + (thirdPartyCost || 0);
  const marginAmount = subtotalCost * ((marginPercent || 0) / 100);
  const calculatedTotal = subtotalCost + marginAmount;

  // Abrir Modal de Criação (limpo)
  const openCreateModal = () => {
    setEditingProposalId(null);
    setClientId(clients[0]?.id || '');
    setTitle('');
    setStatus('DRAFT');
    setEstimatedHours(20);
    setHourlyRate(150);
    setSetupCost(500);
    setThirdPartyCost(250);
    setMarginPercent(30);
    setPaymentTerms('50% de entrada + 50% na conclusão da entrega');
    setScopeDetails('');
    setValidUntil(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);

    // Inicializar equipe padrão com primeiro parceiro que é FREELANCER ou EQUIPE
    const teamPartners = availableSuppliers.filter(isFreelancerOrTeam);
    const defaultPartner = teamPartners[0];
    setTeamMembers(
      defaultPartner
        ? [
            {
              id: `mem-${Date.now()}`,
              supplierId: defaultPartner.id,
              name: defaultPartner.name,
              category: defaultPartner.category,
              billingType: 'HOURLY',
              hours: 20,
              rate: defaultPartner.hourlyRate || 150,
              total: 20 * (defaultPartner.hourlyRate || 150),
            },
          ]
        : []
    );

    // Inicializar estrutura com os fornecedores que são ESTRUTURA/APIs (todos MENOS freelancer e equipe)
    const structPartners = availableSuppliers.filter(isStructureOrApi);
    if (structPartners.length > 0) {
      setStructureItems(
        structPartners.map((s, idx) => {
          const isApi = (s.category || '').toLowerCase().includes('api') || (s.category || '').toLowerCase().includes('ia');
          const cost = s.monthlyRetainer || s.fixedProjectCost || (isApi ? 250 : 300);
          return {
            id: `str-${Date.now()}-${idx}`,
            supplierId: s.id,
            name: s.name,
            category: isApi ? 'THIRD_PARTY' : 'SETUP',
            cost,
          };
        })
      );
    } else {
      setStructureItems([
        {
          id: `str-1`,
          supplierId: '',
          name: 'Servidor VPS Oracle / Dokploy Host',
          category: 'SETUP',
          cost: 300,
        },
        {
          id: `str-2`,
          supplierId: '',
          name: 'APIs Inteligência Artificial & Terceiros',
          category: 'THIRD_PARTY',
          cost: 250,
        },
      ]);
    }

    setShowModal(true);
  };

  // Abrir Modal de Edição (carrega proposta)
  const openEditModal = (prop: Proposal) => {
    setEditingProposalId(prop.id);
    setClientId(prop.clientId);
    setTitle(prop.title);
    setStatus(prop.status);
    setEstimatedHours(prop.estimatedHours);
    setHourlyRate(prop.hourlyRate);
    setSetupCost(prop.setupCost);
    setThirdPartyCost(prop.thirdPartyCost);
    setMarginPercent(prop.marginPercent);
    setPaymentTerms(prop.paymentTerms || '50% de entrada + 50% na conclusão da entrega');
    setScopeDetails(prop.scopeDetails || '');
    setValidUntil(prop.validUntil ? prop.validUntil.split('T')[0] : '');

    // Carregar membros e estrutura da proposta se já salvos
    if (prop.teamMembers && prop.teamMembers.length > 0) {
      setTeamMembers(prop.teamMembers.map((m) => ({ ...m })));
    } else {
      const teamPartners = availableSuppliers.filter(isFreelancerOrTeam);
      const defaultPartner = teamPartners[0];
      setTeamMembers(
        defaultPartner
          ? [
              {
                id: `mem-${Date.now()}`,
                supplierId: defaultPartner.id,
                name: defaultPartner.name,
                category: defaultPartner.category,
                billingType: 'HOURLY',
                hours: prop.estimatedHours,
                rate: prop.hourlyRate,
                total: prop.estimatedHours * prop.hourlyRate,
              },
            ]
          : []
      );
    }

    if (prop.structureItems && prop.structureItems.length > 0) {
      setStructureItems(prop.structureItems.map((s) => ({ ...s })));
    } else {
      setStructureItems([
        {
          id: `str-1`,
          supplierId: '',
          name: 'Setup de Servidores & Hospedagem',
          category: 'SETUP',
          cost: prop.setupCost,
        },
        {
          id: `str-2`,
          supplierId: '',
          name: 'APIs & Ferramentas de Terceiros',
          category: 'THIRD_PARTY',
          cost: prop.thirdPartyCost,
        },
      ]);
    }

    setShowModal(true);
  };

  // Excluir Proposta
  const handleDeleteProposal = (propId: string) => {
    if (confirm('Tem certeza de que deseja excluir este orçamento do sistema?')) {
      const updated = proposals.filter((p) => p.id !== propId);
      setProposals(updated);
      try {
        localStorage.setItem(STORAGE_PROPOSALS_KEY, JSON.stringify(updated));
      } catch {}
      setShowModal(false);
      showToast('Orçamento excluído com sucesso.');
    }
  };

  // Salvar Orçamento (Criar ou Atualizar)
  const handleSaveProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find((c) => c.id === clientId);

    const calculatedLabor = (estimatedHours || 0) * (hourlyRate || 0);
    const calculatedSubtotal = calculatedLabor + (setupCost || 0) + (thirdPartyCost || 0);
    const calculatedMargin = calculatedSubtotal * ((marginPercent || 0) / 100);
    const finalTotal = Math.round(calculatedSubtotal + calculatedMargin);

    if (editingProposalId) {
      // Atualizar proposta existente
      const updated = proposals.map((p) => {
        if (p.id !== editingProposalId) return p;
        return {
          ...p,
          title: title.trim() || 'Proposta de Serviços Elohdigital',
          status,
          clientId,
          clientName: selectedClient ? selectedClient.tradeName : p.clientName,
          estimatedHours,
          hourlyRate,
          laborCost: calculatedLabor,
          setupCost,
          thirdPartyCost,
          marginPercent,
          totalAmount: finalTotal,
          paymentTerms,
          scopeDetails: scopeDetails.trim() || 'Serviços de consultoria, implantação técnica e validação de entrega.',
          validUntil: validUntil || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          teamMembers,
          structureItems,
        };
      });

      setProposals(updated);
      try {
        localStorage.setItem(STORAGE_PROPOSALS_KEY, JSON.stringify(updated));
      } catch {}
      showToast('Orçamento atualizado com sucesso!');
    } else {
      // Criar nova proposta
      const newProp: Proposal = {
        id: `prop-${Date.now()}`,
        code: `PROP-${new Date().getFullYear()}-${String(proposals.length + 1).padStart(3, '0')}`,
        title: title.trim() || 'Proposta de Serviços Elohdigital',
        status,
        clientId,
        clientName: selectedClient ? selectedClient.tradeName : 'Cliente',
        estimatedHours,
        hourlyRate,
        laborCost: calculatedLabor,
        setupCost,
        thirdPartyCost,
        marginPercent,
        totalAmount: finalTotal,
        paymentTerms,
        scopeDetails: scopeDetails.trim() || 'Serviços de consultoria, implantação técnica e validação de entrega.',
        validUntil: validUntil || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        teamMembers,
        structureItems,
      };

      const updated = [newProp, ...proposals];
      setProposals(updated);
      try {
        localStorage.setItem(STORAGE_PROPOSALS_KEY, JSON.stringify(updated));
      } catch {}
      showToast('Novo orçamento gerado com sucesso!');
    }

    setShowModal(false);
  };

  // ----------------------------------------------------
  // GESTÃO DO SUB-MODAL DE CÁLCULO DE EQUIPE & ESTRUTURA
  // ----------------------------------------------------
  const handleAddTeamMember = () => {
    // 1. Mão de Obra da Equipe & Freelancers: somente os que estão como freelancer ou equipe
    const teamSuppliers = availableSuppliers.filter(isFreelancerOrTeam);
    const firstSup = teamSuppliers[0] || availableSuppliers[0];
    const newMember: ProposalTeamMember = {
      id: `mem-${Date.now()}-${Math.random()}`,
      supplierId: firstSup?.id || '',
      name: firstSup?.name || 'Profissional / Freelancer',
      category: firstSup?.category || 'Desenvolvedor',
      billingType: 'HOURLY',
      hours: 15,
      rate: firstSup?.hourlyRate || 100,
      total: 15 * (firstSup?.hourlyRate || 100),
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const handleUpdateTeamMember = (id: string, field: keyof ProposalTeamMember, value: any) => {
    setTeamMembers(
      teamMembers.map((m) => {
        if (m.id !== id) return m;

        const updated = { ...m, [field]: value };

        // Se mudou o fornecedor, preencher nome, categoria e taxa padrão automaticamente
        if (field === 'supplierId') {
          const sup = availableSuppliers.find((s) => s.id === value);
          if (sup) {
            updated.name = sup.name;
            updated.category = sup.category;
            if (sup.hourlyRate) updated.rate = sup.hourlyRate;
            else if (sup.fixedProjectCost) updated.rate = sup.fixedProjectCost;
          }
        }

        // Recalcular total do membro
        if (updated.billingType === 'HOURLY') {
          updated.total = (Number(updated.hours) || 0) * (Number(updated.rate) || 0);
        } else {
          updated.total = Number(updated.rate) || 0;
        }

        return updated;
      })
    );
  };

  const handleRemoveTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  // 2. Estrutura Necessária: Setup, Infraestrutura & APIs de Terceiros (todos menos freelancer e equipe)
  const handleAddStructureItem = () => {
    const structSuppliers = availableSuppliers.filter(isStructureOrApi);
    const firstSup = structSuppliers[0];
    const isApi = firstSup && ((firstSup.category || '').toLowerCase().includes('api') || (firstSup.category || '').toLowerCase().includes('ia'));
    const defaultCost = firstSup ? (firstSup.monthlyRetainer || firstSup.fixedProjectCost || 200) : 200;

    const newItem: ProposalStructureItem = {
      id: `str-${Date.now()}-${Math.random()}`,
      supplierId: firstSup?.id || '',
      name: firstSup?.name || 'Servidor / Licença Adicional',
      category: isApi ? 'THIRD_PARTY' : 'SETUP',
      cost: defaultCost,
    };
    setStructureItems([...structureItems, newItem]);
  };

  const handleUpdateStructureItem = (id: string, field: keyof ProposalStructureItem, value: any) => {
    setStructureItems(
      structureItems.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, [field]: value };

        // Se selecionou um fornecedor cadastrado de estrutura/API
        if (field === 'supplierId') {
          const sup = availableSuppliers.find((item) => item.id === value);
          if (sup) {
            updated.name = sup.name;
            const isApi = (sup.category || '').toLowerCase().includes('api') || (sup.category || '').toLowerCase().includes('ia');
            updated.category = isApi ? 'THIRD_PARTY' : 'SETUP';
            const cost = sup.monthlyRetainer || sup.fixedProjectCost || 0;
            if (cost > 0) updated.cost = cost;
          }
        }

        return updated;
      })
    );
  };

  const handleRemoveStructureItem = (id: string) => {
    setStructureItems(structureItems.filter((s) => s.id !== id));
  };

  // Totais do Sub-modal
  const totalTeamHours = teamMembers.reduce((acc, m) => acc + (Number(m.hours) || 0), 0);
  const totalLaborCost = teamMembers.reduce((acc, m) => acc + (Number(m.total) || 0), 0);
  const averageHourlyRate =
    totalTeamHours > 0 ? Math.round(totalLaborCost / totalTeamHours) : 0;

  const totalSetupStructure = structureItems
    .filter((s) => s.category === 'SETUP')
    .reduce((acc, s) => acc + (Number(s.cost) || 0), 0);

  const totalThirdPartyStructure = structureItems
    .filter((s) => s.category === 'THIRD_PARTY')
    .reduce((acc, s) => acc + (Number(s.cost) || 0), 0);

  const grandDirectCost = totalLaborCost + totalSetupStructure + totalThirdPartyStructure;

  // Aplicar os totais somados ao Orçamento Principal
  const handleApplyCostCalculation = () => {
    setEstimatedHours(totalTeamHours > 0 ? totalTeamHours : 1);
    setHourlyRate(averageHourlyRate > 0 ? averageHourlyRate : 100);
    setSetupCost(totalSetupStructure);
    setThirdPartyCost(totalThirdPartyStructure);

    // Opcional: Anexar resumo dos parceiros ao escopo se estiver vazio
    if (!scopeDetails.trim() && teamMembers.length > 0) {
      const summaryNames = teamMembers.map((m) => `${m.name} (${m.hours}h)`).join(', ');
      setScopeDetails(`Alocação de mão de obra planejada: ${summaryNames}. Estrutura técnica e homologação inclusas.`);
    }

    setShowCostCalculatorModal(false);
    showToast('Valores da equipe e estrutura somados e aplicados com sucesso!');
  };

  // Filtragem de Propostas
  const filteredProposals = proposals.filter((p) => {
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors">
      <Header
        title="Orçamentos & Calculadora de Custos"
        subtitle="Cálculo detalhado de horas técnicas, custos de setup, margem de lucro e geração de propostas"
      >
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-md shadow-cyan-500/10 hover:scale-105 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Criar Orçamento</span>
        </button>
      </Header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Barra de Filtros & Busca */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por proposta, cliente ou código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 font-medium mr-1 flex-shrink-0">Status:</span>
            {['ALL', 'DRAFT', 'SENT', 'ACCEPTED', 'DECLINED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st === 'ALL' ? 'Todas' : STATUS_CONFIG[st as Proposal['status']]?.label || st}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Propostas Existentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProposals.map((prop) => {
            const statusInfo = STATUS_CONFIG[prop.status] || {
              label: prop.status,
              badge: 'bg-slate-100 text-slate-700',
            };

            return (
              <div
                key={prop.id}
                className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-xs space-y-4"
              >
                <div>
                  {/* Cabeçalho do Card com Código, Status e Botão EDITAR */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800/40">
                        {prop.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusInfo.badge}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* BOTÃO EDITAR NO CARD DO ORÇAMENTO */}
                    <button
                      type="button"
                      onClick={() => openEditModal(prop)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-cyan-50 dark:bg-slate-800/80 dark:hover:bg-cyan-950/60 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700/60 text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-xs"
                      title="Editar Valores e Dados deste Orçamento"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1 leading-snug">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Cliente:{' '}
                    <strong className="text-slate-700 dark:text-slate-300">
                      {prop.clientName}
                    </strong>
                  </p>

                  {/* Grid de Custos Detalhados */}
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950/70 rounded-xl space-y-1.5 border border-slate-200/80 dark:border-slate-800/60 text-xs">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Horas ({prop.estimatedHours}h × R$ {prop.hourlyRate})</span>
                      <span className="text-slate-800 dark:text-slate-200 font-mono font-medium">
                        R$ {prop.laborCost.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Custo de Setup</span>
                      <span className="text-slate-800 dark:text-slate-200 font-mono font-medium">
                        R$ {prop.setupCost.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Terceiros / APIs</span>
                      <span className="text-slate-800 dark:text-slate-200 font-mono font-medium">
                        R$ {prop.thirdPartyCost.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                      <span>Margem Aplicada</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        +{prop.marginPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rodapé com Valor Total, Imprimir e Ações */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                      Valor Total
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                      R$ {prop.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(prop)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                      title="Editar Orçamento"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                      title="Imprimir / Exportar Proposta"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL 1: CALCULADORA INTELIGENTE DE ORÇAMENTO */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-7 space-y-5 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Calculator className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {editingProposalId ? 'Editar Orçamento & Custos' : 'Calculadora Inteligente de Orçamento'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {editingProposalId
                        ? 'Atualize as horas técnicas, taxas, custos, margem ou status da proposta'
                        : 'Cálculo detalhado de horas técnicas, custos de setup, margem de lucro e geração de propostas'}
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

              <form onSubmit={handleSaveProposal} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Cliente *
                    </label>
                    <select
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.tradeName} ({c.segment || 'Geral'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Status da Proposta *
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Proposal['status'])}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-semibold"
                    >
                      <option value="DRAFT">Rascunho (DRAFT)</option>
                      <option value="SENT">Enviada ao Cliente (SENT)</option>
                      <option value="ACCEPTED">Aprovada / Fechada (ACCEPTED)</option>
                      <option value="DECLINED">Recusada (DECLINED)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Validade da Proposta
                    </label>
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Título do Serviço / Projeto *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Dashboard BI + Setup Automação WhatsApp"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                {/* BLOCO DE CÁLCULO DE CUSTO HOMEM-HORA E SETUP COM BOTÃO DE CALCULAR CUSTO DETALHADO */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 dark:border-slate-800 pb-2.5">
                    <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Composição do Custo Técnico & Setup</span>
                    </h4>

                    {/* BOTÃO PARA ABRIR TELA DE CALCULAR CUSTO TÉCNICO */}
                    <button
                      type="button"
                      onClick={() => setShowCostCalculatorModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Calcular Custo Técnico</span>
                      {teamMembers.length > 0 && (
                        <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                          {teamMembers.length}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Horas Estimadas (Total)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={estimatedHours}
                        onChange={(e) => setEstimatedHours(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-800 dark:text-white font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Taxa Média Hora (R$)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-800 dark:text-white font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Custo de Setup (R$)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={setupCost}
                        onChange={(e) => setSetupCost(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-800 dark:text-white font-mono font-bold"
                        title="Configuração inicial, hospedagem, VPS, infraestrutura"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Custos Terceiros / APIs (R$)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={thirdPartyCost}
                        onChange={(e) => setThirdPartyCost(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-800 dark:text-white font-mono font-bold"
                        title="APIs OpenAI, plugins pagos, licenças de software"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">
                        Margem de Lucro Desejada:
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                        +{marginPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      step="5"
                      value={marginPercent}
                      onChange={(e) => setMarginPercent(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Resumo do Cálculo em Tempo Real */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/60 dark:to-cyan-950/40 rounded-2xl border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      Custo Direto Total:
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      R$ {subtotalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-mono">
                      Lucro Líquido: R$ {marginAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-cyan-700 dark:text-cyan-300 font-bold block uppercase tracking-wider">
                      Valor Final da Proposta
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                      R$ {calculatedTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Condição de Pagamento
                  </label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Detalhamento do Escopo
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Descreva as entregas, etapas de validação e o que está incluso no serviço..."
                    value={scopeDetails}
                    onChange={(e) => setScopeDetails(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>

                {/* Botões do Rodapé */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    {editingProposalId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteProposal(editingProposalId)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir Orçamento</span>
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
                      {editingProposalId ? 'Salvar Alterações' : 'Salvar e Gerar Orçamento'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SUB-MODAL 2: TELA PARA INSERIR FREELANCERS, PARCEIROS E ESTRUTURA NECESSÁRIA */}
        {showCostCalculatorModal && (
          <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              {/* Header do Sub-modal */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Users className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Composição Detalhada: Freelancers, Parceiros & Estrutura
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Adicione os profissionais envolvidos com suas horas estimadas e os custos de infraestrutura/APIs
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCostCalculatorModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SEÇÃO 1: MÃO DE OBRA & FREELANCERS ENVOLVIDOS */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-cyan-500" />
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      1. Mão de Obra da Equipe & Freelancers
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTeamMember}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Adicionar Profissional</span>
                  </button>
                </div>

                {teamMembers.length === 0 ? (
                  <div
                    onClick={handleAddTeamMember}
                    className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-cyan-500/50 transition-colors"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Nenhum profissional adicionado à equipe ainda.
                    </p>
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-1 inline-block">
                      + Clique aqui para alocar o primeiro freelancer/parceiro
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {teamMembers.map((member, index) => (
                      <div
                        key={member.id}
                        className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                          {/* Selecionar Parceiro Cadastrado (SOMENTE FREELANCER OU EQUIPE) */}
                          <div className="sm:col-span-4">
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                              Freelancer / Equipe ({index + 1})
                            </label>
                            <select
                              value={member.supplierId}
                              onChange={(e) => handleUpdateTeamMember(member.id, 'supplierId', e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 text-xs text-slate-800 dark:text-white font-medium focus:outline-none focus:border-cyan-500"
                            >
                              <option value="">Selecione freelancer / profissional...</option>
                              {availableSuppliers
                                .filter(isFreelancerOrTeam)
                                .map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.name} ({s.category})
                                  </option>
                                ))}
                            </select>
                          </div>

                          {/* Tipo de Cobrança */}
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                              Modelo
                            </label>
                            <select
                              value={member.billingType}
                              onChange={(e) =>
                                handleUpdateTeamMember(
                                  member.id,
                                  'billingType',
                                  e.target.value as 'HOURLY' | 'FIXED'
                                )
                              }
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                            >
                              <option value="HOURLY">Por Hora</option>
                              <option value="FIXED">Valor Fixo</option>
                            </select>
                          </div>

                          {/* Horas Estimadas */}
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                              Horas (h)
                            </label>
                            <input
                              type="number"
                              min="0"
                              disabled={member.billingType === 'FIXED'}
                              value={member.hours}
                              onChange={(e) =>
                                handleUpdateTeamMember(member.id, 'hours', Number(e.target.value))
                              }
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 text-xs text-slate-800 dark:text-white font-mono disabled:opacity-40 focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          {/* Taxa / Valor */}
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                              {member.billingType === 'HOURLY' ? 'R$ / Hora' : 'Valor Fixo (R$)'}
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={member.rate}
                              onChange={(e) =>
                                handleUpdateTeamMember(member.id, 'rate', Number(e.target.value))
                              }
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 text-xs text-slate-800 dark:text-white font-mono focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          {/* Subtotal e Remover */}
                          <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-4">
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block sm:hidden">Subtotal:</span>
                              <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                                R$ {member.total.toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveTeamMember(member.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Remover profissional"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SEÇÃO 2: ESTRUTURA NECESSÁRIA, HOSPEDAGEM & APIS */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-indigo-500" />
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      2. Estrutura Necessária: Setup, Infraestrutura & APIs de Terceiros
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddStructureItem}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Adicionar Custo de Estrutura</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {structureItems.length === 0 ? (
                    <div
                      onClick={handleAddStructureItem}
                      className="p-5 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-indigo-500/50 transition-colors"
                    >
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Nenhum custo de infraestrutura ou API adicionado.
                      </p>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1 inline-block">
                        + Clique aqui para adicionar servidor, hospedagem ou API
                      </span>
                    </div>
                  ) : (
                    structureItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                          {/* 1. Selecionar Fornecedor Cadastrado (TODOS MENOS FREELANCER E EQUIPE) */}
                          <div className="sm:col-span-4">
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                              Item / Fornecedor Estrutura ({idx + 1})
                            </label>
                            <select
                              value={item.supplierId || ''}
                              onChange={(e) =>
                                handleUpdateStructureItem(item.id, 'supplierId', e.target.value)
                              }
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 text-xs text-slate-800 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                            >
                              <option value="">Personalizado / Outro Custo...</option>
                              {availableSuppliers
                                .filter(isStructureOrApi)
                                .map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.name} ({s.category})
                                  </option>
                                ))}
                            </select>
                          </div>

                          {/* 2. Nome / Descrição */}
                          <div className="sm:col-span-3">
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                              Descrição
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Servidor VPS Oracle, API OpenAI..."
                              value={item.name}
                              onChange={(e) => handleUpdateStructureItem(item.id, 'name', e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>

                          {/* 3. Classificação */}
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                              Tipo
                            </label>
                            <select
                              value={item.category}
                              onChange={(e) =>
                                handleUpdateStructureItem(
                                  item.id,
                                  'category',
                                  e.target.value as 'SETUP' | 'THIRD_PARTY'
                                )
                              }
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            >
                              <option value="SETUP">Setup / Infra</option>
                              <option value="THIRD_PARTY">APIs / Terceiros</option>
                            </select>
                          </div>

                          {/* 4. Valor (R$) */}
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                              Custo (R$)
                            </label>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
                                R$
                              </span>
                              <input
                                type="number"
                                min="0"
                                placeholder="0,00"
                                value={item.cost}
                                onChange={(e) =>
                                  handleUpdateStructureItem(item.id, 'cost', Number(e.target.value))
                                }
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-6 pr-1.5 py-1.5 text-xs text-slate-800 dark:text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                          </div>

                          {/* 5. Remover */}
                          <div className="sm:col-span-1 flex items-center justify-end pt-2 sm:pt-4">
                            <button
                              type="button"
                              onClick={() => handleRemoveStructureItem(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Remover custo de estrutura"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* PAINEL CONSOLIDADO DOS TOTAIS SOMADOS */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 rounded-2xl border border-cyan-200 dark:border-cyan-500/30 space-y-3">
                <span className="text-xs font-bold text-cyan-800 dark:text-cyan-300 block uppercase tracking-wider">
                  Resumo dos Custos da Equipe & Estrutura:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      Total de Horas Somadas
                    </span>
                    <span className="text-base font-black text-cyan-600 dark:text-cyan-400 font-mono block mt-0.5">
                      {totalTeamHours}h
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Média: R$ {averageHourlyRate}/h
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      Custo Total Mão de Obra
                    </span>
                    <span className="text-base font-black text-slate-800 dark:text-white font-mono block mt-0.5">
                      R$ {totalLaborCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {teamMembers.length} profissional(is)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      Setup & Infraestrutura
                    </span>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono block mt-0.5">
                      R$ {totalSetupStructure.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400">Servidores / Setup</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      Terceiros & APIs
                    </span>
                    <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono block mt-0.5">
                      R$ {totalThirdPartyStructure.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400">APIs / Licenças</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-cyan-200/60 dark:border-cyan-500/20 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                  <span>Custo Direto Base Somado:</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    R$ {grandDirectCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Rodapé do Sub-modal */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCostCalculatorModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApplyCostCalculation}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aplicar Valores ao Orçamento</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
