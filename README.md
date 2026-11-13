# Elohdigital — CRM & Business Suite

Sistema integrado de gestão empresarial, comercial e operacional desenvolvido sob medida para a **Elohdigital**.

---

## 🚀 Módulos Implementados

1. **Dashboard Executivo (`/`)**: Visão consolidada de receitas (previstas x realizadas), pipeline ativo, projetos em andamento, chamados e follow-ups do dia.
2. **Funil de Vendas & Prospecção (`/pipeline`)**: Pipeline Kanban visual (Descoberta -> Qualificação -> Proposta Enviada -> Negociação -> Fechado/Perdido) com valores e probabilidades.
3. **Calculadora de Orçamentos & Custos (`/orcamentos`)**: Composição de preço por hora técnica estimada + custo fixo de setup (infra/contas/APIs) + custos de terceiros + margem de lucro calculada em tempo real com exportação/impressão.
4. **Clientes & Fornecedores (`/clientes`)**: Cadastro completo de clientes (status: Recorrente, Projeto, Onboarding, Lead) e parceiros/freelancers com tabela de preço-hora e chave PIX.
5. **Onboarding Estruturado (`/onboarding`)**: Checklist de acolhimento e coleta de acessos (BM Meta, GA4, hospedagens, grupos oficiais e kick-off).
6. **Gestão de Projetos & Brainstorming (`/projetos`)**: Controle de entregas de BI, Automação, Sites e Tráfego, com espaço dedicado para anotações técnicas, links, inspirações e alocação de equipe.
7. **Central de Chamados / Helpdesk (`/chamados`)**: Registro de solicitações e demandas pontuais com níveis de prioridade (Baixa, Média, Alta, Crítica) e SLA.
8. **To-Do / Tarefas Operacionais (`/tarefas`)**: Lista diária com prioridades e vinculação a clientes e projetos.
9. **Linha do Tempo de Contatos (`/contatos`)**: Log com data e hora exata de reuniões, e-mails, WhatsApp e agendamento de retornos futuros.
10. **Financeiro / Fluxo de Caixa (`/financeiro`)**: Controle de entradas (mensalidades/projetos) e saídas (softwares, APIs de IA, freelas) com cálculo do saldo líquido e baixa de pagamentos.
11. **Catálogo de Serviços (`/servicos`)**: Tabela de produtos e serviços da Elohdigital (BI, Automações, Sites, Tráfego Pago, Consultoria).

---

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Estilização**: Tailwind CSS + Lucide React Icons
- **Banco de Dados & ORM**: PostgreSQL (Produção no Dokploy) / SQLite (Desenvolvimento Local) com Prisma ORM
- **Containerização**: Multi-stage Dockerfile otimizado para Dokploy (modo standalone, ~80MB RAM)

---

## 🚢 Deploy no Dokploy (VPS Oracle Cloud)

- **IP da VPS**: `136.248.82.204`
- **Subdomínio**: `crm.elohdigital.com.br`
- **Repositório GitHub**: `https://github.com/jorgegazzatto/crm-eloh.git`

### Configuração no Dokploy:
1. Criar Serviço **Database (PostgreSQL)**: nome `crm-db`.
2. Criar Serviço **Application**: conectar ao repositório GitHub `crm-eloh`, branch `main`.
3. Build Type: **Dockerfile**.
4. Definir Domínio: `crm.elohdigital.com.br` na porta `3000`.
5. Variáveis de ambiente:
   ```env
   DATABASE_URL="postgresql://usuario:senha@crm-db:5432/eloh_crm?schema=public"
   NODE_ENV="production"
   PORT="3000"
   ```
