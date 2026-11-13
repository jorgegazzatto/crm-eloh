'use client';

import React from 'react';
import Link from 'next/link';
import { useCompany } from '@/context/CompanyContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ROLE_DEFINITIONS } from '@/lib/types';
import { Search, Plus, Sun, Moon, Laptop, Settings, LogOut, ShieldCheck, User } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  const { settings } = useCompany();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between transition-colors">
      <div>
        {title && (
          <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
        )}
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar clientes, propostas, tarefas..."
            className="w-56 lg:w-64 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Seletor de Tema ao lado da Busca (Light, Dark, System) */}
        <div
          className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5"
          title="Alterar tema: Claro, Escuro ou Sistema"
        >
          <button
            type="button"
            onClick={() => setTheme('light')}
            title="Tema Claro (Light)"
            className={`p-1.5 rounded-md transition-all ${
              theme === 'light'
                ? 'bg-white dark:bg-slate-800 text-amber-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            title="Tema Escuro (Dark)"
            className={`p-1.5 rounded-md transition-all ${
              theme === 'dark'
                ? 'bg-white dark:bg-slate-800 text-indigo-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('system')}
            title="Tema Automático do Sistema (System)"
            className={`p-1.5 rounded-md transition-all ${
              theme === 'system'
                ? 'bg-white dark:bg-slate-800 text-cyan-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Custom Actions passed from page */}
        {children}

        {/* Botão Atalho Configurações */}
        <Link
          href="/configuracoes"
          title="Configurações do Sistema"
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Global Quick Action */}
        <Link
          href="/orcamentos"
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-md shadow-cyan-500/10 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Orçamento</span>
        </Link>

        {/* User Session Pill & Actions */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
          <Link
            href="/configuracoes"
            title="Ver meu perfil e configurações"
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-200 dark:ring-slate-800 flex-shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
            </div>
            <div className="hidden lg:block text-left max-w-[130px] truncate">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold leading-tight truncate">
                {user ? ROLE_DEFINITIONS[user.role]?.label || user.role : 'Conectado'}
              </p>
            </div>
          </Link>

          {/* Botão de Logout */}
          <button
            type="button"
            onClick={logout}
            title="Sair do sistema (Logout)"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 transition-all hover:scale-105 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
