'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { CompanyProvider } from '@/context/CompanyContext';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CompanyProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </CompanyProvider>
    </ThemeProvider>
  );
}


