'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/context/CompanyContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
  AlertCircle,
  KeyRound,
  UserCheck,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { settings } = useCompany();
  const { theme, setTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push('/');
      } else {
        setErrorMessage(res.message || 'Falha ao autenticar.');
      }
    } catch {
      setErrorMessage('Ocorreu um erro inesperado ao processar o login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-100 transition-colors selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Brand & Theme Switcher */}
      <header className="p-6 flex items-center justify-between z-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          {settings.logoUrl ? (
            <div className="h-10 max-w-[150px] flex items-center overflow-hidden">
              <img
                src={settings.logoUrl}
                alt={settings.tradeName}
                className="max-h-9 max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/20">
              {settings.tradeName?.charAt(0) || 'E'}
            </div>
          )}
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
              {settings.tradeName || 'Elohdigital'}
            </span>
            <span className="text-cyan-600 dark:text-cyan-400 font-extrabold text-xs ml-1.5">
              CRM
            </span>
          </div>
        </div>

        {/* Theme Switcher */}
        <div className="flex items-center bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded-lg transition-all ${
              theme === 'light'
                ? 'bg-slate-100 dark:bg-slate-800 text-amber-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Modo Claro"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded-lg transition-all ${
              theme === 'dark'
                ? 'bg-slate-100 dark:bg-slate-800 text-indigo-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Modo Escuro"
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-1.5 rounded-lg transition-all ${
              theme === 'system'
                ? 'bg-slate-100 dark:bg-slate-800 text-cyan-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Sistema"
          >
            <Laptop className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/90 rounded-3xl p-7 md:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mx-auto flex items-center justify-center mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Acesso ao Sistema
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Informe seu e-mail cadastrado e senha para iniciar sua sessão
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                E-mail cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="seu.email@elohdigital.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3.5 py-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Senha cadastrada
                </label>
                <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium cursor-pointer hover:underline">
                  Controle do Administrador
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-11 py-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Autenticando...' : 'Entrar no Sistema'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Selector */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
              Acesso Rápido de Teste (Preenchimento com 1 clique):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('admin@elohdigital.com.br', 'admin123')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-800 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 truncate">
                    Administrador
                  </span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                    ADMIN
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">admin@elohdigital.com.br</p>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('mariana@elohdigital.com.br', 'gestao123')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-800 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 truncate">
                    Gerente
                  </span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                    GESTOR
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">mariana@elohdigital.com.br</p>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('felipe@elohdigital.com.br', 'dev123')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-800 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 truncate">
                    Operacional
                  </span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">
                    DEV
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">felipe@elohdigital.com.br</p>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('nexus@cliente.com.br', 'cliente123')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-800 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 truncate">
                    Visualizador
                  </span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold">
                    CLIENTE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">nexus@cliente.com.br</p>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 z-10 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Sessão Protegida • Dokploy v0.31 & Oracle Cloud VPS</span>
      </footer>
    </div>
  );
}
