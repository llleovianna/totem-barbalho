# 📦 Guia de Build e Distribuição - Totem Barbalho Electron

**Versão:** 1.0.0  
**Data:** Outubro 2025  
**Autor:** Equipe Barbalho Alimentos

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração Inicial](#configuração-inicial)
4. [Build de Produção](#build-de-produção)
5. [Estrutura do Projeto](#estrutura-do-projeto)
6. [Resolução de Problemas](#resolução-de-problemas)
7. [Distribuição](#distribuição)
8. [Manutenção](#manutenção)

---

## 🎯 Visão Geral

Este documento descreve o processo completo para compilar, empacotar e distribuir o aplicativo **Totem Barbalho** como uma aplicação desktop standalone usando Electron.

### O que é gerado no build?

- **Instalador Windows (.exe)**: Aplicação completa e instalável
- **Arquivos empacotados**: Frontend React + Backend Node.js + Electron
- **Configuração automática**: Detecção de portas livres e rede local
- **Modo produção**: Otimizado e pronto para uso em totems

---

## 🔧 Pré-requisitos

### Software Necessário

| Software | Versão Mínima | Download |
|----------|---------------|----------|
| Node.js | 18.0.0 | https://nodejs.org/ |
| npm | 9.0.0 | Incluído com Node.js |
| Windows | 10/11 | - |
| Git | 2.0+ | https://git-scm.com/ (opcional) |

### Verificar Instalação

```powershell
# Verificar Node.js
node --version
# Deve retornar: v18.x.x ou superior

# Verificar npm
npm --version
# Deve retornar: 9.x.x ou superior
```

---

## ⚙️ Configuração Inicial

### 1. Clonar/Baixar o Projeto

```powershell
# Se usando Git
git clone https://github.com/seu-repositorio/totem-barbalho.git
cd totem-barbalho

# Ou simplesmente extraia o ZIP para uma pasta
```

### 2. Instalar Dependências

```powershell
# Instalar todas as dependências (root, backend e frontend)
npm run install:all
```

Este comando irá:
- ✅ Instalar dependências do projeto raiz
- ✅ Instalar dependências do backend
- ✅ Instalar dependências do frontend React

**⏱️ Tempo estimado:** 5-10 minutos (depende da conexão com internet)

### 3. Configurar Variáveis de Ambiente

#### Backend (.env)

Edite o arquivo `backend/.env`:

```env
# Google Gemini AI - OBRIGATÓRIO
GEMINI_API_KEY=sua_chave_api_gemini_aqui

# Configurações do servidor (automáticas)
PORT=3000
NODE_ENV=production
FRONTEND_URL=http://localhost:3001

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

**⚠️ IMPORTANTE:** Configure a `GEMINI_API_KEY` antes de fazer o build!

Para obter uma chave:
1. Acesse: https://makersuite.google.com/app/apikey
2. Crie uma nova chave API
3. Cole no arquivo `.env`

---

## 🚀 Build de Produção

### Método Automático (Recomendado)

Execute o script automatizado que faz todo o processo:

```powershell
npm run build:production
```

Este comando irá:

1. ✅ Verificar ambiente Node.js
2. ✅ Verificar dependências instaladas
3. ✅ Verificar configuração do .env
4. ✅ Limpar builds anteriores
5. ✅ Compilar frontend React
6. ✅ Criar arquivo de licença
7. ✅ Verificar assets/ícones
8. ✅ Compilar aplicação Electron
9. ✅ Gerar instalador Windows

**⏱️ Tempo estimado:** 10-20 minutos

### Método Manual (Avançado)

Se preferir fazer passo a passo:

```powershell
# 1. Compilar frontend
cd frontend
npm run build
cd ..

# 2. Gerar instalador Electron
npm run dist
```

---

## 📁 Estrutura do Projeto

### Arquivos Principais do Electron

```
totem/
├── electron-main.js          # Processo principal do Electron
├── preload.js                # Script de segurança (IPC)
├── package.json              # Configuração do projeto e electron-builder
│
├── backend/                  # Backend Node.js (API)
│   ├── server.js            # Servidor Express
│   ├── .env                 # Configurações (GEMINI_API_KEY)
│   ├── services/            # Serviços (PDF, Email, WhatsApp)
│   └── fallback-receitas.json
│
├── frontend/                 # Frontend React
│   ├── src/                 # Código fonte React
│   ├── build/               # Build compilado (gerado)
│   └── package.json
│
├── scripts/
│   └── build-production.js  # Script automatizado de build
│
├── assets/                   # Recursos do instalador
│   └── icon.ico             # Ícone do aplicativo (256x256)
│
└── dist/                     # Saída do build (gerado)
    └── Totem Barbalho-Setup-1.0.0.exe
```

### O que é Empacotado?

✅ **Incluído no build:**
- Frontend React compilado (`frontend/build/`)
- Backend Node.js completo (`backend/`)
- Todas as imagens e vídeos (`assets/`)
- Dependências do Node.js (`node_modules`)
- Electron runtime
- Arquivo `.env` com configurações

❌ **Excluído do build:**
- Pasta `ignore/` (documentação antiga)
- Arquivos de desenvolvimento (`.vscode/`, `.git/`)
- Código fonte React (`frontend/src/`)
- Scripts de desenvolvimento
- Certificados SSL de desenvolvimento

---

## 🎨 Personalizar Ícones

### Criar Ícone do Aplicativo

1. **Criar/obter imagem:**
   - Formato: PNG com fundo transparente
   - Tamanho: 256x256 pixels ou maior
   - Conteúdo: Logo da Barbalho

2. **Converter para .ico:**

**Opção 1:** Online
- Acesse: https://www.icoconverter.com/
- Faça upload da PNG
- Baixe o .ico

**Opção 2:** Ferramenta local
```powershell
# Instalar imagemagick (opcional)
winget install ImageMagick.ImageMagick

# Converter
magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

3. **Salvar ícone:**
   - Local: `assets/icon.ico`
   - O build usará automaticamente

---

## 🔍 Verificar Build

### Após o Build Completo

```powershell
# Listar arquivos gerados
ls dist/
```

Você deverá ver:
```
Totem Barbalho-Setup-1.0.0.exe    # Instalador (100-200 MB)
win-unpacked/                      # Versão portável (opcional)
```

### Testar o Instalador

```powershell
# Executar instalador
.\dist\Totem Barbalho-Setup-1.0.0.exe
```

O instalador irá:
1. Mostrar assistente de instalação
2. Permitir escolher pasta de instalação
3. Criar atalho na área de trabalho
4. Instalar a aplicação

---

## 🛠️ Resolução de Problemas

### Erro: "GEMINI_API_KEY não definida"

**Solução:**
1. Edite `backend/.env`
2. Adicione sua chave: `GEMINI_API_KEY=AIzaSy...`
3. Salve o arquivo
4. Execute o build novamente

### Erro: "Node.js versão incompatível"

**Solução:**
1. Desinstale Node.js antigo
2. Baixe versão 18+ de: https://nodejs.org/
3. Instale e reinicie o terminal
4. Verifique: `node --version`

### Erro: "Porta 3000 em uso"

**Solução:**
- O sistema agora detecta portas livres automaticamente
- Se persistir, feche outros servidores Node.js:
```powershell
taskkill /f /im node.exe
```

### Erro: "electron-builder falhou"

**Solução:**
```powershell
# Limpar cache do electron-builder
npx electron-builder clean

# Reinstalar dependências
rm -rf node_modules
npm install

# Tentar build novamente
npm run build:production
```

### Build muito lento

**Causas comuns:**
- Antivírus escaneando arquivos (adicione exceção)
- Primeira execução (baixa Electron runtime)
- Conexão lenta (baixa dependências)

**Solução:**
```powershell
# Adicionar exceção no Windows Defender
# Painel de Controle > Segurança do Windows > Proteção contra vírus
# Adicionar exclusão: C:\Users\SeuUsuario\Desktop\totem
```

---

## 📤 Distribuição

### Instalação em Totems

#### Método 1: USB

1. Copie o instalador para pendrive:
   ```
   Totem Barbalho-Setup-1.0.0.exe
   ```

2. No totem:
   - Insira o pendrive
   - Execute o instalador
   - Siga o assistente de instalação
   - Configure para iniciar automaticamente (opcional)

#### Método 2: Rede

1. Compartilhe a pasta `dist/` em rede
2. Acesse de outro PC: `\\ip-do-pc\dist\`
3. Execute o instalador

### Configurar Inicialização Automática

**Windows 10/11:**

1. Criar atalho:
   ```
   C:\Program Files\Totem Barbalho\Totem Barbalho.exe
   ```

2. Mover para pasta de inicialização:
   ```
   %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
   ```

3. Ou via Task Scheduler:
   ```powershell
   # Abrir Task Scheduler
   taskschd.msc
   
   # Criar tarefa:
   # - Gatilho: Ao fazer logon
   # - Ação: Iniciar programa
   # - Programa: Totem Barbalho.exe
   ```

### Modo Kiosk (Tela Cheia Permanente)

O aplicativo já inicia em **fullscreen** (1080x1920) automaticamente.

Para bloquear saída:
1. Configure Windows em modo Kiosk
2. Use política de grupo (gpedit.msc)
3. Desabilite Alt+Tab, Alt+F4, Win+D

---

## 🔄 Manutenção e Atualizações

### Atualizar Aplicação

1. **Modificar código:**
   - Frontend: `frontend/src/`
   - Backend: `backend/server.js`

2. **Incrementar versão:**
   ```json
   // package.json
   {
     "version": "1.0.1"  // Era 1.0.0
   }
   ```

3. **Recompilar:**
   ```powershell
   npm run build:production
   ```

4. **Redistribuir:**
   ```
   dist/Totem Barbalho-Setup-1.0.1.exe
   ```

### Logs e Debugging

**Em produção:**
```powershell
# Logs do Electron
%APPDATA%\Totem Barbalho\logs\

# Logs do backend
# São exibidos no console do Electron
```

**Em desenvolvimento:**
```powershell
# Testar sem build
npm run dev:electron
```

### Backup de Configurações

Antes de atualizar, salve:
```
backend/.env                    # Chaves API
backend/fallback-receitas.json  # Receitas fallback
```

---

## 📊 Comparação: Dev vs Produção

| Aspecto | Desenvolvimento | Produção (Build) |
|---------|----------------|------------------|
| **Frontend** | Dev server (localhost:3001) | Arquivos estáticos (build/) |
| **Backend** | Node.js standalone | Executado pelo Electron |
| **Porta** | Fixa (3000) | Dinâmica (primeira livre) |
| **DevTools** | Aberto | Fechado |
| **Hot Reload** | Sim | Não |
| **Tamanho** | ~500 MB (dev) | ~150 MB (instalador) |
| **Inicialização** | Manual (2 processos) | Automática (1 clique) |

---

## 🎓 Comandos Úteis

### Desenvolvimento

```powershell
# Iniciar em modo dev (web)
npm start

# Iniciar Electron em dev
npm run dev:electron

# Compilar frontend apenas
npm run build

# Verificar ambiente
npm run check-env
```

### Produção

```powershell
# Build completo automatizado
npm run build:production

# Build manual (avançado)
npm run dist

# Apenas Windows
npm run dist:win

# Testar build localmente
npm run start:electron
```

### Limpeza

```powershell
# Limpar builds
rm -rf frontend/build, dist

# Limpar dependências
rm -rf node_modules, frontend/node_modules, backend/node_modules

# Reinstalar tudo
npm run install:all
```

---

## 📞 Suporte

### Documentação Adicional

- **Electron:** https://www.electronjs.org/docs
- **Electron Builder:** https://www.electron.build/
- **React:** https://react.dev/
- **Node.js:** https://nodejs.org/docs

### Problemas Comuns

| Erro | Solução |
|------|---------|
| Chave API inválida | Verificar `backend/.env` |
| Porta em uso | Sistema detecta porta livre automaticamente |
| Build falha | Verificar Node.js 18+, limpar cache |
| Ícone não aparece | Adicionar `assets/icon.ico` 256x256 |
| Instalador grande | Normal (100-200 MB com Electron) |

---

## ✅ Checklist Pré-Build

Antes de fazer o build de produção:

- [ ] Node.js 18+ instalado
- [ ] Todas as dependências instaladas (`npm run install:all`)
- [ ] `GEMINI_API_KEY` configurada em `backend/.env`
- [ ] Ícone adicionado em `assets/icon.ico` (opcional)
- [ ] Frontend testado (`npm start`)
- [ ] Backend testado (receitas gerando)
- [ ] Versão atualizada em `package.json`
- [ ] Disco com pelo menos 2 GB livres
- [ ] Conexão estável com internet

---

## 🎉 Pronto!

Você agora tem:
- ✅ Instalador profissional do Totem Barbalho
- ✅ Aplicação standalone (não precisa de nada instalado)
- ✅ Detecção automática de porta e rede
- ✅ Modo produção otimizado
- ✅ Pronto para distribuir em totens

**Próximo passo:** Teste o instalador em uma máquina limpa antes de distribuir!

---

**Desenvolvido com ❤️ por Barbalho Alimentos**  
**Versão do Documento:** 1.0.0
