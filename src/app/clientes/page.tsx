'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { initialClients, initialSuppliers } from '@/lib/mockData';
import { Client, Supplier, ClientStatus } from '@/lib/types';
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
} from 'lucide-react';

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [activeTab, setActiveTab] = useState<'CLIENTES' | 'FORNECEDORES'>('CLIENTES');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

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
  
  // Endereço
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  
  // Observações
  const [notes, setNotes] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Abrir Modal de Criação (limpo)
  const openCreateModal = () => {
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
    setShowModal(true);
  };

  // Abrir Modal de Edição (carrega dados existentes)
  const openEditModal = (client: Client) => {
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
    setShowModal(true);
  };

  // Excluir Cliente
  const handleDeleteClient = (clientId: string) => {
    if (confirm('Tem certeza de que deseja excluir este cliente do sistema?')) {
      setClients(clients.filter((c) => c.id !== clientId));
      setShowModal(false);
      showToast('Cliente excluído com sucesso.');
    }
  };

  // Salvar Cliente (Criar ou Atualizar)
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

    if (editingClientId) {
      setClients(clients.map((c) => (c.id === editingClientId ? clientPayload : c)));
      showToast('Dados do cliente atualizados com sucesso!');
    } else {
      setClients([clientPayload, ...clients]);
      showToast('Novo cliente cadastrado com sucesso!');
    }

    setShowModal(false);
  };

  // Filtragem
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

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors">
      <Header
        title="Gestão de Clientes & Fornecedores"
        subtitle="Base central de clientes, informações jurídicas e fiscais, contratos e parceiros Elohdigital"
      >
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md shadow-cyan-500/10 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Cliente</span>
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
        {/* Abas e Filtros */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('CLIENTES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'CLIENTES'
                  ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Clientes ({clients.length})
            </button>
            <button
              onClick={() => setActiveTab('FORNECEDORES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'FORNECEDORES'
                  ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Fornecedores & Parceiros ({suppliers.length})
            </button>
          </div>

          {activeTab === 'CLIENTES' && (
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nome, CNPJ, cidade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

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
            </div>
          )}
        </div>

        {/* Tab Clientes */}
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
                        onClick={() => openEditModal(client)}
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
          /* Tab Fornecedores */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{supplier.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 font-bold">
                    {supplier.category}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {supplier.hourlyRate && (
                    <p className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                      Taxa Horária: R$ {supplier.hourlyRate.toFixed(2)}/hora
                    </p>
                  )}
                  {supplier.pixKey && (
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                      Chave PIX: {supplier.pixKey}
                    </p>
                  )}
                  {supplier.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      {supplier.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL: CADASTRAR OU EDITAR CLIENTE */}
        {showModal && (
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
                  onClick={() => setShowModal(false)}
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
                      onClick={() => setShowModal(false)}
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
      </div>
    </div>
  );
}
