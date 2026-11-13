'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { CompanyProvider } from '@/context/CompanyContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CompanyProvider>
        {children}
      </CompanyProvider>
    </ThemeProvider>
  );
}

