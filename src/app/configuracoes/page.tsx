'use client';

import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { useTheme } from '@/context/ThemeContext';
import { useCompany } from '@/context/CompanyContext';
import {
  Sun,
  Moon,
  Laptop,
  Building2,
  MapPin,
  FileText,
  Upload,
  Image as ImageIcon,
  Trash2,
  Save,
  CheckCircle2,
  DollarSign,
  Globe,
  Mail,
  Phone,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function ConfiguracoesPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { settings, updateSettings, resetSettings } = useCompany();

  const [formData, setFormData] = useState(settings);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar form se settings mudar
  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, logoUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 4000);
  };

  const handleReset = () => {
    if (confirm('Deseja restaurar as configurações padrão da Elohdigital?')) {
      resetSettings();
      setShowSavedToast(true);
      setTimeout(() => {
        setShowSavedToast(false);
      }, 4000);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors">
      <Header
        title="Configurações do Sistema"
        subtitle="Personalize o tema visual, identidade da marca e os dados fiscais e jurídicos da empresa gestora"
      />

      <div className="p-6 md:p-8 max-w-6xl w-full mx-auto space-y-8">
        {/* Toast Notificação de Salvo */}
        {showSavedToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl shadow-emerald-900/40 border border-emerald-400/30 animate-bounce">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Configurações salvas!</p>
              <p className="text-xs text-emerald-100">Dados da empresa e preferências foram atualizados com sucesso.</p>
            </div>
          </div>
        )}

        {/* 1. SELETOR DE TEMA VISUAL */}
        <section className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h2 className="text-lg font-bold tracking-tight">Tema e Aparência</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Escolha a paleta visual do CRM ou sincronize automaticamente com o sistema operacional.
              </p>
            </div>

            <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 w-fit">
              Tema ativo: <strong className="capitalize text-cyan-600 dark:text-cyan-400">{resolvedTheme === 'dark' ? 'Escuro' : 'Claro'}</strong>
            </span>
          </div>

          <div className="pt-6">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-3">
              Chave Seletora de Tema
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Opção Claro (Light) */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  theme === 'light'
                    ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    theme === 'light'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-amber-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Light (Claro)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Visual limpo com fundo claro</p>
                </div>
              </button>

              {/* Opção Escuro (Dark) */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  theme === 'dark'
                    ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Dark (Escuro)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Modo escuro executivo moderno</p>
                </div>
              </button>

              {/* Opção Sistema (System) */}
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  theme === 'system'
                    ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    theme === 'system'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">System (Sistema)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Acompanha o SO automaticamente</p>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* FORMULÁRIO DE DADOS DA EMPRESA GESTORA */}
        <form onSubmit={handleSave} className="space-y-8">
          {/* 2. IDENTIDADE VISUAL & LOGOTIPO */}
          <section className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-6 border-b border-slate-100 dark:border-slate-800/80">
              <span className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <ImageIcon className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold tracking-tight">Logotipo da Empresa Gestora</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  O logotipo será exibido na barra lateral, no cabeçalho e na impressão de orçamentos e propostas comerciais.
                </p>
              </div>
            </div>

            <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Preview Box */}
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 text-center">
                {formData.logoUrl ? (
                  <div className="space-y-4 w-full flex flex-col items-center">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 max-h-32 flex items-center justify-center">
                      <img
                        src={formData.logoUrl}
                        alt="Logotipo da Empresa"
                        className="max-h-24 max-w-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remover Logotipo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
                      {formData.tradeName?.charAt(0) || 'E'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Nenhum logo carregado</p>
                      <p className="text-[11px] text-slate-400">Usando o ícone inicial por padrão</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                    Fazer upload de imagem (PNG, JPG ou SVG - até 2MB)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload-input"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <label
                      htmlFor="logo-upload-input"
                      className="cursor-pointer inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 transition-all"
                    >
                      <Upload className="w-4 h-4 text-cyan-500" />
                      Selecionar Arquivo no Computador
                    </label>
                    <span className="text-xs text-slate-400">Recomendado formato horizontal (300x80px)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                    Ou informe o Link direto da imagem (URL)
                  </label>
                  <input
                    type="url"
                    name="logoUrl"
                    value={formData.logoUrl || ''}
                    onChange={handleChange}
                    placeholder="https://elohdigital.com.br/logo.png"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 3. INFORMAÇÕES FISCAIS E JURÍDICAS */}
          <section className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-6 border-b border-slate-100 dark:border-slate-800/80">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold tracking-tight">Informações Fiscais & Jurídicas</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dados corporativos utilizados na emissão de contratos, orçamentos, recibos e notas fiscais.
                </p>
              </div>
            </div>

            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Nome Fantasia *
                </label>
                <input
                  type="text"
                  name="tradeName"
                  value={formData.tradeName}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Elohdigital"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Razão Social Completa *
                </label>
                <input
                  type="text"
                  name="corporateName"
                  value={formData.corporateName}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Elohdigital Soluções em Tecnologia Ltda"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  CNPJ *
                </label>
                <input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  required
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Regime Tributário
                </label>
                <select
                  name="taxRegime"
                  value={formData.taxRegime}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="Simples Nacional">Simples Nacional</option>
                  <option value="MEI">Microempreendedor Individual (MEI)</option>
                  <option value="Lucro Presumido">Lucro Presumido</option>
                  <option value="Lucro Real">Lucro Real</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Inscrição Estadual (IE)
                </label>
                <input
                  type="text"
                  name="stateRegistration"
                  value={formData.stateRegistration}
                  onChange={handleChange}
                  placeholder="Ex: Isento ou 000.000.000.000"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Inscrição Municipal (IM)
                </label>
                <input
                  type="text"
                  name="municipalRegistration"
                  value={formData.municipalRegistration}
                  onChange={handleChange}
                  placeholder="Ex: 12345678"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Representante Legal / Responsável
                </label>
                <input
                  type="text"
                  name="legalRepresentative"
                  value={formData.legalRepresentative}
                  onChange={handleChange}
                  placeholder="Ex: Jorge Gazzatto"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  E-mail Oficial / Financeiro
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contato@elohdigital.com.br"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Telefone / WhatsApp Comercial
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Website Oficial
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://elohdigital.com.br"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* 4. ENDEREÇO DA EMPRESA GESTORA */}
          <section className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-6 border-b border-slate-100 dark:border-slate-800/80">
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold tracking-tight">Endereço Comercial / Sede</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Localização jurídica informada no rodapé das propostas e faturas.
                </p>
              </div>
            </div>

            <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  placeholder="00000-000"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Logradouro (Rua, Avenida, Alameda)
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Ex: Av. Paulista"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Número
                </label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="Ex: 1000"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  name="complement"
                  value={formData.complement}
                  onChange={handleChange}
                  placeholder="Ex: Sala 501 / Bloco A"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  placeholder="Ex: Bela Vista"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ex: São Paulo"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Estado (UF)
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  maxLength={2}
                  placeholder="SP"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors uppercase font-mono"
                />
              </div>
            </div>
          </section>

          {/* 5. DADOS BANCÁRIOS & PIX */}
          <section className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-6 border-b border-slate-100 dark:border-slate-800/80">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <DollarSign className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold tracking-tight">Dados de Cobrança Padrão & PIX</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instruções de pagamento que acompanham as propostas aceitas e faturas aos clientes.
                </p>
              </div>
            </div>

            <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Tipo da Chave PIX
                </label>
                <select
                  name="pixKeyType"
                  value={formData.pixKeyType}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="CNPJ">CNPJ</option>
                  <option value="E-mail">E-mail</option>
                  <option value="Telefone">Telefone</option>
                  <option value="Aleatória">Chave Aleatória (EVP)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Chave PIX
                </label>
                <input
                  type="text"
                  name="pixKey"
                  value={formData.pixKey}
                  onChange={handleChange}
                  placeholder="Ex: financeiro@elohdigital.com.br"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Instituição Financeira (Banco)
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Ex: Inter / Nubank PJ"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Agência
                </label>
                <input
                  type="text"
                  name="bankAgency"
                  value={formData.bankAgency}
                  onChange={handleChange}
                  placeholder="0001"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Conta Corrente
                </label>
                <input
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  placeholder="1234567-8"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                />
              </div>
            </div>
          </section>

          {/* BOTÕES DE AÇÃO INFERIORES */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restaurar Padrões da Elohdigital
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              Salvar Todas as Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

