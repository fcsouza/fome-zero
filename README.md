# 🍽️ Fome Zero - Doe Seguro

> Plataforma inteligente que conecta doadores de alimentos com ONGs, utilizando Inteligência Artificial para garantir validação jurídica e sanitária em conformidade com a Lei 14.016/2020

[![Devs de Impacto 2025](https://img.shields.io/badge/Devs%20de%20Impacto-2025-blue)](https://devsdeimpacto.com.br)
[![Equipe 17](https://img.shields.io/badge/Equipe-17-green)](https://devsdeimpacto.com.br)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Problema](#-problema)
- [Solução](#-solução)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Documentação da API](#-documentação-da-api)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
- [Equipe](#-equipe)

## 🎯 Sobre o Projeto

O **Fome Zero - Doe Seguro** é uma plataforma web desenvolvida para o hackathon **Devs de Impacto 2025** que visa facilitar e garantir a segurança jurídica e sanitária das doações de alimentos excedentes, conectando doadores (empresas e pessoas físicas) com Organizações Não Governamentais (ONGs).

### 📜 Contexto Legal

A plataforma está em conformidade com a **Lei nº 14.016/2020**, que estabelece normas para a doação de excedentes de alimentos para o consumo humano. Esta lei garante que doadores de boa-fé não sejam responsabilizados civil ou criminalmente pela doação de alimentos próprios para consumo, desde que observados os critérios de segurança sanitária.

## ❌ Problema

Muitas empresas e estabelecimentos comerciais têm excedentes de alimentos próprios para consumo, mas não realizam doações devido a:

- **Medo de responsabilização jurídica**: Incerteza sobre a conformidade legal das doações
- **Complexidade normativa**: Dificuldade em entender e aplicar os critérios da Lei 14.016/2020
- **Falta de conexão**: Dificuldade em encontrar ONGs que possam receber as doações
- **Validação sanitária**: Necessidade de garantir que os alimentos estão próprios para consumo
- **Rastreabilidade**: Ausência de documentação adequada das doações

## ✅ Solução

O **Doe Seguro** resolve esses problemas através de:

1. **Análise Inteligente com IA**: Utiliza OpenAI para analisar imagens de alimentos e determinar se estão próprios para doação conforme critérios legais
2. **Checklist Digital**: Sistema de validação que garante conformidade com a Lei 14.016/2020
3. **Certificados Digitais**: Geração automática de certificados PDF com QR Code e hash SHA-256 para rastreabilidade
4. **Matching Inteligente**: Conexão automática entre doadores e ONGs interessadas
5. **Dashboard Completo**: Interfaces dedicadas para doadores e ONGs gerenciarem suas doações
6. **Chat com IA**: Assistente virtual para tirar dúvidas sobre doações e legislação

## 🚀 Funcionalidades

### Para Doadores

- ✅ **Cadastro e Autenticação**: Sistema seguro de autenticação com Better Auth
- 📸 **Análise de Alimentos com IA**: Upload de imagens para análise automática de conformidade
- 📋 **Checklist de Validação**: Formulário digital que garante conformidade legal
- 📄 **Certificados Digitais**: Geração automática de certificados PDF com QR Code
- 📊 **Dashboard de Doações**: Acompanhamento do status de todas as doações
- 💬 **Chat com IA**: Assistente virtual para esclarecer dúvidas
- 🔔 **Notificações**: Acompanhamento de matches e status das doações

### Para ONGs

- ✅ **Cadastro e Autenticação**: Acesso seguro à plataforma
- 🔍 **Busca de Doações**: Visualização de doações disponíveis na região
- ✅ **Aceite de Doações**: Sistema de matching para aceitar doações
- 📊 **Dashboard de Doações**: Gerenciamento de doações aceitas e coletadas
- 📝 **Sugestões de Receitas**: Receitas sugeridas pela IA baseadas nos alimentos recebidos
- 🔔 **Notificações**: Alertas sobre novas doações disponíveis

### Funcionalidades Gerais

- 🔐 **Autenticação Segura**: Sistema completo de autenticação com Better Auth
- 💳 **Assinaturas**: Integração com Stripe para planos premium (futuro)
- 📧 **Notificações por Email**: Integração com Resend para envio de emails
- 🔒 **Segurança**: Rate limiting, CORS, validação de dados
- 📱 **Responsivo**: Interface adaptada para desktop e mobile
- 🌐 **API RESTful**: API completa documentada com OpenAPI/Swagger

## 🛠️ Tecnologias Utilizadas

### Backend

- **[Elysia.js](https://elysiajs.com/)** - Framework web rápido e type-safe
- **[Bun](https://bun.sh/)** - Runtime JavaScript/TypeScript de alta performance
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM type-safe para TypeScript
- **[Better Auth](https://www.better-auth.com/)** - Sistema de autenticação moderno
- **[OpenAI](https://openai.com/)** - API de IA para análise de imagens
- **[Stripe](https://stripe.com/)** - Processamento de pagamentos
- **[Resend](https://resend.com/)** - Serviço de envio de emails
- **[PDFKit](https://pdfkit.org/)** - Geração de PDFs
- **[QRCode](https://www.npmjs.com/package/qrcode)** - Geração de QR Codes

### Frontend

- **[Next.js 16](https://nextjs.org/)** - Framework React com App Router
- **[React 19](https://react.dev/)** - Biblioteca para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis e não estilizados
- **[Lucide React](https://lucide.dev/)** - Ícones modernos
- **[Sonner](https://sonner.emilkowal.ski/)** - Sistema de notificações toast
- **[Eden Treaty](https://elysiajs.com/plugins/eden/)** - Cliente type-safe para Elysia

### DevOps e Ferramentas

- **[Docker](https://www.docker.com/)** - Containerização
- **[Docker Compose](https://docs.docker.com/compose/)** - Orquestração de containers
- **[Turbo](https://turbo.build/)** - Build system para monorepos
- **[Biome](https://biomejs.dev/)** - Linter e formatter
- **[Vitest](https://vitest.dev/)** - Framework de testes
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Pino](https://getpino.io/)** - Logger estruturado

## 🏗️ Arquitetura

### Diagrama de Arquitetura

```mermaid
graph TB
    subgraph Client["Cliente (Browser)"]
        FE[Next.js Frontend]
    end
    
    subgraph Backend["Backend Services"]
        API[Elysia.js API]
        Auth[Better Auth]
        AIService[AI Service]
        CertService[Certificate Service]
        MatchService[Match Service]
        EmailService[Email Service]
    end
    
    subgraph Database["Database"]
        PG[(PostgreSQL)]
    end
    
    subgraph External["Serviços Externos"]
        OpenAI[OpenAI API]
        Stripe[Stripe API]
        Resend[Resend API]
    end
    
    subgraph Storage["Storage"]
        CertStorage[Certificados PDF]
    end
    
    FE -->|HTTP/REST| API
    FE -->|Auth| Auth
    API --> Auth
    API --> AIService
    API --> CertService
    API --> MatchService
    API --> EmailService
    API --> PG
    AIService --> OpenAI
    API --> Stripe
    EmailService --> Resend
    CertService --> CertStorage
```

### Fluxo de Doação

```mermaid
sequenceDiagram
    participant D as Doador
    participant FE as Frontend
    participant API as Backend API
    participant AI as OpenAI
    participant DB as Database
    participant ONG as ONG
    
    D->>FE: Upload imagem do alimento
    FE->>API: POST /api/donations/analyze
    API->>AI: Analisar imagem
    AI-->>API: Resultado da análise
    API-->>FE: Análise retornada
    FE-->>D: Exibir resultado
    
    D->>FE: Preencher checklist
    FE->>API: POST /api/donations
    API->>DB: Salvar doação
    API->>DB: Salvar análise
    API-->>FE: Doação criada
    
    API->>DB: Atualizar status para "available"
    
    ONG->>FE: Visualizar doações disponíveis
    FE->>API: GET /api/donations/available
    API->>DB: Buscar doações
    API-->>FE: Lista de doações
    FE-->>ONG: Exibir doações
    
    ONG->>FE: Aceitar doação
    FE->>API: POST /api/donations/:id/accept
    API->>DB: Criar match
    API->>DB: Atualizar status
    API->>CertService: Gerar certificado
    CertService-->>API: Certificado gerado
    API-->>FE: Match criado
    FE-->>ONG: Confirmação
```

### Estrutura de Dados

```mermaid
erDiagram
    USER ||--o{ DONATION : "cria"
    USER ||--o{ DONATION_MATCH : "participa"
    DONATION ||--o| DONATION_ANALYSIS : "tem"
    DONATION ||--o| CHECKLIST_RESPONSE : "tem"
    DONATION ||--o| CERTIFICATE : "gera"
    DONATION ||--o{ DONATION_MATCH : "gera"
    DONATION_MATCH ||--o| RECIPE_SUGGESTION : "tem"
    USER ||--o| SESSION : "tem"
    USER ||--o| ACCOUNT : "tem"
    USER ||--o| SUBSCRIPTION : "tem"
    
    USER {
        string id PK
        string name
        string email
        string role
        timestamp created_at
    }
    
    DONATION {
        string id PK
        string doador_id FK
        string status
        string tipo_alimento
        text descricao
        timestamp created_at
    }
    
    DONATION_ANALYSIS {
        string id PK
        string donation_id FK
        jsonb ai_response
        timestamp created_at
    }
    
    DONATION_MATCH {
        string id PK
        string donation_id FK
        string ong_id FK
        string status
        timestamp accepted_at
    }
    
    CERTIFICATE {
        string id PK
        string donation_id FK
        string certificate_number
        string pdf_url
        string qr_code
        string hash_sha256
    }
```

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **[Bun](https://bun.sh/)** (versão 1.0 ou superior)
- **[Docker](https://www.docker.com/)** e **Docker Compose**
- **[Node.js](https://nodejs.org/)** (versão 18 ou superior) - opcional, apenas para compatibilidade
- **[Git](https://git-scm.com/)**

### Variáveis de Ambiente

O projeto requer as seguintes variáveis de ambiente:

#### Backend (`.env` em `apps/backend/`)

```env
# Ambiente
NODE_ENV=development
PORT=3002

# Banco de Dados
DATABASE_URL=postgres://postgres:postgres@localhost:5432/fomezero_test

# Autenticação
BETTER_AUTH_SECRET=seu-secret-aqui
BETTER_AUTH_URL=http://localhost:3002
FRONTEND_URL=http://localhost:3000

# OpenAI (para análise de imagens)
OPENAI_API_KEY=sua-chave-openai
OPENAI_ASSISTANT_ID=asst_vyRpt1RqBGGCZUN31bQXVCak

# Stripe (opcional, para assinaturas)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...

# Resend (opcional, para emails)
RESEND_API_KEY=re_...

# Certificados
CERTIFICATE_STORAGE_PATH=./certificates
```

#### Frontend (`.env.local` em `apps/frontend/`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
NODE_ENV=development
```

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/fome-zero.git
cd fome-zero
```

### 2. Instale as dependências

```bash
bun install
```

### 3. Configure as variáveis de ambiente

Copie os arquivos de exemplo e configure as variáveis:

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env
# Edite apps/backend/.env com suas configurações

# Frontend
cp apps/frontend/.env.example apps/frontend/.env.local
# Edite apps/frontend/.env.local com suas configurações
```

### 4. Inicie o banco de dados

```bash
# Inicia o PostgreSQL via Docker
npm run db:start

# Ou usando docker-compose diretamente
docker-compose up -d postgres
```

### 5. Execute as migrações

```bash
# Gera as migrações (se necessário)
npm run db:generate

# Executa as migrações
npm run db:migrate
```

### 6. Inicie os serviços

#### Desenvolvimento (recomendado)

```bash
# Inicia backend e frontend simultaneamente
npm run dev
```

Isso iniciará:
- **Backend**: `http://localhost:3002`
- **Frontend**: `http://localhost:3000`

#### Ou inicie separadamente

```bash
# Terminal 1 - Backend
cd apps/backend
bun run dev

# Terminal 2 - Frontend
cd apps/frontend
bun run dev
```

### 7. Acesse a aplicação

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3002
- **Documentação da API**: http://localhost:3002/docs (Swagger/OpenAPI)
- **Drizzle Studio** (para visualizar o banco): `cd apps/backend && bun run db:studio`

## 📁 Estrutura do Projeto

```
fome-zero/
├── apps/
│   ├── backend/                 # API Backend (Elysia.js + Bun)
│   │   ├── src/
│   │   │   ├── auth.ts         # Configuração Better Auth
│   │   │   ├── index.ts        # Entry point do servidor
│   │   │   ├── config/         # Configurações
│   │   │   ├── db/             # Database (Drizzle ORM)
│   │   │   │   ├── schema.ts   # Schema do banco
│   │   │   │   └── migrations/ # Migrações
│   │   │   ├── plugins/        # Plugins Elysia
│   │   │   ├── repositories/   # Camada de acesso a dados
│   │   │   ├── routes/         # Rotas da API
│   │   │   ├── services/       # Lógica de negócio
│   │   │   └── utils/          # Utilitários
│   │   ├── certificates/       # Certificados PDF gerados
│   │   └── package.json
│   │
│   └── frontend/                # Frontend (Next.js 16)
│       ├── app/                 # App Router (Next.js)
│       │   ├── dashboard/      # Dashboards (doador/ong)
│       │   ├── login/          # Páginas de login
│       │   ├── signup/         # Páginas de cadastro
│       │   └── page.tsx        # Landing page
│       ├── components/          # Componentes React
│       │   ├── chat/           # Componentes de chat
│       │   ├── dashboard/      # Componentes do dashboard
│       │   ├── donations/      # Componentes de doações
│       │   ├── landing/        # Componentes da landing page
│       │   └── ui/             # Componentes UI (Radix)
│       ├── lib/                # Bibliotecas e utilitários
│       │   ├── api/            # Clientes API
│       │   └── hooks/          # React Hooks customizados
│       └── package.json
│
├── scripts/                     # Scripts utilitários
│   └── start-db.sh            # Script para iniciar DB
│
├── docker-compose.yml          # Configuração Docker
├── turbo.json                  # Configuração Turbo
├── package.json                # Workspace root
└── README.md                   # Este arquivo
```

### Monorepo

O projeto utiliza um **monorepo** gerenciado com:
- **npm workspaces** para gerenciamento de pacotes
- **Turbo** para build e execução otimizada
- **Docker Compose** para orquestração de serviços

## 📚 Documentação da API

A API está documentada usando **OpenAPI/Swagger**. Quando o backend estiver rodando, acesse:

**http://localhost:3002/docs**

### Principais Endpoints

#### Autenticação
- `POST /api/auth/sign-up` - Cadastro de usuário
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Obter sessão atual

#### Doações
- `POST /api/donations/analyze` - Analisar imagem de alimento (IA)
- `POST /api/donations` - Criar nova doação
- `GET /api/donations` - Listar doações do usuário
- `GET /api/donations/available` - Listar doações disponíveis (ONGs)
- `GET /api/donations/:id` - Obter detalhes de uma doação
- `PUT /api/donations/:id` - Atualizar doação
- `POST /api/donations/:id/checklist` - Submeter checklist
- `POST /api/donations/:id/accept` - Aceitar doação (ONG)
- `POST /api/donations/:id/collect` - Confirmar coleta
- `GET /api/donations/:id/certificate` - Obter certificado PDF

#### Chat
- `POST /api/chat` - Enviar mensagem para o assistente IA

#### Usuário
- `GET /api/user` - Obter perfil do usuário
- `PUT /api/user` - Atualizar perfil

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Padrões de Código

- Utilize **TypeScript** para type safety
- Siga os padrões do **Biome** (linter configurado)
- Escreva **testes** para novas funcionalidades
- Mantenha a **documentação** atualizada
- Siga os **convenções de commit** (Conventional Commits)

### Executando Testes

```bash
# Todos os testes
npm run test

# Apenas backend
npm run test:backend

# Frontend com watch
cd apps/frontend && bun run test:watch
```

### Linting e Formatação

```bash
# Verificar código
npm run lint:biome

# Formatar código
npm run format
```

## 📄 Licença

Este projeto está licenciado sob a **ISC License**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

**Equipe 17 - Devs de Impacto 2025**

- **Fabricio Cavalcante**
- **Gabriel Maia**
- **Pedro Henrique**
- **Iggor Ferreira**

---

## 🔗 Links Úteis

- [Devs de Impacto 2025](https://devsdeimpacto.imasters.com.br/)
- [Lei 14.016/2020](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l14016.htm)
- [Documentação Elysia.js](https://elysiajs.com/)
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Better Auth](https://www.better-auth.com/docs)

---

<div align="center">

**Desenvolvido com ❤️ para o Devs de Impacto 2025**

[⬆ Voltar ao topo](#-fome-zero---doe-seguro)

</div>
