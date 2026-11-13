export type ClientStatus = 'LEAD' | 'ONBOARDING' | 'ACTIVE_RECURRENT' | 'ACTIVE_PROJECT' | 'INACTIVE';

export interface Client {
  id: string;
  corporateName: string; // Razão Social / Nome Completo
  tradeName: string; // Nome Fantasia
  personType?: 'PJ' | 'PF'; // Jurídica ou Física
  document?: string; // CNPJ ou CPF
  stateRegistration?: string; // Inscrição Estadual (IE)
  municipalRegistration?: string; // Inscrição Municipal (IM)
  taxRegime?: string; // Regime Tributário
  legalRepresentative?: string; // Responsável Legal / Jurídico
  email?: string;
  phone?: string;
  contactPerson?: string;
  segment?: string;
  status: ClientStatus;
  zipCode?: string; // CEP
  address?: string; // Logradouro
  addressNumber?: string; // Número
  addressComplement?: string; // Complemento
  neighborhood?: string; // Bairro
  city?: string;
  state?: string;
  notes?: string; // Observações Gerais
  createdAt: string; // Data do Cadastro
}

export type SupplierBillingModel = 'FIXED_PROJECT' | 'MONTHLY_RETAINER' | 'HOURLY_RATE' | 'FLEXIBLE';

export type SupplierKind = 'FREELANCER_EQUIPE' | 'ESTRUTURA_API';

export interface Supplier {
  id: string;
  name: string;
  kind?: SupplierKind; // 'FREELANCER_EQUIPE' (mão de obra) ou 'ESTRUTURA_API' (setup/infra/apis)
  document?: string; // CNPJ ou CPF
  category: string;
  email?: string;
  phone?: string;
  billingModel?: SupplierBillingModel; // Modelo principal de contratação
  fixedProjectCost?: number; // Valor fixo por projeto / escopo
  monthlyRetainer?: number; // Mensalidade recorrente (fee mensal / SaaS)
  hourlyRate?: number; // Hora técnica
  pixKey?: string;
  bankInfo?: string; // Informações bancárias para repasse
  skills?: string; // Tecnologias ou especialidades principais
  notes?: string;
  createdAt?: string;
}

// Helpers para classificar Fornecedores entre Mão de Obra (Freelancers/Equipe) e Estrutura (Servidores/APIs)
export function isFreelancerOrTeam(s: Supplier): boolean {
  if (s.kind === 'FREELANCER_EQUIPE') return true;
  if (s.kind === 'ESTRUTURA_API') return false;
  const cat = (s.category || '').toLowerCase();
  const name = (s.name || '').toLowerCase();
  if (
    cat.includes('freelancer') ||
    cat.includes('equipe') ||
    cat.includes('dev') ||
    cat.includes('design') ||
    cat.includes('copy') ||
    cat.includes('gestor') ||
    cat.includes('mão de obra') ||
    cat.includes('tráfego') ||
    cat.includes('consultoria') ||
    name.includes('freelancer') ||
    name.includes('dev')
  ) {
    return true;
  }
  if (
    cat.includes('infra') ||
    cat.includes('cloud') ||
    cat.includes('servidor') ||
    cat.includes('hospedagem') ||
    cat.includes('api') ||
    cat.includes('ferramenta') ||
    cat.includes('saas') ||
    cat.includes('ia') ||
    name.includes('servidor') ||
    name.includes('vps') ||
    name.includes('openai') ||
    name.includes('api')
  ) {
    return false;
  }
  if (s.hourlyRate && s.hourlyRate > 0) return true;
  return true;
}

export function isStructureOrApi(s: Supplier): boolean {
  return !isFreelancerOrTeam(s);
}

export type ContactChannel = 'WHATSAPP' | 'EMAIL' | 'CALL' | 'MEETING' | 'IN_PERSON';

export interface ContactHistory {
  id: string;
  date: string; // ISO string with date and time
  channel: ContactChannel;
  summary: string;
  nextFollowUp?: string;
  author: string;
  clientId?: string;
  clientName?: string;
  supplierId?: string;
  supplierName?: string;
}

export type PipelineStage = 'DISCOVERY' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'WON' | 'LOST';

export interface LeadDeal {
  id: string;
  title: string;
  stage: PipelineStage;
  estimatedValue: number;
  probability: number;
  clientId: string;
  clientName: string;
  expectedClose?: string;
  lostReason?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  serviceType: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'DATA_BI' | 'AUTOMATION' | 'WEB_DEV' | 'PAID_TRAFFIC' | 'CONSULTING';
  billingType: 'FIXED' | 'MONTHLY' | 'HOURLY';
  basePrice: number;
  defaultHours: number;
  description: string;
}

export interface ProposalTeamMember {
  id: string;
  supplierId: string;
  name: string;
  category: string;
  billingType: 'HOURLY' | 'FIXED';
  hours: number;
  rate: number;
  total: number;
}

export interface ProposalStructureItem {
  id: string;
  supplierId?: string;
  name: string;
  category: 'SETUP' | 'THIRD_PARTY';
  cost: number;
}

export interface Proposal {
  id: string;
  code: string;
  title: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED';
  clientId: string;
  clientName: string;
  estimatedHours: number;
  hourlyRate: number;
  laborCost: number;
  setupCost: number;
  thirdPartyCost: number;
  marginPercent: number;
  totalAmount: number;
  paymentTerms: string;
  scopeDetails: string;
  validUntil: string;
  createdAt: string;
  teamMembers?: ProposalTeamMember[];
  structureItems?: ProposalStructureItem[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  category: 'CONTRACT' | 'ACCESS' | 'COMMUNICATION' | 'KICKOFF' | 'SETUP';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string;
  completedAt?: string;
  notes?: string;
  clientId: string;
  clientName: string;
}

export interface ProjectStage {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'PAUSED';
  serviceType: string;
  clientId: string;
  clientName: string;
  startDate: string;
  targetEndDate: string;
  budget: number;
  brainstormNotes: string;
  partnersInvolved: string;
  partnerIds?: string[];
  stages?: ProjectStage[];
  progressPercent: number;
  proposalId?: string;
}

export interface Ticket {
  id: string;
  ticketNumber: number;
  title: string;
  description: string;
  category: 'BUG' | 'FEATURE_REQUEST' | 'REPORT_ADJUSTMENT' | 'ADS_CAMPAIGN' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_APPROVAL' | 'RESOLVED' | 'CLOSED';
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  createdAt: string;
  slaDeadline?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  clientId?: string;
  clientName?: string;
  projectId?: string;
  projectName?: string;
}

export interface Transaction {
  id: string;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  category: 'MONTHLY_RETAINER' | 'PROJECT_PAYMENT' | 'SETUP_FEE' | 'SAAS_TOOLS' | 'FREELANCER' | 'TAX' | 'INFRA_HOSTING' | 'OTHER';
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  paymentMethod: string;
  clientId?: string;
  clientName?: string;
  supplierId?: string;
  supplierName?: string;
}

// ----------------------------------------------------
// USUÁRIOS, SESSÃO & NÍVEIS DE PERMISSÃO
// ----------------------------------------------------
export type UserRole = 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'VIEWER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  jobTitle?: string;
  avatar?: string;
  status: UserStatus;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
}

export const ROLE_DEFINITIONS: Record<UserRole, { label: string; description: string; badgeColor: string }> = {
  ADMIN: {
    label: 'Administrador',
    description: 'Acesso total irrestrito: gestão de usuários, permissões, financeiro, configurações e exclusões.',
    badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800/40',
  },
  MANAGER: {
    label: 'Gerente / Gestor',
    description: 'Acesso completo a projetos, clientes, comercial, orçamentos e financeiro. Sem gestão de usuários.',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800/40',
  },
  OPERATOR: {
    label: 'Operacional / Dev',
    description: 'Acesso a projetos, tarefas, chamados de suporte e onboarding de clientes atribuídos.',
    badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800/40',
  },
  VIEWER: {
    label: 'Visualizador / Cliente',
    description: 'Visualização de relatórios, status de projetos e histórico em modo somente leitura.',
    badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  },
};

