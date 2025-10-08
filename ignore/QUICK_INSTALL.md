# ⚡ Guia Rápido de Instalação - Totem Barbalho

## 🎯 Para Usuários Finais (Eventos/Feiras)

### ✅ Pré-requisitos OBRIGATÓRIOS:
- **Windows 10 ou superior** (64-bit)
- **500 MB de espaço livre** em disco
- **Conexão com internet** (para gerar receitas)
- ⚠️ **Node.js 18+ INSTALADO** (obrigatório!)
  - **Download**: https://nodejs.org/ (versão LTS)
  - **Instruções completas**: Ver arquivo `INSTALACAO_NODEJS_OBRIGATORIO.md`

### Passo 1️⃣: Receber o Instalador
Você receberá um arquivo chamado:
- `totem-barbalho-setup-1.0.0.exe` (240 MB)

### Passo 2️⃣: Instalar
1. Dê **duplo clique** no arquivo `.exe`
2. Clique em **"Instalar"**
3. Aguarde 1-2 minutos
4. Pronto! ✅

### Passo 3️⃣: Configurar API (IMPORTANTE!)

#### 🔑 Obter a Chave da API:
1. Acesse: https://makersuite.google.com/app/apikey
2. Clique em **"Create API Key"**
3. Copie a chave (exemplo: `AIzaSyBcj0...`)

#### 📝 Adicionar a Chave:
1. Vá para: `C:\Users\[SeuUsuario]\AppData\Local\Programs\totem-barbalho\resources\app\backend\`
2. Abra o arquivo `.env` com Bloco de Notas
3. Cole a linha:
   ```
   GEMINI_API_KEY=SuaChaveAqui
   ```
4. Salve o arquivo (Ctrl+S)

### Passo 4️⃣: Executar
1. Clique no atalho **"Totem Barbalho"** na área de trabalho
2. Ou execute: `C:\Users\[SeuUsuario]\AppData\Local\Programs\totem-barbalho\totem-barbalho.exe`

### ✅ Pronto para Usar!
- A aplicação abrirá em **tela cheia**
- Você verá a **splash screen** da Barbalho
- Após 3 segundos, aparecerá o formulário

---

## 🛠️ Para Desenvolvedores

### Requisitos:
- Windows 10+
- Node.js 18+

### Instalação:

```powershell
# 1. Clone/extraia o projeto
cd C:\projetos\totem-barbalho

# 2. Instale todas as dependências
npm install                # Raiz
cd backend && npm install  # Backend
cd ../frontend && npm install  # Frontend
cd ..

# 3. Configure o .env
# Crie backend/.env com:
GEMINI_API_KEY=sua_chave_aqui

# 4. Execute
npm start
```

### Gerar Instalador:

```powershell
# 1. Build frontend
cd frontend
npm run build

# 2. Gerar instalador
cd ..
npm run dist:win

# 3. Resultado em:
# dist/totem-barbalho-setup-1.0.0.exe
```

---

## 🔍 Verificação Rápida

### ✅ Funciona se:
- [ ] Aplicação abre em tela cheia
- [ ] Splash screen aparece
- [ ] Formulário funciona
- [ ] Receita é gerada
- [ ] QR Code aparece
- [ ] Celular abre a página ao escanear

### ❌ Problemas Comuns:

**1. "API Key não encontrada"**
→ Configure o arquivo `backend/.env`

**2. "Porta 3000 em uso"**
→ Execute no PowerShell:
```powershell
Get-Process -Name node | Stop-Process -Force
```

**3. QR Code não abre**
→ Verifique se celular está na mesma rede Wi-Fi

---

## 📦 O que está Incluído?

### ✅ SIM (já vem no instalador):
- Electron + Node.js embutido
- Frontend (React)
- Backend (Express)
- Todas as bibliotecas
- Imagens, vídeos, produtos
- Receitas offline (fallback)

### ❌ NÃO (você precisa adicionar):
- API Key do Gemini (`GEMINI_API_KEY`)
- Conexão com internet (para IA)

---

## 🚀 Início Rápido (3 minutos)

1. **Instale** o `.exe`
2. **Configure** a API Key no `.env`
3. **Execute** o atalho
4. **Teste** gerando uma receita
5. **Escaneie** o QR Code com celular

🎉 **Sistema funcionando!**

---

## 📞 Ajuda

- Documentação completa: `INSTALACAO_COMPLETA.md`
- Guia de design: `docs/TOTEM_DESIGN_SYSTEM.md`
- Suporte: Equipe TI Barbalho Alimentos
