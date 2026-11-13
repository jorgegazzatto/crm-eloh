'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { useCompany } from '@/context/CompanyContext';
import { Loader2 } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { settings } = useCompany();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (isLoading) return;

    if (!user && !isLoginPage) {
      router.replace('/login');
    } else if (user && isLoginPage) {
      router.replace('/');
    }
  }, [user, isLoading, isLoginPage, router]);

  // Tela de Carregamento durante inicialização da sessão
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-cyan-500/25 animate-pulse">
            {settings.tradeName?.charAt(0) || 'E'}
          </div>
          <div>
            <h2 className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
              {settings.tradeName || 'Elohdigital CRM'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verificando credenciais e sessão...
            </p>
          </div>
          <Loader2 className="w-5 h-5 text-cyan-500 animate-spin mt-1" />
        </div>
      </div>
    );
  }

  // Página de Login (renderiza sem sidebar nem molduras internas)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Se não estiver logado e não for a página de login, aguarda o redirecionamento
  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19]">
        <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
      </div>
    );
  }

  // Layout normal para usuários autenticados
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-200">
        {children}
      </main>
    </div>
  );
}
