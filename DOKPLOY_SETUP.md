# Guia de Configuração de Infraestrutura — Elohdigital CRM

Este guia consolida o padrão de nomenclatura, variáveis de ambiente e passos para publicação contínua no **Dokploy** (VPS Oracle) conectado ao **GitHub**.

---

## 1. Padrão de Nomenclatura Recomendado

| Recurso | Nome Sugerido / Configurado | Finalidade |
| :--- | :--- | :--- |
| **Repositório GitHub** | `crm-eloh` (`https://github.com/jorgegazzatto/crm-eloh.git`) | Código-fonte com CI/CD e webhook para Dokploy |
| **Branch de Produção** | `main` | Cada push na `main` dispara deploy automático |
| **Projeto no Dokploy** | `eloh-crm-prod` | Agrupador dos serviços no painel do Dokploy |
| **Serviço Web (App)** | `crm-app` | Aplicação Next.js (Node Standalone na porta 3000) |
| **Serviço de Banco** | `crm-db` | Container PostgreSQL 16 (Dokploy Database Service) |
| **Subdomínio** | `crm.elohdigital.com.br` | URL de acesso público com SSL automático (Let's Encrypt) |
| **IP da VPS** | `136.248.82.204` | Servidor Oracle Cloud (Ubuntu) |

---

## 2. Topologia no Dokploy (Oracle Cloud VPS)

```mermaid
flowchart TD
    subgraph Internet & DNS
        USER[Usuário / Equipe] -->|HTTPS| SUB[crm.elohdigital.com.br]
        GH[GitHub Repo: crm-eloh / main] -->|Deploy / Webhook| DOK[Dokploy Engine]
    end

    subgraph Dokploy / Docker Network
        TRAEFIK[Dokploy Traefik / SSL Let's Encrypt]
        SUB --> TRAEFIK
        TRAEFIK -->|Port 3000| APP[Next.js App Standalone]
        APP -->|Port 5432 - Internal Network| DB[(PostgreSQL 16 - crm-db)]
    end
```

### Vantagens dessa arquitetura:
1. **Consumo mínimo de RAM**: Next.js em modo `standalone` consome ~60–90MB de RAM. O PostgreSQL interno consome ~50–80MB. Ideal para a VPS da Oracle.
2. **Segurança**: O banco de dados PostgreSQL roda na rede interna do Docker do Dokploy — a porta 5432 **não** precisa ficar exposta para a internet.
3. **Zero-downtime & SSL Grátis**: O Dokploy gerencia certificados TLS/SSL automaticamente via Traefik.

---

## 3. Variáveis de Ambiente (`.env`)

No Dokploy, dentro das configurações do serviço `crm-app` (Environment):

```env
# Ambiente
NODE_ENV=production
PORT=3000

# Conexão com o Banco interno do Dokploy
# Formato: postgresql://<user>:<password>@crm-db:5432/<dbname>?schema=public
DATABASE_URL="postgresql://dokploy:SUA_SENHA_AQUI@crm-db:5432/eloh_crm?schema=public"

# Informações da Empresa
NEXT_PUBLIC_COMPANY_NAME="Elohdigital"
NEXT_PUBLIC_COMPANY_SITE="https://elohdigital.com.br"
```

---

## 4. Passo a Passo de Configuração no Dokploy e DNS

### Passo 1: DNS (Cloudflare / Registro.br / Hospedagem)
- Crie ou confirme uma entrada do tipo **A**:
  - **Tipo**: `A`
  - **Nome**: `crm` (para `crm.elohdigital.com.br`)
  - **Destino / IP**: `136.248.82.204`
  - **Proxy**: DNS Only (se for Cloudflare, pode usar DNS Only no primeiro teste de SSL do Let's Encrypt, ou Full Strict com proxy ativado).

### Passo 2: Criar o Banco de Dados no Dokploy
1. Acesse o painel do Dokploy (`http://136.248.82.204:3000` ou a porta/URL onde seu painel Dokploy está configurado).
2. Vá em **Projects** ➔ Adicionar Projeto: `eloh-crm-prod`.
3. Clique em **Create Service** ➔ Escolha **Database** ➔ **PostgreSQL**.
4. Defina o nome do serviço como: `crm-db`.
5. Nome da Database: `eloh_crm`. Dokploy vai gerar usuário e senha.

### Passo 3: Conectar a Aplicação no Dokploy
1. No mesmo projeto `eloh-crm-prod`, clique em **Create Service** ➔ **Application**.
2. Nomeie o serviço como: `crm-app`.
3. Conecte ao seu repositório GitHub: `https://github.com/jorgegazzatto/crm-eloh.git`.
4. Branch: `main`.
5. Build Type: **Dockerfile**.
6. Em **Domains**:
   - Host: `crm.elohdigital.com.br`
   - Container Port: `3000`
   - Habilite HTTPS / Certificado SSL automático.
7. Em **Environment**:
   - Cole a `DATABASE_URL` conectando ao `crm-db`.
8. Clique em **Deploy**.

