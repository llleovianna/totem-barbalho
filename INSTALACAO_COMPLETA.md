# 🚀 Instalação Completa - Totem Barbalho Alimentos

## 📋 Visão Geral

Este documento fornece instruções **completas e detalhadas** para instalar o **Totem Interativo IA Culinária Barbalho** em qualquer computador Windows, seja para desenvolvimento ou produção.

---

## 📦 O que é o Sistema?

O **Totem Barbalho** é um aplicativo desktop (Electron) que funciona como um totem interativo para feiras e eventos. Ele gera receitas personalizadas usando IA (Google Gemini) com produtos Barbalho, permite imprimir via QR Code em dispositivos móveis, e funciona offline com sistema de fallback.

### Arquitetura:
- **Frontend**: React 19 (porta 3001)
- **Backend**: Node.js + Express (porta 3000)
- **Desktop**: Electron (empacota tudo)
- **IA**: Google Gemini API

---

## 🎯 Dois Cenários de Instalação

### 1. Instalação para PRODUÇÃO (Usuário Final)
   - ✅ Instalador `.exe` pronto
   - ✅ Sem necessidade de Node.js
   - ✅ Clique duplo e funciona
   - ✅ **Recomendado para eventos e feiras**

### 2. Instalação para DESENVOLVIMENTO (Programador)
   - 🔧 Código-fonte completo
   - 🔧 Requer Node.js instalado
   - 🔧 Permite modificações
   - 🔧 **Recomendado para manutenção**

---

## 🏭 PARTE 1: INSTALAÇÃO PARA PRODUÇÃO

### 📥 Pré-requisitos
- **Windows 10 ou superior** (64-bit)
- **500 MB de espaço livre** em disco
- **Conexão com internet** (para usar IA Gemini)
- ❌ **NÃO** precisa instalar Node.js (já vem embutido no instalador!)
- ❌ **NÃO** precisa instalar npm ou outras dependências
- ❌ **NÃO** precisa conhecimento técnico

### 📦 Passo 1: Gerar o Instalador (Máquina de Desenvolvimento)

No computador do desenvolvedor, execute:

```powershell
# 1. Navegue até a pasta do projeto
cd C:\Users\leovi\Desktop\totem

# 2. Pare processos Node.js existentes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# 3. Gere o build de produção do frontend
cd frontend
npm run build

# 4. Volte para a raiz e gere o instalador Electron
cd ..
npm run dist:win
```

**Resultado**: Será criado um instalador em `dist/`:
- `dist/totem-barbalho-setup-1.0.0.exe` (Instalador completo ~240 MB)
- `dist/win-unpacked/` (Versão portável)

### 📤 Passo 2: Transferir para o Computador do Cliente

**Opção A - Instalador (Recomendado)**:
1. Copie `totem-barbalho-setup-1.0.0.exe` para um pen drive
2. Ou envie via Google Drive / WeTransfer
3. Tamanho: ~240 MB

**Opção B - Versão Portável**:
1. Compacte toda a pasta `dist/win-unpacked/` em um `.zip`
2. Tamanho: ~230 MB compactado

### 💾 Passo 3: Instalação no Computador do Cliente

#### **Opção A: Usando o Instalador**

1. **Execute o instalador**:
   ```
   totem-barbalho-setup-1.0.0.exe
   ```

2. **Siga os passos**:
   - Aceite os termos
   - Escolha o local de instalação (padrão: `C:\Users\[Usuario]\AppData\Local\Programs\totem-barbalho`)
   - Clique em "Instalar"

3. **Configurar a API Key do Gemini** (IMPORTANTE):
   - Após instalar, navegue até a pasta de instalação
   - Abra `resources\app\backend\.env`
   - Adicione a chave da API:
     ```
     GEMINI_API_KEY=SuaChaveAquiDoGemini
     ```
   - Salve o arquivo

4. **Execute o Totem**:
   - Clique no atalho "Totem Barbalho" na área de trabalho
   - Ou execute `totem-barbalho.exe` na pasta de instalação

#### **Opção B: Usando a Versão Portável**

1. **Extraia o ZIP**:
   - Extraia `win-unpacked.zip` para qualquer pasta
   - Exemplo: `C:\TotemBarbalho\`

2. **Configurar a API Key**:
   - Navegue até `C:\TotemBarbalho\resources\app\backend\`
   - Crie ou edite o arquivo `.env`:
     ```
     GEMINI_API_KEY=SuaChaveAquiDoGemini
     ```

3. **Execute o Totem**:
   - Dê duplo clique em `totem-barbalho.exe`

### ✅ Verificação da Instalação

1. O aplicativo deve abrir em tela cheia
2. Você verá a splash screen "Barbalho Alimentos"
3. Após 3 segundos, aparecerá o formulário de dados do usuário
4. Teste gerando uma receita

### 🔑 Obter a Chave da API Gemini

1. Acesse: https://makersuite.google.com/app/apikey
2. Clique em "Create API Key"
3. Copie a chave gerada
4. Cole no arquivo `.env`

---

## 🛠️ PARTE 2: INSTALAÇÃO PARA DESENVOLVIMENTO

### 📋 Pré-requisitos

1. **Node.js 18 ou superior**
   - Download: https://nodejs.org/
   - Verificar instalação: `node --version`

2. **Git** (opcional)
   - Download: https://git-scm.com/

3. **Editor de Código** (recomendado)
   - VS Code: https://code.visualstudio.com/

### 📥 Passo 1: Obter o Código-Fonte

**Opção A - Via Git**:
```powershell
git clone https://github.com/seu-repo/totem-barbalho.git
cd totem-barbalho
```

**Opção B - ZIP**:
1. Baixe o arquivo `totem-barbalho-source.zip`
2. Extraia para `C:\projetos\totem-barbalho\`
3. Abra o PowerShell na pasta

### 🔧 Passo 2: Instalar Dependências

```powershell
# 1. Instalar dependências da raiz (Electron, scripts)
npm install

# 2. Instalar dependências do backend
cd backend
npm install

# 3. Instalar dependências do frontend
cd ../frontend
npm install

# 4. Voltar para a raiz
cd ..
```

**Tempo estimado**: 3-5 minutos (depende da internet)

### 🔑 Passo 3: Configurar Variáveis de Ambiente

Crie o arquivo `backend/.env`:

```env
# API Key do Google Gemini (OBRIGATÓRIA)
GEMINI_API_KEY=sua_chave_aqui_do_gemini

# Porta do backend (opcional, padrão: 3000)
PORT=3000

# URL do frontend (opcional, detecta automaticamente)
FRONTEND_URL=http://localhost:3001
```

### 🚀 Passo 4: Executar em Modo Desenvolvimento

```powershell
# Inicia backend + frontend simultaneamente
npm start
```

Isso executará:
- **Backend** na porta `3000`
- **Frontend** na porta `3001`

**URLs de acesso**:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

### 📱 Passo 5: Testar QR Code Mobile

1. Gere uma receita no totem
2. Escaneie o QR Code com seu celular
3. O celular deve estar na **mesma rede Wi-Fi**
4. URL do QR Code: `http://[IP_DA_SUA_MAQUINA]:3000/mobile-recipe/[ID]`

### 🏗️ Passo 6: Gerar Build de Produção

```powershell
# Build do frontend (cria pasta build/)
cd frontend
npm run build

# Voltar para raiz
cd ..

# Gerar instalador Electron (Windows)
npm run dist:win
```

**Resultado**:
- `dist/totem-barbalho-setup-1.0.0.exe` (Instalador)
- `dist/win-unpacked/` (Portável)

---

## 📁 Estrutura de Pastas

```
totem-barbalho/
│
├── backend/                  # Servidor Node.js
│   ├── services/             # Serviços (PDF, etc)
│   ├── .env                  # Variáveis de ambiente (CRIAR!)
│   ├── server.js             # Servidor principal
│   ├── fallback-receitas.json # Receitas offline
│   └── package.json
│
├── frontend/                 # Aplicação React
│   ├── public/               # Arquivos estáticos
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── assets/           # Imagens, vídeos, produtos
│   │   └── App.tsx           # Componente principal
│   ├── build/                # Build de produção (gerado)
│   └── package.json
│
├── dist/                     # Instaladores Electron (gerado)
│   ├── totem-barbalho-setup-1.0.0.exe
│   └── win-unpacked/         # Versão portável
│
├── ssl/                      # Certificados SSL (dev)
├── docs/                     # Documentação
├── scripts/                  # Scripts de automação
├── electron-main.js          # Processo principal Electron
└── package.json              # Dependências raiz
```

---

## 🔍 Verificação de Instalação

### ✅ Checklist Completo

- [ ] Node.js instalado (`node --version` mostra 18+)
- [ ] Dependências instaladas (3 `npm install` concluídos)
- [ ] Arquivo `.env` criado com `GEMINI_API_KEY`
- [ ] Backend inicia sem erros (`npm start` ou `cd backend && npm start`)
- [ ] Frontend inicia sem erros (`cd frontend && npm start`)
- [ ] Aplicação abre no navegador em `http://localhost:3001`
- [ ] API responde em `http://localhost:3000/health`
- [ ] Splash screen aparece corretamente
- [ ] Formulário de dados do usuário funciona
- [ ] Geração de receita funciona (com ou sem internet)
- [ ] QR Code é exibido após gerar receita
- [ ] Página mobile abre corretamente ao escanear QR Code
- [ ] Impressão via mobile funciona

---

## ⚙️ Configurações Avançadas

### 🔧 Portas Customizadas

Edite `backend/.env`:
```env
PORT=8080  # Mudar porta do backend
```

Edite `package.json` (raiz):
```json
"start:frontend": "cd frontend && cross-env PORT=8081 BROWSER=none npm start"
```

### 🌐 IP de Rede

O sistema detecta automaticamente o IP da máquina. Para forçar um IP específico:

Edite `backend/server.js`:
```javascript
const NETWORK_IP = '192.168.1.100'; // Seu IP fixo
```

### 📦 Build Customizado

Edite `package.json` (raiz) na seção `build`:
```json
"build": {
  "appId": "com.barbalho.totem",
  "productName": "Totem Barbalho Custom",
  "directories": {
    "output": "dist-custom"
  }
}
```

---

## 🐛 Solução de Problemas

### ❌ Erro: "GEMINI_API_KEY não definida"

**Solução**: Crie/edite `backend/.env` com a chave válida do Gemini.

### ❌ Erro: "Port 3000 already in use"

**Solução**: Mate processos Node.js:
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### ❌ Erro: "Cannot find module..."

**Solução**: Reinstale dependências:
```powershell
rm -r node_modules backend/node_modules frontend/node_modules
npm run install:all
```

### ❌ QR Code não abre no celular

**Soluções**:
1. Verifique se celular está na mesma rede Wi-Fi
2. Desative firewall temporariamente
3. Verifique o IP correto com `ipconfig`

### ❌ Build do Electron falha

**Solução**: Limpe cache e rebuild:
```powershell
rm -r dist
npm run build
npm run dist:win
```

### ❌ Logo não aparece na impressão

**Solução**: O sistema usa logo externa. Verifique conexão com internet ou use fallback SVG (já implementado).

---

## 📊 Monitoramento e Logs

### Logs do Backend

```powershell
cd backend
npm start
# Logs aparecem no terminal
```

### Logs do Frontend

```powershell
cd frontend
npm start
# Logs aparecem no terminal + console do navegador (F12)
```

### Logs do Electron (Produção)

- Windows: `%APPDATA%\totem-barbalho\logs\`
- Ou execute via terminal para ver logs:
  ```powershell
  cd "C:\Users\[Usuario]\AppData\Local\Programs\totem-barbalho"
  .\totem-barbalho.exe
  ```

---

## 🔄 Atualização do Sistema

### Para Desenvolvimento:

```powershell
git pull origin main
npm run install:all
npm start
```

### Para Produção:

1. Gere novo instalador no ambiente dev
2. Desinstale versão antiga no cliente
3. Instale nova versão
4. Configure `.env` novamente (se necessário)

---

## 📞 Suporte e Contato

- **Desenvolvedor**: Barbalho Alimentos - Equipe TI
- **Versão**: 1.0.0
- **Data**: Outubro/2025
- **Tecnologias**: React 19, Node.js 18+, Electron 38, Google Gemini AI

---

## 📝 Notas Importantes

### ✅ O que está INCLUÍDO no instalador:
- ✅ Electron Runtime
- ✅ Node.js Runtime (embutido)
- ✅ Frontend (build React)
- ✅ Backend (servidor Express)
- ✅ Todas as dependências NPM
- ✅ Assets (imagens, vídeos, produtos)
- ✅ Receitas fallback (offline)

### ❌ O que NÃO está incluído (deve configurar):
- ❌ `GEMINI_API_KEY` (deve adicionar manualmente)
- ❌ Conexão com internet (para IA funcionar)
- ❌ Impressora (para impressão local)

### 🔒 Segurança:
- Certificados SSL auto-assinados (apenas dev)
- API Key deve ser protegida
- Não compartilhar `.env` publicamente

### 📱 Compatibilidade Mobile:
- ✅ Android
- ✅ iOS (Safari)
- ✅ Qualquer navegador moderno

---

## 🎓 Tutorial Rápido (5 minutos)

### Para Usuário Final:

1. **Instale**: Dê duplo clique em `totem-barbalho-setup-1.0.0.exe`
2. **Configure**: Edite `resources\app\backend\.env` com a API Key
3. **Execute**: Clique no atalho "Totem Barbalho"
4. **Use**: Preencha dados → Escolha produtos → Gere receita → Escaneie QR Code

### Para Desenvolvedor:

1. **Clone**: `git clone ...`
2. **Instale**: `npm run install:all`
3. **Configure**: Crie `backend/.env` com API Key
4. **Execute**: `npm start`
5. **Desenvolva**: Edite código em `src/`
6. **Build**: `npm run dist:win`

---

## 📚 Documentação Adicional

- `docs/TOTEM_DESIGN_SYSTEM.md` - Guia de design
- `docs/OTIMIZACAO_IMPRESSAO_1_PAGINA.md` - Sistema de impressão
- `docs/DOCUMENTACAO_COMPLETA_TOTEM_BARBALHO.md` - Documentação técnica
- `README.md` - Visão geral do projeto

---

**🎉 Instalação Concluída com Sucesso!**

O sistema está pronto para ser usado em eventos, feiras e pontos de venda Barbalho Alimentos.
