# 🚀 Totem Barbalho IA Culinária - Backend Services

## 📋 Visão Geral

Sistema backend completo para o Totem Barbalho com serviços integrados de:
- **🤖 Geração de Receitas IA** (Google Gemini)
- **📧 Envio de Email** (SMTP com Nodemailer)
- **📱 Envio via WhatsApp** (WhatsApp Business API)
- **📄 Geração de PDF** (HTML personalizado)

## ✅ Status dos Serviços

### Implementados e Funcionando:
- ✅ **PDF Service** - Geração de PDFs personalizados com branding Barbalho
- ✅ **Email Service** - Envio de receitas por email com templates HTML
- ✅ **WhatsApp Service** - Envio de receitas via WhatsApp Business API
- ✅ **Recipe Generation** - IA Gemini para criação de receitas
- ✅ **API Endpoints** - Todas as rotas necessárias implementadas

## 🔧 Configuração

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure as variáveis no arquivo .env
```

### 3. Configurações Necessárias

#### 🤖 Google Gemini AI (OBRIGATÓRIO)
```env
GEMINI_API_KEY=AIzaSyA3TW_hG5btEfXuw1pZucbRQGA94qo3-iU
```
**Como obter:**
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova chave API
3. Cole em `GEMINI_API_KEY`

#### 📧 Configuração de Email (OPCIONAL)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app_do_gmail
EMAIL_FROM=naoresponder@barbalho.com.br
```

**Para Gmail:**
1. Ative autenticação de 2 fatores
2. Gere uma "Senha de App" específica
3. Use essa senha em `EMAIL_PASS`

**Outros provedores:**
- **Outlook:** `smtp-mail.outlook.com:587`
- **Yahoo:** `smtp.mail.yahoo.com:587`

#### 📱 WhatsApp Business API (OPCIONAL)
```env
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id_aqui
WHATSAPP_ACCESS_TOKEN=seu_access_token_do_whatsapp_aqui
```

**Como configurar:**
1. Crie conta [Meta Business](https://business.facebook.com/)
2. Configure WhatsApp Business API
3. Obtenha Phone Number ID e Access Token

## 🚀 Como Executar

### Desenvolvimento
```bash
npm start
# ou
npm run dev
```

### Teste dos Serviços
```bash
node test-services.js
```

### Verificar Status
```bash
curl http://localhost:3000/service-status
```

## 📡 API Endpoints

### 🔮 Geração de Receitas
```http
POST /generate-recipe
Content-Type: application/json

{
  "userData": { "name": "João", "email": "joao@email.com", "phone": "+5511999999999" },
  "selectedProducts": [{ "name": "Arroz Agulhinha Barbalho" }],
  "additionalIngredients": ["cebola", "alho"],
  "preferences": { "difficulty": "Fácil", "time": "30 minutos", "portions": "4 pessoas" }
}
```

### 📧 Envio por Email
```http
POST /send-recipe-email
Content-Type: application/json

{
  "recipe": { /* dados da receita */ },
  "userData": { "name": "João", "email": "joao@email.com" }
}
```

### 📱 Envio via WhatsApp
```http
POST /send-recipe-whatsapp
Content-Type: application/json

{
  "recipe": { /* dados da receita */ },
  "userData": { "name": "João", "phone": "+5511999999999" }
}
```

### 📄 Geração de PDF
```http
POST /generate-recipe-pdf
Content-Type: application/json

{
  "recipe": { /* dados da receita */ },
  "userData": { "name": "João", "email": "joao@email.com" }
}
```

### 📊 Status dos Serviços
```http
GET /service-status
```

### 🧪 Teste de Email
```http
POST /test-email
Content-Type: application/json

{
  "email": "teste@exemplo.com"
}
```

## 🎨 Features dos Serviços

### 📄 PDF Service
- ✨ Design personalizado com branding Barbalho
- 🎨 Cores corporativas e fonts personalizadas
- 👤 Personalização com nome do usuário
- 📱 Responsivo e otimizado para impressão
- 🖨️ Impressão automática na janela

### 📧 Email Service
- 📩 Templates HTML profissionais
- 🎨 Design responsivo e moderno
- 📱 Compatível com todos os clientes de email
- 👤 Personalização completa
- 🔒 Suporte SMTP seguro

### 📱 WhatsApp Service
- 🚀 WhatsApp Business API oficial
- 📞 Formatação automática de números brasileiros
- ✅ Validação de números
- 📝 Mensagens formatadas com emojis
- 🔄 Status de entrega

## 🐛 Solução de Problemas

### Email não está enviando
1. Verifique se `EMAIL_USER` e `EMAIL_PASS` estão configurados
2. Para Gmail, use "Senha de App", não a senha normal
3. Teste a conexão: `POST /test-email`

### WhatsApp não está funcionando
1. Verifique se `WHATSAPP_ACCESS_TOKEN` está correto
2. Confirme se `WHATSAPP_PHONE_NUMBER_ID` está configurado
3. Certifique-se que a conta Meta Business está ativa

### IA não está gerando receitas
1. Verifique se `GEMINI_API_KEY` está correto
2. Confirme se há créditos na conta Google AI
3. Verifique se a API está ativa

## 📝 Logs

Os serviços geram logs detalhados:
- ✅ `[EMAIL SERVICE]` - Logs de email
- 📱 `[WHATSAPP SERVICE]` - Logs de WhatsApp  
- 📄 `[PDF SERVICE]` - Logs de PDF
- 🔌 `[API]` - Logs das rotas

## 🔐 Segurança

- 🛡️ Helmet.js para segurança HTTP
- 🌐 CORS configurado para frontend
- 🔒 Validação de dados de entrada
- 🚫 Rate limiting (recomendado para produção)

## 📦 Dependências

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5", 
  "helmet": "^7.1.0",
  "morgan": "^1.10.0",
  "@google/generative-ai": "^0.2.1",
  "nodemailer": "^6.9.7",
  "dotenv": "^16.3.1"
}
```

## 🚀 Deploy

### Desenvolvimento
```bash
npm start
```

### Produção
1. Configure `NODE_ENV=production`
2. Use PM2 ou similar para gerenciamento de processos
3. Configure proxy reverso (Nginx)
4. Configure SSL/HTTPS
5. Configure backup das variáveis de ambiente

## 📞 Suporte

Para dúvidas ou problemas:
1. Execute `node test-services.js` para diagnóstico
2. Verifique os logs no console
3. Confirme as configurações no `.env`
4. Teste os endpoints individualmente

---

**🏢 Barbalho Alimentos - IA Culinária**  
*Qualidade que alimenta gerações* 🌟