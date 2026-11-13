import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';

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
    <html lang="pt-BR">
      <body className="bg-[#0b0f19] text-slate-100 flex min-h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-[#0b0f19]">
          {children}
        </main>
      </body>
    </html>
  );
}
