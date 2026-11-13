import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Elohdigital — CRM & Business Suite',
  description: 'Controle integrado de negócios, clientes, orçamentos, projetos e financeiro para Elohdigital',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex min-h-screen transition-colors duration-200">
        <Providers>
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-200">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
