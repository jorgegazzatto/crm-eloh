'use client';

import React from 'react';
import Link from 'next/link';
import { useCompany } from '@/context/CompanyContext';
import { useTheme } from '@/context/ThemeContext';
import { Search, Plus, Sun, Moon, Laptop, Settings } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  const { settings } = useCompany();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

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
            className="w-64 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Custom Actions passed from page */}
        {children}

        {/* Botão Seletor Rápido de Tema */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Tema atual: ${theme}. Clique para alternar.`}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors"
        >
          {theme === 'system' ? (
            <Laptop className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          ) : resolvedTheme === 'dark' ? (
            <Moon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

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

        {/* User / Company Pill */}
        <Link
          href="/configuracoes"
          className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition-opacity"
        >
          {settings.logoUrl ? (
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-slate-200 dark:border-slate-700 flex items-center justify-center p-0.5">
              <img
                src={settings.logoUrl}
                alt={settings.tradeName}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-200 dark:ring-slate-800">
              {settings.tradeName?.slice(0, 2).toUpperCase() || 'EL'}
            </div>
          )}
          <div className="hidden lg:block text-left max-w-[120px] truncate">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">
              {settings.tradeName || 'Elohdigital'}
            </p>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium leading-tight">
              Gestor
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
