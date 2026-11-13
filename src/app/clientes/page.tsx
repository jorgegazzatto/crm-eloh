'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { initialClients, initialSuppliers } from '@/lib/mockData';
import { Client, Supplier, ClientStatus } from '@/lib/types';
import { Users, Plus, Phone, Mail, Building, Tag, ShieldCheck, MapPin } from 'lucide-react';

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [activeTab, setActiveTab] = useState<'CLIENTES' | 'FORNECEDORES'>('CLIENTES');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);

  // New Client Form
  const [tradeName, setTradeName] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [document, setDocument] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [segment, setSegment] = useState('');
  const [status, setStatus] = useState<ClientStatus>('ACTIVE_RECURRENT');

  const filteredClients = clients.filter((c) => {
    if (statusFilter === 'ALL') return true;
    return c.status === statusFilter;
  });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: `cli-${Date.now()}`,
      corporateName: corporateName || tradeName,
      tradeName,
      document,
      contactPerson,
      email,
      phone,
      segment,
      status,
      createdAt: new Date().toISOString(),
    };
    setClients([newClient, ...clients]);
    setShowModal(false);
    setTradeName('');
    setCorporateName('');
    setDocument('');
    setEmail('');
    setPhone('');
  };

  return (
    <>
      <Header
        title="Gestão de Clientes & Fornecedores"
        subtitle="Base central de contatos da Elohdigital, parceiros e prestadores de serviço"
      >
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo {activeTab === 'CLIENTES' ? 'Cliente' : 'Fornecedor'}</span>
        </button>
      </Header>

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Abas e Filtros */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('CLIENTES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'CLIENTES'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Clientes ({clients.length})
            </button>
            <button
              onClick={() => setActiveTab('FORNECEDORES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'FORNECEDORES'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fornecedores & Parceiros ({suppliers.length})
            </button>
          </div>

          {activeTab === 'CLIENTES' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Filtrar:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none"
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
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug">{client.tradeName}</h3>
                      <p className="text-[11px] text-slate-400">{client.corporateName}</p>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        client.status === 'ACTIVE_RECURRENT'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : client.status === 'ONBOARDING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-300">
                    {client.contactPerson && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>{client.contactPerson}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.segment && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="text-cyan-300 font-medium">{client.segment}</span>
                      </div>
                    )}
                  </div>

                  {client.notes && (
                    <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400">
                      {client.notes}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Cadastrado em {new Date(client.createdAt).toLocaleDateString('pt-BR')}</span>
                  {client.document && <span className="font-mono text-[10px]">{client.document}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Tab Fornecedores */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-white text-sm">{supplier.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                    {supplier.category}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  {supplier.hourlyRate && (
                    <p className="text-emerald-400 font-mono font-semibold">
                      Taxa Horária: R$ {supplier.hourlyRate.toFixed(2)}/hora
                    </p>
                  )}
                  {supplier.pixKey && (
                    <p className="text-slate-400 text-[11px]">Chave PIX: {supplier.pixKey}</p>
                  )}
                  {supplier.notes && (
                    <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      {supplier.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Novo Cliente */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white">Cadastrar Novo Cliente</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 text-sm">✕</button>
              </div>

              <form onSubmit={handleAddClient} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Nome Fantasia / Empresa</label>
                  <input
                    type="text"
                    value={tradeName}
                    onChange={(e) => setTradeName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">CNPJ / CPF</label>
                    <input
                      type="text"
                      value={document}
                      onChange={(e) => setDocument(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Segmento</label>
                    <input
                      type="text"
                      placeholder="Ex: E-commerce, Saúde, Imóveis"
                      value={segment}
                      onChange={(e) => setSegment(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Contato Principal</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Status do Cliente</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ClientStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="ACTIVE_RECURRENT">Ativo (Contrato Recorrente)</option>
                    <option value="ACTIVE_PROJECT">Ativo (Projeto Pontual)</option>
                    <option value="ONBOARDING">Em Onboarding</option>
                    <option value="LEAD">Lead / Prospecção</option>
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
                    Salvar Cliente
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
