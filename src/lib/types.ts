export type ClientStatus = 'LEAD' | 'ONBOARDING' | 'ACTIVE_RECURRENT' | 'ACTIVE_PROJECT' | 'INACTIVE';

export interface Client {
  id: string;
  corporateName: string;
  tradeName: string;
  document?: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  segment?: string;
  status: ClientStatus;
  city?: string;
  state?: string;
  notes?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  document?: string;
  category: string;
  email?: string;
  phone?: string;
  hourlyRate?: number;
  pixKey?: string;
  notes?: string;
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
  progressPercent: number;
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
