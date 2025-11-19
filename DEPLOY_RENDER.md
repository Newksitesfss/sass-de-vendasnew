# Guia de Deploy no Render

Este guia explica como fazer o deploy do SaaS de Vendas no Render.

## Opção 1: Deploy Automático (Recomendado)

### Pré-requisitos
- Conta no Render (render.com)
- Repositório GitHub público

### Passos

1. **Acesse o Render Dashboard**
   - Vá para https://dashboard.render.com
   - Faça login com sua conta GitHub

2. **Crie um novo serviço**
   - Clique em "New +" → "Web Service"
   - Selecione "Build and deploy from a Git repository"
   - Conecte seu repositório `Newksitesfss/sass-de-vendasnew`

3. **Configure o serviço**
   - **Name**: `sass-de-vendas`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm build && pnpm db:push`
   - **Start Command**: `pnpm start`
   - **Plan**: Free (ou escolha um plano pago)

4. **Adicione variáveis de ambiente**
   - Clique em "Environment"
   - Adicione as seguintes variáveis:

   ```
   NODE_ENV=production
   VITE_APP_TITLE=SaaS Vendas
   VITE_APP_LOGO=https://placehold.co/128x128/2563EB/FFFFFF?text=SV
   VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
   VITE_APP_ID=your_app_id
   VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
   VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
   BUILT_IN_FORGE_API_URL=https://api.manus.im
   BUILT_IN_FORGE_API_KEY=your_backend_key
   JWT_SECRET=your_jwt_secret
   OWNER_OPEN_ID=your_owner_open_id
   OWNER_NAME=Vitor Guilherme
   ```

5. **Configure o banco de dados**
   - Clique em "Database" → "Create Database"
   - Selecione "MySQL"
   - Nome: `sass-de-vendas-db`
   - Copie a `DATABASE_URL` gerada
   - Adicione como variável de ambiente

6. **Faça o deploy**
   - Clique em "Create Web Service"
   - Aguarde o build completar (pode levar alguns minutos)
   - Sua aplicação estará disponível em uma URL como `https://sass-de-vendas.onrender.com`

## Opção 2: Deploy Manual via CLI

### Pré-requisitos
- Render CLI instalada
- Conta no Render

### Passos

1. **Instale o Render CLI**
   ```bash
   npm install -g render-cli
   ```

2. **Faça login no Render**
   ```bash
   render login
   ```

3. **Deploy a aplicação**
   ```bash
   render deploy
   ```

## Configuração do Banco de Dados

### Criar banco de dados no Render

1. Acesse https://dashboard.render.com
2. Clique em "Database" → "Create"
3. Selecione "MySQL"
4. Configure:
   - **Name**: `sass-de-vendas-db`
   - **Region**: Escolha a mais próxima
   - **MySQL Version**: 8.0
5. Copie a `DATABASE_URL` e adicione como variável de ambiente

### Alternativa: Usar banco de dados externo

Se preferir usar um banco MySQL externo:

1. Configure sua variável `DATABASE_URL` apontando para seu banco
2. Certifique-se de que o banco está acessível da internet
3. Execute as migrações:
   ```bash
   pnpm db:push
   ```

## Verificar o Deploy

Após o deploy ser concluído:

1. Acesse a URL da sua aplicação (ex: `https://sass-de-vendas.onrender.com`)
2. Você deve ver a landing page com os planos
3. Teste o fluxo completo:
   - Clique em "Começar Teste Grátis"
   - Faça login com Google
   - Selecione um plano
   - Verifique o dashboard

## Troubleshooting

### Erro: "Build failed"
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique se o `DATABASE_URL` está correto
- Verifique os logs do build

### Erro: "Database connection failed"
- Certifique-se de que o banco de dados foi criado
- Verifique se a `DATABASE_URL` está correta
- Verifique se o banco está acessível

### Erro: "Application not starting"
- Verifique os logs da aplicação
- Certifique-se de que o `Start Command` está correto
- Verifique se todas as dependências foram instaladas

## Monitoramento

### Verificar logs
1. Acesse o dashboard do Render
2. Clique no seu serviço
3. Clique em "Logs"

### Configurar alertas
1. Acesse "Settings" → "Notifications"
2. Configure alertas para falhas de deploy

## Próximos Passos

1. **Configurar domínio customizado** (opcional)
   - Acesse "Settings" → "Custom Domain"
   - Adicione seu domínio

2. **Configurar auto-deploy**
   - O deploy automático já está configurado
   - Cada push para `main` fará um novo deploy

3. **Monitorar assinaturas**
   - Configure um cron job para executar `node server/check-subscriptions.mjs`
   - Isso garante que as assinaturas expirem corretamente

## Suporte

Para dúvidas sobre o Render, visite: https://render.com/docs

---

**Desenvolvido por Cria Tech**
