'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { User, UserRole, UserStatus, ROLE_DEFINITIONS } from '@/lib/types';
import {
  Users,
  ShieldCheck,
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  KeyRound,
  Mail,
  UserCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  Lock,
  Phone,
  Briefcase,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export default function UsuariosPage() {
  const { user: currentUser, users, addUser, updateUser, deleteUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('OPERATOR');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<UserStatus>('ACTIVE');
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Se o usuário logado não for ADMIN
  if (currentUser && currentUser.role !== 'ADMIN') {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19]">
        <Header title="Acesso Restrito" subtitle="Controle de Permissões Elohdigital" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-md text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Acesso Exclusivo para Administradores
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              O módulo de Gestão de Usuários e Níveis de Permissão só pode ser acessado e configurado por contas com nível <strong className="text-rose-500">ADMIN</strong>.
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-slate-400">
                Seu perfil atual:{' '}
                <strong className="text-slate-700 dark:text-slate-200">
                  {ROLE_DEFINITIONS[currentUser.role]?.label || currentUser.role}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Abrir Modal de Criação
  const openCreateModal = () => {
    setEditingUserId(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('OPERATOR');
    setJobTitle('');
    setPhone('');
    setStatus('ACTIVE');
    setFormError(null);
    setShowPassword(false);
    setShowModal(true);
  };

  // Abrir Modal de Edição
  const openEditModal = (targetUser: User) => {
    setEditingUserId(targetUser.id);
    setName(targetUser.name);
    setEmail(targetUser.email);
    setPassword(targetUser.password || '');
    setRole(targetUser.role);
    setJobTitle(targetUser.jobTitle || '');
    setPhone(targetUser.phone || '');
    setStatus(targetUser.status);
    setFormError(null);
    setShowPassword(false);
    setShowModal(true);
  };

  // Submissão do Formulário (Salvar / Criar)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim()) {
      setFormError('Nome e E-mail são obrigatórios.');
      return;
    }

    if (!editingUserId && (!password || password.length < 4)) {
      setFormError('A senha é obrigatória e deve ter pelo menos 4 caracteres.');
      return;
    }

    if (editingUserId) {
      // Atualizar existente
      const res = updateUser(editingUserId, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim() || undefined,
        role,
        jobTitle: jobTitle.trim() || undefined,
        phone: phone.trim() || undefined,
        status,
      });

      if (!res.success) {
        setFormError(res.message || 'Erro ao atualizar usuário.');
        return;
      }
      showToast('Usuário atualizado com sucesso!');
    } else {
      // Criar novo usuário
      const res = addUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role,
        jobTitle: jobTitle.trim() || undefined,
        phone: phone.trim() || undefined,
        status,
      });

      if (!res.success) {
        setFormError(res.message || 'Erro ao cadastrar usuário.');
        return;
      }
      showToast('Novo usuário cadastrado com sucesso!');
    }

    setShowModal(false);
  };

  // Alternar Status Ativo / Inativo
  const handleToggleStatus = (targetUser: User) => {
    if (currentUser?.id === targetUser.id) {
      alert('Você não pode inativar seu próprio usuário conectado.');
      return;
    }
    const newStatus: UserStatus = targetUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    updateUser(targetUser.id, { status: newStatus });
    showToast(`Status do usuário ${targetUser.name} alterado para ${newStatus === 'ACTIVE' ? 'Ativo' : 'Inativo'}.`);
  };

  // Excluir Usuário
  const handleDelete = (targetUser: User) => {
    if (confirm(`Tem certeza de que deseja excluir permanentemente o usuário "${targetUser.name}" (${targetUser.email})?`)) {
      const res = deleteUser(targetUser.id);
      if (!res.success) {
        alert(res.message);
      } else {
        showToast('Usuário excluído com sucesso.');
      }
    }
  };

  // Filtragem dos usuários
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.jobTitle && u.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Métricas
  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const managerCount = users.filter((u) => u.role === 'MANAGER').length;
  const operatorCount = users.filter((u) => u.role === 'OPERATOR').length;
  const activeCount = users.filter((u) => u.status === 'ACTIVE').length;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors">
      <Header
        title="Gestão de Usuários & Níveis de Acesso"
        subtitle="Cadastre novos colaboradores, controle e-mails/senhas e defina permissões controladas pelo Administrador"
      >
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md shadow-cyan-500/10 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Usuário</span>
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
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Usuários
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                {totalCount}
              </span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
              Administradores
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono">
                {adminCount}
              </span>
              <ShieldCheck className="w-4 h-4 text-rose-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
              Gerentes / Gestores
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                {managerCount}
              </span>
              <Briefcase className="w-4 h-4 text-amber-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider block">
              Operacional / Devs
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                {operatorCount}
              </span>
              <KeyRound className="w-4 h-4 text-cyan-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">
              Contas Ativas
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {activeCount}
              </span>
              <UserCheck className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Guia Visual de Níveis de Permissão */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Regras e Níveis de Permissão do Sistema
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(Object.keys(ROLE_DEFINITIONS) as UserRole[]).map((rKey) => {
              const rDef = ROLE_DEFINITIONS[rKey];
              return (
                <div
                  key={rKey}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${rDef.badgeColor}`}>
                      {rDef.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{rKey}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {rDef.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou cargo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 font-medium mr-1 flex-shrink-0">Perfil:</span>
            {['ALL', 'ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER'].map((rf) => (
              <button
                key={rf}
                type="button"
                onClick={() => setRoleFilter(rf)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  roleFilter === rf
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {rf === 'ALL' ? 'Todos' : ROLE_DEFINITIONS[rf as UserRole]?.label || rf}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela / Cards de Usuários */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Usuário</th>
                  <th className="py-3.5 px-4">Acesso (E-mail & Senha)</th>
                  <th className="py-3.5 px-4">Nível de Permissão</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Último Login</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Nenhum usuário encontrado com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = currentUser?.id === u.id;
                    const roleInfo = ROLE_DEFINITIONS[u.role] || {
                      label: u.role,
                      badgeColor: 'bg-slate-100 text-slate-700',
                    };

                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        {/* Usuário (Nome & Cargo) */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                              {u.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-slate-900 dark:text-white truncate">
                                  {u.name}
                                </p>
                                {isSelf && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-300 dark:border-cyan-800/40">
                                    Você
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 truncate">
                                {u.jobTitle || 'Sem cargo definido'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* E-mail & Senha */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="flex items-center gap-1 font-mono text-slate-700 dark:text-slate-300">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {u.email}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                              <Lock className="w-2.5 h-2.5" />
                              Senha: ••••••••
                            </span>
                          </div>
                        </td>

                        {/* Permissão / Role */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${roleInfo.badgeColor}`}
                          >
                            {roleInfo.label}
                          </span>
                        </td>

                        {/* Status (Ativo / Inativo) */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u)}
                            disabled={isSelf}
                            title={isSelf ? 'Você não pode inativar sua própria conta' : 'Clique para alternar status'}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                              u.status === 'ACTIVE'
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/40'
                            } ${isSelf ? 'opacity-80 cursor-default' : 'hover:scale-105 active:scale-95 cursor-pointer'}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                              }`}
                            />
                            <span>{u.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</span>
                          </button>
                        </td>

                        {/* Último Login */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {u.lastLogin ? (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {new Date(u.lastLogin).toLocaleDateString('pt-BR')} às{' '}
                              {new Date(u.lastLogin).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Nunca acessou</span>
                          )}
                        </td>

                        {/* Ações */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-cyan-50 dark:bg-slate-800 dark:hover:bg-cyan-950/60 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-colors"
                              title="Editar Usuário, Senha e Permissões"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(u)}
                              disabled={isSelf}
                              className={`p-1.5 rounded-lg transition-colors border ${
                                isSelf
                                  ? 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-800'
                                  : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
                              }`}
                              title={isSelf ? 'Não é possível excluir seu próprio usuário' : 'Excluir Usuário'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: CRIAR OU EDITAR USUÁRIO */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 md:p-7 space-y-5 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {editingUserId ? 'Editar Usuário & Permissões' : 'Cadastrar Novo Usuário'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Defina e-mail de acesso, senha e o nível de permissão adequado
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

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 max-h-[72vh] overflow-y-auto pr-1">
                {/* 1. Nome & E-mail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Carlos Oliveira"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      E-mail de Login *
                    </label>
                    <input
                      type="email"
                      placeholder="carlos@elohdigital.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                {/* 2. Senha de Acesso */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{editingUserId ? 'Senha de Acesso (Deixe em branco para manter)' : 'Senha de Acesso *'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium hover:underline flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Ocultar' : 'Visualizar'}</span>
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={editingUserId ? 'Digite nova senha ou deixe como está' : 'Mínimo de 4 caracteres'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required={!editingUserId}
                  />
                  <p className="text-[10px] text-slate-400">
                    O critério para entrar no sistema é o e-mail cadastrado e esta senha.
                  </p>
                </div>

                {/* 3. Cargo & Telefone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Cargo / Função
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Gestor de Tráfego, Dev Backend"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="(11) 98888-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* 4. Nível de Permissão (Role) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Nível de Permissão do Usuário *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(Object.keys(ROLE_DEFINITIONS) as UserRole[]).map((rKey) => {
                      const rDef = ROLE_DEFINITIONS[rKey];
                      const isSelected = role === rKey;
                      return (
                        <div
                          key={rKey}
                          onClick={() => setRole(rKey)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-500 shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {rDef.label}
                            </span>
                            <span
                              className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? 'border-cyan-500 bg-cyan-500 text-white'
                                  : 'border-slate-400'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                            {rDef.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Status da Conta */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Status da Conta
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Usuários inativos são bloqueados e não conseguem efetuar login.
                    </span>
                  </div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as UserStatus)}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 font-semibold"
                  >
                    <option value="ACTIVE">Ativo (Permitido)</option>
                    <option value="INACTIVE">Inativo (Bloqueado)</option>
                  </select>
                </div>

                {/* Botões do Rodapé */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
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
                    {editingUserId ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
