# 🚀 MCP - Totem Interativo IA Culinária Barbalho

**Versão do Documento:** 2.0  
**Data da Última Atualização:** Outubro 2025

## 1. 🎯 Missão Principal (Overview)

Aplicação **desktop standalone** para totem de exposição da **Barbalho Alimentos**. Sistema completo e instalável que permite visitantes criarem receitas personalizadas utilizando produtos Barbalho através de interface touch-screen com IA (Google Gemini).

### ✨ Novidades v2.0
- ✅ **Aplicação Electron** - Instalador completo para Windows
- ✅ **Detecção automática de portas** - Funciona em qualquer máquina
- ✅ **Modo produção otimizado** - Build pronto para distribuição
- ✅ **Sistema completo empacotado** - Frontend + Backend + Assets

---

## 2. 📊 Status Atual do Projeto

✅ **PROJETO COMPLETO E PRONTO PARA PRODUÇÃO**

- ✅ **Sistema Web Completo:** Frontend React + Backend Node.js totalmente funcional
- ✅ **Integração IA:** Google Gemini gerando receitas personalizadas
- ✅ **Design Finalizado:** Interface glassmorphism otimizada para 1080x1920
- ✅ **Empacotamento Electron:** Sistema instalável e distribuível
- ✅ **Detecção Automática:** Portas e rede configuradas dinamicamente
- ✅ **Documentação Completa:** Guias de build e distribuição

---

## 3. � Início Rápido

### Opção 1: Executar Build de Produção (Recomendado)

```powershell
# 1. Instalar dependências
npm run install:all

# 2. Configurar chave API em backend/.env
# GEMINI_API_KEY=sua_chave_aqui

# 3. Gerar instalador
npm run build:production

# 4. Resultado em:
# dist/Totem Barbalho-Setup-1.0.0.exe
```

**📖 Documentação completa:** [ELECTRON_BUILD_GUIDE.md](ELECTRON_BUILD_GUIDE.md)  
**⚡ Guia rápido:** [BUILD_QUICK_GUIDE.md](BUILD_QUICK_GUIDE.md)

### Opção 2: Modo Desenvolvimento (Web)

```powershell
# Instalar dependências
npm run install:all

# Iniciar frontend + backend
npm start

# Acesse: http://localhost:3001
```

---

## 4. �️ Arquitetura e Tecnologias

### Stack Tecnológico

**Frontend:**
- React 19 + TypeScript
- Glassmorphism Design System
- Touch-optimized UI (1080x1920)
- Font Awesome Icons
- Swiper.js Carousels

**Backend:**
- Node.js + Express
- Google Gemini AI API
- Puppeteer (PDF generation)
- Nodemailer (Email service)

**Desktop:**
- Electron 38
- Auto port detection
- Network discovery
- ASAR packaging

**Build & Deploy:**
- electron-builder
- Automated production script
- Windows installer (NSIS)

---

## 5. 🖥️ Ambiente de Execução (Totem)

A aplicação foi projetada para rodar em um hardware específico:

-   **Dispositivo:** Totem Vertical com TV Touch Screen
-   **Modelo da Tela:** Samsung QN43LS03DAG (43 polegadas)
-   **Orientação:** Vertical (Modo Retrato)
-   **Resolução Alvo:** **1080px (largura) x 1920px (altura)**
-   **Interação:** Touch-screen otimizado
-   **Sistema:** Windows 10/11 (x64)

---

## 6. 🌊 Fluxo do Usuário

1.  **Tela de Splash:** Animação de boas-vindas com logo 3D
2.  **Dados do Usuário:** Formulário validado (nome, telefone, email, localização)
3.  **Seleção de Produtos:** Categorias → Produtos Barbalho com imagens
4.  **Ingredientes Extras:** Seleção de ingredientes adicionais
5.  **Preferências:** Dificuldade, tempo de preparo, porções
6.  **Loading IA:** Animação enquanto Gemini gera receita
7.  **Receita Gerada:** Exibição completa com ingredientes e modo de preparo
8.  **Compartilhamento:** Opções de impressão e novo pedido

---

## 7. 📁 Estrutura do Projeto

```
totem/
├── electron-main.js              # Processo principal Electron
├── preload.js                    # Script de segurança IPC
├── package.json                  # Config projeto e electron-builder
├── ELECTRON_BUILD_GUIDE.md       # Documentação completa
├── BUILD_QUICK_GUIDE.md          # Guia rápido
│
├── backend/                      # Backend Node.js
│   ├── server.js                # API Express + Gemini
│   ├── .env                     # ⚠️ CHAVE GEMINI_API_KEY
│   ├── services/                # PDF, Email, WhatsApp
│   └── fallback-receitas.json   # Receitas offline
│
├── frontend/                     # Frontend React
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── data/                # Produtos e configurações
│   │   └── assets/              # Imagens, vídeos, ícones
│   └── build/                   # Build compilado (gerado)
│
├── scripts/
│   └── build-production.js      # Script automático de build
│
├── assets/
│   ├── icon.ico                 # Ícone do instalador
│   └── README.md                # Instruções de ícones
│
└── dist/                         # Saída do build (gerado)
    └── Totem Barbalho-Setup-1.0.0.exe
```

---

## 8. 🔧 Comandos Disponíveis

### Desenvolvimento
v
Constrói o Prompt para a IA com base no payload recebido
|
v
Chamada para a API do Google Gemini
|
v
Resposta da IA (em formato JSON)
|
v
Backend -> Envia a resposta JSON de volta para o Frontend
|
v
Frontend (totem-ia.js) -> Recebe o JSON e renderiza o HTML da receita na tela
```

### Prompt da API (Exemplo)

O `server.js` monta um prompt estruturado para garantir que a IA retorne os dados no formato exato que precisamos.

```
Crie uma receita JSON com produtos Barbalho:

PRODUTOS OBRIGATÓRIOS: Feijão Carioca Premium Barbalho, Arroz Agulhinha Tipo 1 Barbalho
INGREDIENTES EXTRAS: Cebola, Alho, Tomate, Bacon
CONFIGURAÇÕES: almoço, Fácil, 30min, 4 pessoas
RESTRIÇÕES: Nenhuma

Responda APENAS com JSON válido:
{
"titulo": "Nome da Receita",
"descricao": "Descrição breve e apetitosa",
"ingredientes": ["lista de ingredientes com quantidades"],
"instrucoes": ["passos numerados de preparo"],
"dicas": ["2-3 dicas úteis"]
}
```

---

## 7. ❗️ Itens de Ação Imediata (Next Steps)

1.  **Finalizar Lógica da Etapa 2B e 2C:** Garantir que a seleção de ingredientes comuns e a adição de ingredientes personalizados estejam a funcionar corretamente e a atualizar o estado da aplicação (`this.recipeData`).
2.  **Conectar Front-end e Back-end:** Implementar a função `generateRecipe` em `totem-ia.js` para realizar a chamada `fetch` para o `server.js`, enviar o `payload` e tratar a resposta.
3.  **Implementar Impressão:** Desenvolver a função `printRecipe` para popular um template otimizado para impressão e acionar a janela de impressão do navegador.
4.  **Testar Sistema de Inatividade:** Validar o temporizador que reinicia a aplicação após um período sem interação, garantindo uma boa experiência no ambiente de feira.
5.  **Refinar Feedback Visual:** Adicionar micro-interações e animações de feedback para cada seleção de ingrediente, melhorando a experiência do toque.

## 8. 🚀 Como Executar o Projeto

### 🎯 Método Mais Simples (RECOMENDADO)

**Windows:**
```powershell
# Clique duplo no arquivo ou execute:
.\start.bat
```

**PowerShell (Windows):**
```powershell
.\start.ps1
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### 🔧 Método Manual

**1. Backend:**
```bash
cd backend
npm install
npm start
```

**2. Frontend (em outro terminal):**
### Desenvolvimento

```powershell
# Instalar dependências (primeira vez)
npm run install:all

# Desenvolvimento web (frontend + backend)
npm start

# Testar em Electron (modo dev)
npm run dev:electron

# Apenas backend
npm run start:backend

# Apenas frontend
npm run start:frontend
```

### Produção / Build

```powershell
# Build completo automatizado ⭐
npm run build:production

# Build manual
npm run dist

# Build apenas Windows
npm run dist:win

# Testar build localmente
npm run start:electron
```

### Utilitários

```bash
cd backend
npm install
npm start
```

### 📦 Método NPM (Após instalar dependências)

```bash
# Instalar dependências de todos os projetos
npm run setup

```powershell
# Verificar ambiente
npm run check-env

# Compilar apenas frontend
npm run build

# Parar todos os processos Node
npm run stop
```

---

## 9. 🌐 URLs de Acesso (Modo Dev)

- **Frontend (Totem):** http://localhost:3001
- **Backend (API):** http://localhost:3000
- **Health Check:** http://localhost:3000/health
- **Network Access:** http://[seu-ip-local]:3000

---

## 10. ⚙️ Configuração

### API Gemini (Obrigatório)

1. Obtenha uma chave API em: https://makersuite.google.com/app/apikey
2. Edite o arquivo `backend/.env`
3. Adicione: `GEMINI_API_KEY=sua_chave_aqui`

### Ícone Personalizado (Opcional)

1. Crie/converta logo para .ico (256x256)
2. Salve em `assets/icon.ico`
3. Rebuild: `npm run build:production`

Veja `assets/README.md` para detalhes.

---

## 11. 📦 Distribuição

### Gerar Instalador

```powershell
npm run build:production
```

**Resultado:** `dist/Totem Barbalho-Setup-1.0.0.exe`

### Instalar em Totems

1. Copie o instalador para pendrive
2. Execute no totem
3. Siga o assistente de instalação
4. Configure inicialização automática (opcional)

**📖 Guia completo:** [ELECTRON_BUILD_GUIDE.md](ELECTRON_BUILD_GUIDE.md)

---

## 12. 🎯 Funcionalidades Principais

✅ **Interface Touch-Optimized** - Botões grandes, gestos intuitivos  
✅ **Detecção Automática** - Portas e rede configuradas dinamicamente  
✅ **IA Generativa** - Receitas personalizadas via Google Gemini  
✅ **Design Glassmorphism** - Interface moderna e profissional  
✅ **Modo Offline** - Fallback com receitas pré-definidas  
✅ **Sistema de Vídeos** - Screensaver automático após inatividade  
✅ **Geração de PDF** - Receitas exportáveis  
✅ **Email/WhatsApp** - Compartilhamento de receitas  
✅ **Instalador Profissional** - Setup completo para Windows  

---

## 13. 🔒 Segurança e Boas Práticas

- ✅ Context Isolation no Electron
- ✅ Preload script para IPC seguro
- ✅ CORS configurado para rede local
- ✅ Helmet.js para headers HTTP seguros
- ✅ Variáveis de ambiente (.env)
- ✅ Validação de entrada de dados
- ✅ Rate limiting na API (implementável)

---

## 14. 📚 Documentação Adicional

- **[ELECTRON_BUILD_GUIDE.md](ELECTRON_BUILD_GUIDE.md)** - Guia completo de build
- **[BUILD_QUICK_GUIDE.md](BUILD_QUICK_GUIDE.md)** - Referência rápida
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - Padrões de desenvolvimento
- **[backend/README.md](backend/README.md)** - Documentação da API
- **[assets/README.md](assets/README.md)** - Instruções de ícones

---

## 15. 🐛 Resolução de Problemas

### Build falha?
```powershell
rm -rf node_modules
npm run install:all
npm run build:production
```

### Porta em uso?
- Sistema detecta automaticamente porta livre
- Se persistir: `npm run stop`

### Chave API inválida?
- Verifique `backend/.env`
- Obtenha nova chave: https://makersuite.google.com/app/apikey

### Ícone não aparece?
- Adicione `assets/icon.ico` (256x256)
- Rebuild: `npm run build:production`

---

## 16. 🚀 Próximos Passos

1. ✅ Build de produção concluído
2. ⚠️ **Adicionar ícone** em `assets/icon.ico` (opcional)
3. ⚠️ **Testar instalador** em máquina limpa
4. ⚠️ **Distribuir** para totens

---

## 17. 📞 Suporte e Contribuição

**Desenvolvido por:** Barbalho Alimentos  
**Versão:** 2.0.0  
**Licença:** MIT

### Tecnologias Principais
- React 19 + TypeScript
- Electron 38
- Node.js 18+
- Google Gemini AI

---

**🎉 Sistema pronto para produção e distribuição!**

O totem está otimizado para resolução 1080x1920 (vertical) com detecção automática de rede e portas.

Para compilar e distribuir: `npm run build:production`
