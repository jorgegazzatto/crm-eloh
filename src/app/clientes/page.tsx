'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { initialClients, initialSuppliers } from '@/lib/mockData';
import { Client, Supplier, ClientStatus, SupplierBillingModel } from '@/lib/types';
import {
  Users,
  Plus,
  Phone,
  Mail,
  Building,
  Tag,
  ShieldCheck,
  MapPin,
  Calendar,
  FileText,
  Pencil,
  Trash2,
  Search,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Briefcase,
  Globe,
  Info,
  Clock,
  Layers,
  Sparkles,
  CreditCard,
  Banknote,
  Repeat,
} from 'lucide-react';

const STORAGE_SUPPLIERS_KEY = 'eloh_crm_suppliers';
const STORAGE_CLIENTS_KEY = 'eloh_crm_clients';

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [activeTab, setActiveTab] = useState<'CLIENTES' | 'FORNECEDORES'>('CLIENTES');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [supplierCategoryFilter, setSupplierCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modais
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);

  // Form States para Clientes
  const todayStr = new Date().toISOString().split('T')[0];
  const [createdAtDate, setCreatedAtDate] = useState(todayStr);
  const [tradeName, setTradeName] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [personType, setPersonType] = useState<'PJ' | 'PF'>('PJ');
  const [document, setDocument] = useState('');
  const [stateRegistration, setStateRegistration] = useState('');
  const [municipalRegistration, setMunicipalRegistration] = useState('');
  const [taxRegime, setTaxRegime] = useState('Simples Nacional');
  const [legalRepresentative, setLegalRepresentative] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [segment, setSegment] = useState('');
  const [status, setStatus] = useState<ClientStatus>('ACTIVE_RECURRENT');
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [notes, setNotes] = useState('');

  // Form States para Fornecedores & Parceiros
  const [supName, setSupName] = useState('');
  const [supCategory, setSupCategory] = useState('Freelancer Dev');
  const [supDocument, setSupDocument] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supBillingModel, setSupBillingModel] = useState<SupplierBillingModel>('HOURLY_RATE');
  const [supFixedProjectCost, setSupFixedProjectCost] = useState<number | ''>('');
  const [supMonthlyRetainer, setSupMonthlyRetainer] = useState<number | ''>('');
  const [supHourlyRate, setSupHourlyRate] = useState<number | ''>('');
  const [supPixKey, setSupPixKey] = useState('');
  const [supBankInfo, setSupBankInfo] = useState('');
  const [supSkills, setSupSkills] = useState('');
  const [supNotes, setSupNotes] = useState('');
  const [supCreatedAtDate, setSupCreatedAtDate] = useState(todayStr);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Carregar dados salvos no localStorage na montagem
  useEffect(() => {
    try {
      const storedSuppliers = localStorage.getItem(STORAGE_SUPPLIERS_KEY);
      if (storedSuppliers) {
        const parsed = JSON.parse(storedSuppliers);
        if (Array.isArray(parsed) && parsed.length > 0) setSuppliers(parsed);
      } else {
        localStorage.setItem(STORAGE_SUPPLIERS_KEY, JSON.stringify(initialSuppliers));
      }

      const storedClients = localStorage.getItem(STORAGE_CLIENTS_KEY);
      if (storedClients) {
        const parsed = JSON.parse(storedClients);
        if (Array.isArray(parsed) && parsed.length > 0) setClients(parsed);
      } else {
        localStorage.setItem(STORAGE_CLIENTS_KEY, JSON.stringify(initialClients));
      }
    } catch (e) {
      console.error('Erro ao ler do localStorage:', e);
    }
  }, []);

  // ----------------------------------------------------
  // CLIENTES: FUNÇÕES DE ABERTURA E SALVAMENTO
  // ----------------------------------------------------
  const openCreateClientModal = () => {
    setEditingClientId(null);
    setCreatedAtDate(todayStr);
    setTradeName('');
    setCorporateName('');
    setPersonType('PJ');
    setDocument('');
    setStateRegistration('');
    setMunicipalRegistration('');
    setTaxRegime('Simples Nacional');
    setLegalRepresentative('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setSegment('');
    setStatus('ACTIVE_RECURRENT');
    setZipCode('');
    setAddress('');
    setAddressNumber('');
    setAddressComplement('');
    setNeighborhood('');
    setCity('');
    setState('SP');
    setNotes('');
    setShowClientModal(true);
  };

  const openEditClientModal = (client: Client) => {
    setEditingClientId(client.id);
    setCreatedAtDate(client.createdAt ? client.createdAt.split('T')[0] : todayStr);
    setTradeName(client.tradeName || '');
    setCorporateName(client.corporateName || '');
    setPersonType(client.personType || 'PJ');
    setDocument(client.document || '');
    setStateRegistration(client.stateRegistration || '');
    setMunicipalRegistration(client.municipalRegistration || '');
    setTaxRegime(client.taxRegime || 'Simples Nacional');
    setLegalRepresentative(client.legalRepresentative || '');
    setContactPerson(client.contactPerson || '');
    setEmail(client.email || '');
    setPhone(client.phone || '');
    setSegment(client.segment || '');
    setStatus(client.status || 'ACTIVE_RECURRENT');
    setZipCode(client.zipCode || '');
    setAddress(client.address || '');
    setAddressNumber(client.addressNumber || '');
    setAddressComplement(client.addressComplement || '');
    setNeighborhood(client.neighborhood || '');
    setCity(client.city || '');
    setState(client.state || 'SP');
    setNotes(client.notes || '');
    setShowClientModal(true);
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Tem certeza de que deseja excluir este cliente do sistema?')) {
      const updated = clients.filter((c) => c.id !== clientId);
      setClients(updated);
      try {
        localStorage.setItem(STORAGE_CLIENTS_KEY, JSON.stringify(updated));
      } catch {}
      setShowClientModal(false);
      showToast('Cliente excluído com sucesso.');
    }
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tradeName.trim()) {
      alert('Por favor informe o Nome Fantasia / Empresa.');
      return;
    }

    const clientPayload: Client = {
      id: editingClientId || `cli-${Date.now()}`,
      tradeName: tradeName.trim(),
      corporateName: corporateName.trim() || tradeName.trim(),
      personType,
      document: document.trim(),
      stateRegistration: stateRegistration.trim(),
      municipalRegistration: municipalRegistration.trim(),
      taxRegime,
      legalRepresentative: legalRepresentative.trim(),
      contactPerson: contactPerson.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      segment: segment.trim(),
      status,
      zipCode: zipCode.trim(),
      address: address.trim(),
      addressNumber: addressNumber.trim(),
      addressComplement: addressComplement.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      state: state.trim().toUpperCase(),
      notes: notes.trim(),
      createdAt: createdAtDate ? `${createdAtDate}T12:00:00Z` : new Date().toISOString(),
    };

    let updatedList: Client[];
    if (editingClientId) {
      updatedList = clients.map((c) => (c.id === editingClientId ? clientPayload : c));
      showToast('Dados do cliente atualizados com sucesso!');
    } else {
      updatedList = [clientPayload, ...clients];
      showToast('Novo cliente cadastrado com sucesso!');
    }

    setClients(updatedList);
    try {
      localStorage.setItem(STORAGE_CLIENTS_KEY, JSON.stringify(updatedList));
    } catch {}
    setShowClientModal(false);
  };

  // ----------------------------------------------------
  // FORNECEDORES & PARCEIROS: FUNÇÕES
  // ----------------------------------------------------
  const openCreateSupplierModal = () => {
    setEditingSupplierId(null);
    setSupName('');
    setSupCategory('Freelancer Dev');
    setSupDocument('');
    setSupEmail('');
    setSupPhone('');
    setSupBillingModel('HOURLY_RATE');
    setSupFixedProjectCost('');
    setSupMonthlyRetainer('');
    setSupHourlyRate('');
    setSupPixKey('');
    setSupBankInfo('');
    setSupSkills('');
    setSupNotes('');
    setSupCreatedAtDate(todayStr);
    setShowSupplierModal(true);
  };

  const openEditSupplierModal = (supp: Supplier) => {
    setEditingSupplierId(supp.id);
    setSupName(supp.name);
    setSupCategory(supp.category);
    setSupDocument(supp.document || '');
    setSupEmail(supp.email || '');
    setSupPhone(supp.phone || '');
    setSupBillingModel(supp.billingModel || 'HOURLY_RATE');
    setSupFixedProjectCost(supp.fixedProjectCost !== undefined && supp.fixedProjectCost !== null ? supp.fixedProjectCost : '');
    setSupMonthlyRetainer(supp.monthlyRetainer !== undefined && supp.monthlyRetainer !== null ? supp.monthlyRetainer : '');
    setSupHourlyRate(supp.hourlyRate !== undefined && supp.hourlyRate !== null ? supp.hourlyRate : '');
    setSupPixKey(supp.pixKey || '');
    setSupBankInfo(supp.bankInfo || '');
    setSupSkills(supp.skills || '');
    setSupNotes(supp.notes || '');
    setSupCreatedAtDate(supp.createdAt ? supp.createdAt.split('T')[0] : todayStr);
    setShowSupplierModal(true);
  };

  const handleDeleteSupplier = (suppId: string) => {
    if (confirm('Tem certeza de que deseja excluir este fornecedor/parceiro?')) {
      const updated = suppliers.filter((s) => s.id !== suppId);
      setSuppliers(updated);
      try {
        localStorage.setItem(STORAGE_SUPPLIERS_KEY, JSON.stringify(updated));
      } catch {}
      setShowSupplierModal(false);
      showToast('Fornecedor/Parceiro excluído com sucesso.');
    }
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();

    if (!supName.trim()) {
      alert('Informe o nome do fornecedor ou parceiro.');
      return;
    }

    const payload: Supplier = {
      id: editingSupplierId || `sup-${Date.now()}`,
      name: supName.trim(),
      category: supCategory,
      document: supDocument.trim(),
      email: supEmail.trim().toLowerCase(),
      phone: supPhone.trim(),
      billingModel: supBillingModel,
      fixedProjectCost: supFixedProjectCost === '' ? undefined : Number(supFixedProjectCost),
      monthlyRetainer: supMonthlyRetainer === '' ? undefined : Number(supMonthlyRetainer),
      hourlyRate: supHourlyRate === '' ? undefined : Number(supHourlyRate),
      pixKey: supPixKey.trim(),
      bankInfo: supBankInfo.trim(),
      skills: supSkills.trim(),
      notes: supNotes.trim(),
      createdAt: supCreatedAtDate ? `${supCreatedAtDate}T12:00:00Z` : new Date().toISOString(),
    };

    let updatedList: Supplier[];
    if (editingSupplierId) {
      updatedList = suppliers.map((s) => (s.id === editingSupplierId ? payload : s));
      showToast('Fornecedor / Parceiro atualizado com sucesso!');
    } else {
      updatedList = [payload, ...suppliers];
      showToast('Novo Fornecedor / Parceiro cadastrado com sucesso!');
    }

    setSuppliers(updatedList);
    try {
      localStorage.setItem(STORAGE_SUPPLIERS_KEY, JSON.stringify(updatedList));
    } catch {}
    setShowSupplierModal(false);
  };

  // Filtragem de Clientes
  const filteredClients = clients.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.tradeName.toLowerCase().includes(q) ||
      c.corporateName.toLowerCase().includes(q) ||
      (c.document && c.document.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q)) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  // Filtragem de Fornecedores
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesCategory =
      supplierCategoryFilter === 'ALL' || s.category === supplierCategoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      (s.skills && s.skills.toLowerCase().includes(q)) ||
      (s.document && s.document.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Lista de Categorias Únicas de Fornecedores
  const supplierCategories = Array.from(new Set(suppliers.map((s) => s.category)));

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors">
      <Header
        title="Gestão de Clientes & Fornecedores"
        subtitle="Base central de clientes, prestadores de serviços, parceiros com valores de projeto, mensalidade e hora técnica"
      >
        {activeTab === 'CLIENTES' ? (
          <button
            onClick={openCreateClientModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md shadow-cyan-500/10 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Cliente</span>
          </button>
        ) : (
          <button
            onClick={openCreateSupplierModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md shadow-cyan-500/10 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Fornecedor / Parceiro</span>
          </button>
        )}
      </Header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Abas e Filtros */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('CLIENTES');
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'CLIENTES'
                  ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Clientes ({clients.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('FORNECEDORES');
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'FORNECEDORES'
                  ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Fornecedores & Parceiros ({suppliers.length})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeTab === 'CLIENTES'
                    ? 'Buscar por nome, CNPJ, cidade...'
                    : 'Buscar parceiro por nome, habilidade...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {activeTab === 'CLIENTES' ? (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Todos os status</option>
                <option value="ACTIVE_RECURRENT">Ativo (Recorrente)</option>
                <option value="ACTIVE_PROJECT">Ativo (Projeto Pontual)</option>
                <option value="ONBOARDING">Em Onboarding</option>
                <option value="LEAD">Lead / Prospecção</option>
                <option value="INACTIVE">Inativo</option>
              </select>
            ) : (
              <select
                value={supplierCategoryFilter}
                onChange={(e) => setSupplierCategoryFilter(e.target.value)}
                className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Todas as categorias</option>
                {supplierCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* TAB 1: CLIENTES */}
        {activeTab === 'CLIENTES' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClients.map((client) => {
              const statusBadge =
                client.status === 'ACTIVE_RECURRENT'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/40'
                  : client.status === 'ONBOARDING'
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800/40'
                  : client.status === 'ACTIVE_PROJECT'
                  ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800/40'
                  : client.status === 'INACTIVE'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                  : 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800/40';

              const statusLabel =
                client.status === 'ACTIVE_RECURRENT'
                  ? 'Recorrente'
                  : client.status === 'ACTIVE_PROJECT'
                  ? 'Projeto'
                  : client.status === 'ONBOARDING'
                  ? 'Onboarding'
                  : client.status === 'LEAD'
                  ? 'Lead'
                  : 'Inativo';

              return (
                <div
                  key={client.id}
                  className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-xs space-y-4"
                >
                  <div className="space-y-3">
                    {/* Cabeçalho do Card */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusBadge}`}>
                            {statusLabel}
                          </span>
                          {client.taxRegime && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                              {client.taxRegime}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mt-1.5 truncate">
                          {client.tradeName}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {client.corporateName}
                        </p>
                      </div>

                      {/* Botão Editar */}
                      <button
                        type="button"
                        onClick={() => openEditClientModal(client)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-cyan-50 dark:bg-slate-800/80 dark:hover:bg-cyan-950/60 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700/60 text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-xs flex-shrink-0"
                        title="Editar Informações do Cliente"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                    </div>

                    {/* Informações Fiscais & Jurídicas */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Documento:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {client.document || 'Não informado'}
                        </span>
                      </div>

                      {(client.stateRegistration || client.municipalRegistration) && (
                        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          <span>IE: {client.stateRegistration || 'Isento'}</span>
                          <span>IM: {client.municipalRegistration || '—'}</span>
                        </div>
                      )}

                      {(client.city || client.state) && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 pt-0.5">
                          <MapPin className="w-3 h-3 text-cyan-500 flex-shrink-0" />
                          <span className="truncate">
                            {client.city ? `${client.city}, ` : ''}{client.state || ''}
                            {client.address ? ` • ${client.address}` : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Contatos */}
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {client.contactPerson && (
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{client.contactPerson}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate font-mono text-[11px]">{client.email}</span>
                        </div>
                      )}
                      {client.segment && (
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                          <span className="text-cyan-700 dark:text-cyan-300 font-semibold text-[11px]">
                            {client.segment}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Campo de Observações do Cliente */}
                    {client.notes && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                          Observações:
                        </span>
                        {client.notes}
                      </div>
                    )}
                  </div>

                  {/* Rodapé com Data de Cadastro */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Cadastrado em:{' '}
                        <strong className="text-slate-700 dark:text-slate-300 font-medium">
                          {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                        </strong>
                      </span>
                    </span>
                    {client.legalRepresentative && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]" title={`Resp: ${client.legalRepresentative}`}>
                        Resp: {client.legalRepresentative}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TAB 2: FORNECEDORES & PARCEIROS (COM VALOR FIXO, MENSALIDADE E HORA TÉCNICA) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-xs space-y-4"
              >
                <div className="space-y-3.5">
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wider inline-block">
                        {supplier.category}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mt-1 truncate">
                        {supplier.name}
                      </h3>
                      {supplier.document && (
                        <p className="text-[11px] font-mono text-slate-400">
                          {supplier.document}
                        </p>
                      )}
                    </div>

                    {/* Botão Editar Fornecedor */}
                    <button
                      type="button"
                      onClick={() => openEditSupplierModal(supplier)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-cyan-50 dark:bg-slate-800/80 dark:hover:bg-cyan-950/60 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700/60 text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-xs flex-shrink-0"
                      title="Editar Valores e Dados do Parceiro"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                  </div>

                  {/* BLOCO DE VALORES: VALOR FIXO (PROJETO), MENSALIDADE RECORRENTE E HORA TÉCNICA */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200/60 dark:border-slate-800/60 pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        Tabela de Remuneração:
                      </span>
                      {supplier.billingModel && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-mono">
                          {supplier.billingModel === 'HOURLY_RATE'
                            ? 'Hora Técnica'
                            : supplier.billingModel === 'FIXED_PROJECT'
                            ? 'Fixo por Projeto'
                            : supplier.billingModel === 'MONTHLY_RETAINER'
                            ? 'Mensalidade'
                            : 'Misto / Flexível'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {/* 1. Valor Fixo (Projeto) */}
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[9px] text-slate-400 block uppercase font-medium">
                          Fixo (Projeto)
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 block mt-0.5 truncate">
                          {supplier.fixedProjectCost !== undefined && supplier.fixedProjectCost > 0
                            ? `R$ ${supplier.fixedProjectCost.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`
                            : '—'}
                        </span>
                      </div>

                      {/* 2. Mensalidade Recorrente */}
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[9px] text-slate-400 block uppercase font-medium">
                          Mensalidade
                        </span>
                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 block mt-0.5 truncate">
                          {supplier.monthlyRetainer !== undefined && supplier.monthlyRetainer > 0
                            ? `R$ ${supplier.monthlyRetainer.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}/mês`
                            : '—'}
                        </span>
                      </div>

                      {/* 3. Hora Técnica */}
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[9px] text-slate-400 block uppercase font-medium">
                          Hora Técnica
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5 truncate">
                          {supplier.hourlyRate !== undefined && supplier.hourlyRate > 0
                            ? `R$ ${supplier.hourlyRate.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}/h`
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Informações de Contato & PIX */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {supplier.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate font-mono text-[11px]">{supplier.email}</span>
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{supplier.phone}</span>
                      </div>
                    )}
                    {supplier.pixKey && (
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        <CreditCard className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                        <span className="truncate">PIX: {supplier.pixKey}</span>
                      </div>
                    )}
                  </div>

                  {/* Habilidades Técnicas / Tags */}
                  {supplier.skills && (
                    <div className="flex flex-wrap items-center gap-1 pt-0.5">
                      {supplier.skills.split(',').map((sk, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                        >
                          {sk.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Observações / Notas do Fornecedor */}
                  {supplier.notes && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {supplier.notes}
                    </div>
                  )}
                </div>

                {/* Rodapé do Card do Fornecedor */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Cadastrado em:{' '}
                      <strong className="text-slate-700 dark:text-slate-300 font-medium">
                        {supplier.createdAt
                          ? new Date(supplier.createdAt).toLocaleDateString('pt-BR')
                          : 'Parceiro Homologado'}
                      </strong>
                    </span>
                  </span>
                  {supplier.bankInfo && (
                    <span className="text-[10px] text-slate-400 truncate max-w-[130px]" title={supplier.bankInfo}>
                      {supplier.bankInfo}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL 1: CADASTRAR OU EDITAR CLIENTE */}
        {showClientModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl p-6 md:p-7 space-y-5 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Building className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {editingClientId ? 'Editar Dados do Cliente' : 'Cadastrar Novo Cliente'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Preencha as informações jurídicas, fiscais, contatos e observações gerais
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg px-2"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveClient} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                {/* 1. SEÇÃO BÁSICA & DATA DO CADASTRO */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-cyan-500" />
                      <span>Data do Cadastro & Identificação</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Data de Cadastro:
                      </label>
                      <input
                        type="date"
                        value={createdAtDate}
                        onChange={(e) => setCreatedAtDate(e.target.value)}
                        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Tipo de Pessoa
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPersonType('PJ')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                            personType === 'PJ'
                              ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                              : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          Jurídica (PJ)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPersonType('PF')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                            personType === 'PF'
                              ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                              : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          Física (PF)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Status do Cliente
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ClientStatus)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-medium"
                      >
                        <option value="ACTIVE_RECURRENT">Ativo (Recorrente)</option>
                        <option value="ACTIVE_PROJECT">Ativo (Projeto Pontual)</option>
                        <option value="ONBOARDING">Em Onboarding</option>
                        <option value="LEAD">Lead / Prospecção</option>
                        <option value="INACTIVE">Inativo</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Segmento de Mercado
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Saúde, Varejo, Tech"
                        value={segment}
                        onChange={(e) => setSegment(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Nome Fantasia / Nome Comercial *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Aliança Distribuidora"
                        value={tradeName}
                        onChange={(e) => setTradeName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Razão Social (Nome Empresarial Completo) *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Distribuidora Aliança Ltda"
                        value={corporateName}
                        onChange={(e) => setCorporateName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. SEÇÃO DE INFORMAÇÕES JURÍDICAS & FISCAIS */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-cyan-500" />
                    <span>Informações Jurídicas & Fiscais</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        {personType === 'PJ' ? 'CNPJ *' : 'CPF *'}
                      </label>
                      <input
                        type="text"
                        placeholder={personType === 'PJ' ? '00.000.000/0001-00' : '000.000.000-00'}
                        value={document}
                        onChange={(e) => setDocument(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Inscrição Estadual (IE)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 123.456.789.000 ou Isento"
                        value={stateRegistration}
                        onChange={(e) => setStateRegistration(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Inscrição Municipal (IM)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 98765432"
                        value={municipalRegistration}
                        onChange={(e) => setMunicipalRegistration(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Regime Tributário
                      </label>
                      <select
                        value={taxRegime}
                        onChange={(e) => setTaxRegime(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Simples Nacional">Simples Nacional</option>
                        <option value="Lucro Presumido">Lucro Presumido</option>
                        <option value="Lucro Real">Lucro Real</option>
                        <option value="MEI (Microempreendedor)">MEI (Microempreendedor)</option>
                        <option value="Isento / Imune">Isento / Imune</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Responsável Legal / Jurídico
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Carlos Eduardo (Sócio-Administrador)"
                        value={legalRepresentative}
                        onChange={(e) => setLegalRepresentative(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. ENDEREÇO FISCAL COMPLETO */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    <span>Endereço Fiscal & Localização</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        CEP
                      </label>
                      <input
                        type="text"
                        placeholder="00000-000"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Logradouro (Rua / Avenida)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Av. Paulista"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Número
                      </label>
                      <input
                        type="text"
                        placeholder="1000"
                        value={addressNumber}
                        onChange={(e) => setAddressNumber(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Complemento / Sala
                      </label>
                      <input
                        type="text"
                        placeholder="Sala 1204 - Bloco B"
                        value={addressComplement}
                        onChange={(e) => setAddressComplement(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Cidade
                      </label>
                      <input
                        type="text"
                        placeholder="São Paulo"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Estado (UF)
                      </label>
                      <input
                        type="text"
                        placeholder="SP"
                        maxLength={2}
                        value={state}
                        onChange={(e) => setState(e.target.value.toUpperCase())}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. CONTATOS OPERACIONAIS */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Users className="w-4 h-4 text-cyan-500" />
                    <span>Contatos & Comunicação</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Pessoa de Contato Principal
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Carlos Eduardo"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="text"
                        placeholder="(11) 98765-4321"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        E-mail de Contato / Faturamento
                      </label>
                      <input
                        type="email"
                        placeholder="financeiro@empresa.com.br"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. CAMPO PARA OBSERVAÇÕES GERAIS */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Observações Gerais & Condições Comerciais/Fiscais</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Particularidades contratuais, dados bancários do cliente, horários de atendimento, cláusulas acordadas, observações de faturamento..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Essas anotações ficam disponíveis no perfil do cliente para consulta rápida de toda a equipe.
                  </p>
                </div>

                {/* BOTÕES DO MODAL */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    {editingClientId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteClient(editingClientId)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir Cliente</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowClientModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      {editingClientId ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: CADASTRAR OU EDITAR FORNECEDOR / PARCEIRO */}
        {showSupplierModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl p-6 md:p-7 space-y-5 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Briefcase className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {editingSupplierId ? 'Editar Fornecedor / Parceiro' : 'Cadastrar Novo Fornecedor / Parceiro'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Defina modelo de remuneração (valor fixo de projeto, mensalidade recorrente e hora técnica)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg px-2"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveSupplier} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                {/* 1. IDENTIFICAÇÃO BÁSICA & DATA DO CADASTRO */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span>Identificação do Parceiro / Fornecedor</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Data de Cadastro:
                      </label>
                      <input
                        type="date"
                        value={supCreatedAtDate}
                        onChange={(e) => setSupCreatedAtDate(e.target.value)}
                        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Nome do Parceiro / Fornecedor / Razão Social *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Felipe Ramos (Dev Frontend / React)"
                        value={supName}
                        onChange={(e) => setSupName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Categoria / Especialidade *
                      </label>
                      <select
                        value={supCategory}
                        onChange={(e) => setSupCategory(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-medium"
                      >
                        <option value="Freelancer Dev">Freelancer Dev</option>
                        <option value="Tráfego Pago / Ads">Tráfego Pago / Ads</option>
                        <option value="Designer UI/UX">Designer UI/UX</option>
                        <option value="Infraestrutura Cloud">Infraestrutura Cloud</option>
                        <option value="Ferramenta / IA">Ferramenta / SaaS IA</option>
                        <option value="Copywriter / Conteúdo">Copywriter / Conteúdo</option>
                        <option value="Consultoria Externa">Consultoria Externa</option>
                        <option value="Contabilidade & Jurídico">Contabilidade & Jurídico</option>
                        <option value="Outro">Outro Prestador</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        CNPJ ou CPF
                      </label>
                      <input
                        type="text"
                        placeholder="00.000.000/0001-00"
                        value={supDocument}
                        onChange={(e) => setSupDocument(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        E-mail de Contato
                      </label>
                      <input
                        type="email"
                        placeholder="contato@parceiro.com"
                        value={supEmail}
                        onChange={(e) => setSupEmail(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="text"
                        placeholder="(11) 98765-4321"
                        value={supPhone}
                        onChange={(e) => setSupPhone(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. TABELA DE PREÇOS & REMUNERAÇÃO: VALOR FIXO, MENSALIDADE E HORA TÉCNICA */}
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Modelos de Remuneração & Valores Acordados</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Preencha os valores aplicáveis ao fornecedor
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Valor Fixo por Projeto */}
                    <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                        <span>Valor Fixo (Projeto)</span>
                      </label>
                      <p className="text-[10px] text-slate-400">Escopo fechado / entrega</p>
                      <div className="relative mt-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                          R$
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          value={supFixedProjectCost}
                          onChange={(e) =>
                            setSupFixedProjectCost(e.target.value === '' ? '' : Number(e.target.value))
                          }
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-800 dark:text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Mensalidade Recorrente */}
                    <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Repeat className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Mensalidade Recorrente</span>
                      </label>
                      <p className="text-[10px] text-slate-400">Fee mensal / Retainer / SaaS</p>
                      <div className="relative mt-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                          R$
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          value={supMonthlyRetainer}
                          onChange={(e) =>
                            setSupMonthlyRetainer(e.target.value === '' ? '' : Number(e.target.value))
                          }
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-indigo-700 dark:text-indigo-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Hora Técnica */}
                    <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Hora Técnica</span>
                      </label>
                      <p className="text-[10px] text-slate-400">Cobrança por hora de trab.</p>
                      <div className="relative mt-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                          R$
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          value={supHourlyRate}
                          onChange={(e) =>
                            setSupHourlyRate(e.target.value === '' ? '' : Number(e.target.value))
                          }
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Modelo Principal de Contratação
                    </label>
                    <select
                      value={supBillingModel}
                      onChange={(e) => setSupBillingModel(e.target.value as SupplierBillingModel)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-medium"
                    >
                      <option value="HOURLY_RATE">Hora Técnica (Cobrança por horas trabalhadas)</option>
                      <option value="FIXED_PROJECT">Valor Fixo por Projeto (Escopo fechado)</option>
                      <option value="MONTHLY_RETAINER">Mensalidade Recorrente (Retainer / Dedicado / Ferramenta)</option>
                      <option value="FLEXIBLE">Misto / Flexível (Conforme demanda do projeto)</option>
                    </select>
                  </div>
                </div>

                {/* 3. DADOS BANCÁRIOS & CHAVE PIX */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <CreditCard className="w-4 h-4 text-cyan-500" />
                    <span>Dados Financeiros para Repasses / Pagamentos</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Chave PIX
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: felipe.dev@gmail.com ou CNPJ/CPF/Celular"
                        value={supPixKey}
                        onChange={(e) => setSupPixKey(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Instituição Bancária & Conta
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Nubank (260) - Ag 0001 - Conta 1234567-8"
                        value={supBankInfo}
                        onChange={(e) => setSupBankInfo(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. HABILIDADES & OBSERVAÇÕES */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Habilidades Técnicas & Tecnologias (separadas por vírgula)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: React, Next.js, Figma, Google Ads, Docker, n8n, Python"
                      value={supSkills}
                      onChange={(e) => setSupSkills(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Observações Gerais & Condições de Contratação</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Disponibilidade de carga horária, regras de alinhamento, escopos de atuação ou acordos específicos..."
                      value={supNotes}
                      onChange={(e) => setSupNotes(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                    />
                  </div>
                </div>

                {/* BOTÕES DO MODAL FORNECEDOR */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    {editingSupplierId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSupplier(editingSupplierId)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir Fornecedor</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSupplierModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      {editingSupplierId ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
