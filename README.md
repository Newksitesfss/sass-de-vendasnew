# SaaS de Vendas

Um SaaS completo para gerenciar vendas com planos de assinatura, teste grátis de 5 dias, autenticação com Google e dashboard em tempo real.

**Desenvolvido por Cria Tech**

## Características

- ✅ **Autenticação com Google OAuth**
- ✅ **Sistema de Assinaturas com 3 Planos**
  - Starter: R$ 45/mês ou R$ 320/ano
  - Professional: R$ 99/mês ou R$ 712,80/ano
  - Enterprise: R$ 299/mês ou R$ 2.152,80/ano
- ✅ **Teste Grátis de 5 Dias**
- ✅ **Cancelamento Automático Após Período de Teste**
- ✅ **Dashboard do Usuário**
- ✅ **Landing Page com Apresentação dos Planos**
- ✅ **Checkout Intuitivo**

## Stack Tecnológico

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Backend**: Express + tRPC + TypeScript
- **Banco de Dados**: MySQL + Drizzle ORM
- **Autenticação**: OAuth (Google)
- **UI Components**: Radix UI + Lucide Icons

## Instalação Local

### Pré-requisitos

- Node.js 18+
- pnpm
- MySQL 8.0+

### Setup

1. **Clone o repositório**
```bash
git clone https://github.com/Newksitesfss/sass-de-vendasnew.git
cd sass-de-vendasnew
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
# Edite .env.local com suas configurações
```

4. **Configure o banco de dados**
```bash
pnpm db:push
```

5. **Seed dos planos padrão**
```bash
node server/seed-plans.mjs
```

6. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`

## Estrutura do Projeto

```
├── client/                 # Frontend React
│   └── src/
│       ├── pages/         # Páginas (Landing, Dashboard, Checkout, etc)
│       ├── components/    # Componentes reutilizáveis
│       ├── lib/           # Utilitários e configuração tRPC
│       └── const.ts       # Constantes da aplicação
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Definição de rotas tRPC
│   ├── subscriptions.ts   # Lógica de assinaturas
│   ├── db.ts              # Funções de banco de dados
│   └── _core/             # Configuração core
├── drizzle/               # Schema e migrações do banco
└── shared/                # Código compartilhado
```

## Fluxo de Uso

### 1. Landing Page
- Usuário acessa a página inicial
- Visualiza os 3 planos disponíveis
- Clica em "Começar Teste Grátis"

### 2. Login
- Se não autenticado, redireciona para login com Google
- Após autenticação, redireciona para checkout

### 3. Checkout
- Usuário seleciona o ciclo de faturamento (mensal/anual)
- Confirma e inicia o teste grátis de 5 dias
- Recebe acesso ao dashboard

### 4. Dashboard
- Visualiza seu plano atual
- Vê o status da assinatura (Teste, Ativo, Cancelado)
- Pode fazer upgrade ou cancelar a assinatura

### 5. Cancelamento Automático
- Após 5 dias, a assinatura é automaticamente expirada
- Usuário pode fazer upgrade para continuar usando

## Banco de Dados

### Tabelas

#### `users`
- Armazena informações dos usuários
- Campos: id, openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn

#### `plans`
- Armazena os planos de assinatura disponíveis
- Campos: id, name, description, priceMonthly, priceAnnual, features, createdAt, updatedAt

#### `subscriptions`
- Armazena as assinaturas dos usuários
- Campos: id, userId, planId, status, billingCycle, trialStartDate, trialEndDate, startDate, endDate, cancelledAt, createdAt, updatedAt

## API tRPC

### Endpoints de Assinatura

#### `subscription.listPlans`
Lista todos os planos disponíveis.

```typescript
const plans = await trpc.subscription.listPlans.query();
```

#### `subscription.getCurrent`
Obtém a assinatura atual do usuário (requer autenticação).

```typescript
const subscription = await trpc.subscription.getCurrent.query();
```

#### `subscription.startTrial`
Inicia um teste grátis de 5 dias (requer autenticação).

```typescript
await trpc.subscription.startTrial.mutate({ planId: 1 });
```

#### `subscription.upgradeToPaid`
Faz upgrade de uma assinatura de teste para paga (requer autenticação).

```typescript
await trpc.subscription.upgradeToPaid.mutate({ billingCycle: "monthly" });
```

#### `subscription.cancel`
Cancela a assinatura ativa do usuário (requer autenticação).

```typescript
await trpc.subscription.cancel.mutate();
```

## Deploy no Render

### Pré-requisitos

- Conta no Render (render.com)
- Banco de dados MySQL (pode ser no Render ou externo)
- Variáveis de ambiente configuradas

### Passos

1. **Conecte seu repositório GitHub ao Render**
   - Vá para render.com
   - Clique em "New +" → "Web Service"
   - Selecione seu repositório

2. **Configure as variáveis de ambiente**
   - Adicione todas as variáveis do `.env.example`
   - Certifique-se de que `DATABASE_URL` aponta para seu banco MySQL

3. **Configure o build e start**
   - Build Command: `pnpm install && pnpm build && pnpm db:push`
   - Start Command: `pnpm start`

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar

## Monitoramento de Assinaturas

Para verificar e expirar assinaturas automaticamente, execute:

```bash
node server/check-subscriptions.mjs
```

Você pode configurar isso como um cron job no Render ou em outro serviço de agendamento.

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão MySQL | `mysql://user:pass@host/db` |
| `VITE_APP_TITLE` | Título da aplicação | `SaaS Vendas` |
| `VITE_APP_ID` | ID da aplicação OAuth | `your_app_id` |
| `JWT_SECRET` | Secret para JWT | `your_secret` |
| `OWNER_OPEN_ID` | OpenID do proprietário | `owner_id` |
| `OWNER_NAME` | Nome do proprietário | `Seu Nome` |

## Troubleshooting

### Erro: "Database not available"
- Verifique se `DATABASE_URL` está configurada corretamente
- Certifique-se de que o banco de dados está acessível

### Erro: "User already has an active subscription"
- O usuário já tem uma assinatura ativa
- Ele precisa cancelar a anterior antes de começar um novo teste

### Assinaturas não estão expirando
- Execute `node server/check-subscriptions.mjs` manualmente
- Configure um cron job para executar periodicamente

## Suporte

Para dúvidas ou problemas, entre em contato com:
- **Email**: vitorguilherme1@gmail.com
- **Desenvolvido por**: Cria Tech

## Licença

MIT

---

**Desenvolvido com ❤️ por Cria Tech**
