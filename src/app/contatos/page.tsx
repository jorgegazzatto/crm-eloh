'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { initialContacts, initialClients, initialSuppliers } from '@/lib/mockData';
import { ContactHistory, ContactChannel } from '@/lib/types';
import { History, Plus, Phone, Mail, MessageSquare, Users, Calendar, Clock, Video } from 'lucide-react';

export default function ContatosPage() {
  const [contacts, setContacts] = useState<ContactHistory[]>(initialContacts);
  const [showModal, setShowModal] = useState(false);

  // New Contact Form
  const [targetType, setTargetType] = useState<'CLIENT' | 'SUPPLIER'>('CLIENT');
  const [targetId, setTargetId] = useState(initialClients[0].id);
  const [channel, setChannel] = useState<ContactChannel>('WHATSAPP');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [summary, setSummary] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    const client = targetType === 'CLIENT' ? initialClients.find((c) => c.id === targetId) : undefined;
    const supplier = targetType === 'SUPPLIER' ? initialSuppliers.find((s) => s.id === targetId) : undefined;

    const newContact: ContactHistory = {
      id: `cnt-${Date.now()}`,
      date: new Date(date).toISOString(),
      channel,
      summary,
      nextFollowUp: nextFollowUp ? new Date(nextFollowUp).toISOString() : undefined,
      author: 'Elohdigital',
      clientId: client?.id,
      clientName: client?.tradeName,
      supplierId: supplier?.id,
      supplierName: supplier?.name,
    };

    setContacts([newContact, ...contacts]);
    setShowModal(false);
    setSummary('');
  };

  const getChannelIcon = (c: ContactChannel) => {
    switch (c) {
      case 'WHATSAPP': return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'EMAIL': return <Mail className="w-4 h-4 text-blue-400" />;
      case 'CALL': return <Phone className="w-4 h-4 text-amber-400" />;
      case 'MEETING': return <Video className="w-4 h-4 text-purple-400" />;
      default: return <Users className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <>
      <Header
        title="Histórico de Contatos & Interações"
        subtitle="Registro com data e hora exata de reuniões, conversas no WhatsApp, alinhamentos e follow-ups"
      >
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Registrar Contato</span>
        </button>
      </Header>

      <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
        {/* Timeline */}
        <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-800">
          {contacts.map((contact) => (
            <div key={contact.id} className="relative flex items-start gap-4 pl-2">
              {/* Marker Icon */}
              <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shrink-0 z-10">
                {getChannelIcon(contact.channel)}
              </div>

              {/* Card */}
              <div className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">
                      {contact.clientName || contact.supplierName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {contact.channel}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {new Date(contact.date).toLocaleString('pt-BR', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  {contact.summary}
                </p>

                {contact.nextFollowUp && (
                  <div className="flex items-center justify-between text-xs pt-1 text-amber-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Próximo retorno agendado: {new Date(contact.nextFollowUp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                    <span className="text-[10px] text-slate-500">Registrado por: {contact.author}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Registrar Contato */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white">Registrar Interação / Contato</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 text-sm">✕</button>
              </div>

              <form onSubmit={handleCreateContact} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Tipo de Contato</label>
                    <select
                      value={targetType}
                      onChange={(e) => setTargetType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="CLIENT">Cliente</option>
                      <option value="SUPPLIER">Fornecedor / Parceiro</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Destinatário</label>
                    <select
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    >
                      {targetType === 'CLIENT'
                        ? initialClients.map((c) => <option key={c.id} value={c.id}>{c.tradeName}</option>)
                        : initialSuppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)
                      }
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Canal de Comunicação</label>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="CALL">Ligação Telefônica</option>
                      <option value="MEETING">Reunião Online (Google Meet)</option>
                      <option value="EMAIL">E-mail</option>
                      <option value="IN_PERSON">Presencial</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Data e Hora Exata</label>
                    <input
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Resumo do Alinhamento</label>
                  <textarea
                    rows={3}
                    placeholder="Pontos discutidos, decisões tomadas, feedback do cliente..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Próximo Follow-up (Data e Hora)</label>
                  <input
                    type="datetime-local"
                    value={nextFollowUp}
                    onChange={(e) => setNextFollowUp(e.target.value)}
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
                    Salvar Registro
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
