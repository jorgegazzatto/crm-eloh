'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Kanban,
  Calculator,
  Rocket,
  FolderKanban,
  Headphones,
  CheckSquare,
  History,
  DollarSign,
  Package,
  Layers,
  ChevronRight,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Funil de Vendas', href: '/pipeline', icon: Kanban, badge: '3' },
  { name: 'Orçamentos & Setup', href: '/orcamentos', icon: Calculator },
  { name: 'Clientes & Parceiros', href: '/clientes', icon: Users },
  { name: 'Onboarding', href: '/onboarding', icon: Rocket, badge: '1' },
  { name: 'Projetos & Brainstorm', href: '/projetos', icon: FolderKanban },
  { name: 'Chamados / Helpdesk', href: '/chamados', icon: Headphones, badge: '2' },
  { name: 'Tarefas (To-Do)', href: '/tarefas', icon: CheckSquare },
  { name: 'Histórico de Contatos', href: '/contatos', icon: History },
  { name: 'Financeiro (Fluxo)', href: '/financeiro', icon: DollarSign },
  { name: 'Serviços & Produtos', href: '/servicos', icon: Package },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            E
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-lg tracking-tight">Eloh</span>
              <span className="text-cyan-400 font-extrabold text-lg">digital</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Business Suite CRM
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Módulos de Gestão
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/20 text-cyan-300 border-l-4 border-cyan-400 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info / VPS Dokploy Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="bg-slate-800/40 rounded-lg p-2.5 border border-slate-700/50">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Oracle VPS Online
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
              Dokploy
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono truncate">
            crm.elohdigital.com.br
          </p>
        </div>
      </div>
    </aside>
  );
}
