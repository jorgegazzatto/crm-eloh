'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CompanySettings {
  // Identidade & Logo
  logoUrl: string | null;
  tradeName: string; // Nome Fantasia
  corporateName: string; // Razão Social
  
  // Fiscal & Jurídico
  cnpj: string;
  stateRegistration: string; // Inscrição Estadual
  municipalRegistration: string; // Inscrição Municipal
  taxRegime: string; // Ex: Simples Nacional, Lucro Presumido, MEI
  legalRepresentative: string;
  
  // Contato
  email: string;
  phone: string;
  website: string;

  // Endereço
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;

  // Financeiro / Pagamento
  pixKey: string;
  pixKeyType: string;
  bankName: string;
  bankAgency: string;
  bankAccount: string;
}

const defaultCompanySettings: CompanySettings = {
  logoUrl: null,
  tradeName: 'Elohdigital',
  corporateName: 'Elohdigital Tecnologia & Negócios Ltda',
  cnpj: '00.000.000/0001-00',
  stateRegistration: 'Isento',
  municipalRegistration: '',
  taxRegime: 'Simples Nacional',
  legalRepresentative: 'Jorge Gazzatto',
  email: 'contato@elohdigital.com.br',
  phone: '(11) 99999-9999',
  website: 'https://elohdigital.com.br',
  cep: '01001-000',
  street: 'Av. Paulista',
  number: '1000',
  complement: 'Conjunto 501',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
  pixKey: 'contato@elohdigital.com.br',
  pixKeyType: 'E-mail',
  bankName: 'Nubank / Inter',
  bankAgency: '0001',
  bankAccount: '1234567-8',
};

interface CompanyContextType {
  settings: CompanySettings;
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  resetSettings: () => void;
  isLoaded: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<CompanySettings>(defaultCompanySettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('eloh_crm_company_settings');
      if (saved) {
        setSettings({ ...defaultCompanySettings, ...JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Erro ao carregar configurações da empresa do localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('eloh_crm_company_settings', JSON.stringify(updated));
      } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
      }
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultCompanySettings);
    localStorage.removeItem('eloh_crm_company_settings');
  };

  return (
    <CompanyContext.Provider value={{ settings, updateSettings, resetSettings, isLoaded }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}

