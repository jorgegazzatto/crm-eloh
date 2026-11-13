'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Plus, Bell, Sparkles, PhoneCall, HelpCircle } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
      <div>
        {title && <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>}
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar clientes, propostas, tarefas..."
            className="w-64 bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Custom Actions passed from page */}
        {children}

        {/* Global Quick Action */}
        <Link
          href="/orcamentos"
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-md shadow-cyan-500/10 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Orçamento</span>
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-800">
            EL
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">Elohdigital</p>
            <p className="text-[10px] text-cyan-400 font-medium leading-tight">Gestor Principal</p>
          </div>
        </div>
      </div>
    </header>
  );
}
