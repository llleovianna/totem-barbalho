# 📋 Checklist de Instalação - Totem Barbalho

Use este checklist para garantir que a instalação foi feita corretamente.

---

## 🏭 INSTALAÇÃO PARA PRODUÇÃO (Usuário Final)

### Antes de Instalar:

- [ ] Verifique que o computador tem Windows 10 ou superior
- [ ] Verifique que há pelo menos 500 MB de espaço livre
- [ ] Obtenha a API Key do Google Gemini: https://makersuite.google.com/app/apikey
- [ ] Conecte à internet (para download inicial e uso da IA)

### Durante a Instalação:

- [ ] Baixe o instalador `totem-barbalho-setup-1.0.0.exe`
- [ ] Execute o instalador como Administrador (botão direito → "Executar como administrador")
- [ ] Aceite os termos de instalação
- [ ] Escolha o diretório (ou use padrão: `C:\Users\[Usuario]\AppData\Local\Programs\totem-barbalho`)
- [ ] Aguarde conclusão da instalação (~2 minutos)

### Após Instalar:

- [ ] Navegue até: `C:\Users\[SeuUsuario]\AppData\Local\Programs\totem-barbalho\resources\app\backend\`
- [ ] Abra o arquivo `.env` com Bloco de Notas
- [ ] Adicione a linha: `GEMINI_API_KEY=SuaChaveAquiDoGemini`
- [ ] Salve o arquivo (Ctrl+S)
- [ ] Clique no atalho "Totem Barbalho" na área de trabalho

### Testes de Funcionamento:

- [ ] ✅ Aplicação abre em tela cheia
- [ ] ✅ Splash screen da Barbalho aparece (3 segundos)
- [ ] ✅ Formulário de dados do usuário aparece
- [ ] ✅ Consegue preencher nome, telefone, email, cidade
- [ ] ✅ Consegue clicar em "Continuar"
- [ ] ✅ Tela de seleção de produtos aparece
- [ ] ✅ Consegue selecionar produtos Barbalho (arroz, feijão, etc)
- [ ] ✅ Tela de ingredientes adicionais aparece
- [ ] ✅ Tela de preferências aparece (tempo, dificuldade, porções)
- [ ] ✅ Botão "Gerar Receita com IA" funciona
- [ ] ✅ Tela de loading aparece
- [ ] ✅ Receita é gerada com sucesso
- [ ] ✅ QR Code é exibido
- [ ] ✅ Consegue escanear QR Code com celular
- [ ] ✅ Página mobile abre corretamente no celular
- [ ] ✅ Botão "Imprimir Receita" funciona no celular
- [ ] ✅ Preview de impressão mostra receita em 1 página

### Configurações de Rede (para QR Code funcionar):

- [ ] Celular está conectado na **mesma rede Wi-Fi** do computador
- [ ] Firewall do Windows permite conexões na porta 3000
- [ ] IP do computador é detectado automaticamente (verifique nos logs)

### Se algo não funcionar:

#### ❌ Problema: "API Key não definida"
- [ ] Verifique se o arquivo `.env` existe
- [ ] Verifique se a linha `GEMINI_API_KEY=...` está correta
- [ ] Reinicie a aplicação

#### ❌ Problema: QR Code não abre no celular
- [ ] Verifique se celular está na mesma rede Wi-Fi
- [ ] Temporariamente desative o firewall para testar
- [ ] Verifique o IP do computador com `ipconfig` no CMD

#### ❌ Problema: Aplicação não abre
- [ ] Reinstale a aplicação
- [ ] Execute como Administrador
- [ ] Verifique antivírus (pode estar bloqueando)

---

## 🛠️ INSTALAÇÃO PARA DESENVOLVIMENTO (Programador)

### Pré-requisitos:

- [ ] Windows 10 ou superior
- [ ] Node.js 18 ou superior instalado (`node --version`)
- [ ] NPM 9 ou superior instalado (`npm --version`)
- [ ] Git instalado (opcional, mas recomendado)
- [ ] VS Code instalado (recomendado)
- [ ] 1 GB de espaço livre (para node_modules)

### Instalação do Código-Fonte:

- [ ] Clone o repositório ou extraia o ZIP
- [ ] Navegue até a pasta do projeto no PowerShell
- [ ] Execute `npm install` na raiz
- [ ] Execute `cd backend && npm install`
- [ ] Execute `cd ../frontend && npm install`
- [ ] Execute `cd ..` (voltar para raiz)

### Configuração:

- [ ] Crie o arquivo `backend/.env`
- [ ] Adicione a linha `GEMINI_API_KEY=SuaChaveAquiDoGemini`
- [ ] Adicione outras variáveis (opcional):
  ```
  PORT=3000
  FRONTEND_URL=http://localhost:3001
  ```

### Execução em Desenvolvimento:

- [ ] Execute `npm start` na raiz
- [ ] Verifique se backend inicia na porta 3000
- [ ] Verifique se frontend inicia na porta 3001
- [ ] Acesse `http://localhost:3001` no navegador
- [ ] Verifique `http://localhost:3000/health` (deve retornar JSON)

### Testes de Funcionamento (Desenvolvimento):

- [ ] ✅ Splash screen aparece
- [ ] ✅ Formulário funciona
- [ ] ✅ Seleção de produtos funciona
- [ ] ✅ Geração de receita funciona
- [ ] ✅ QR Code é exibido
- [ ] ✅ Página mobile abre ao escanear QR Code
- [ ] ✅ Console do backend mostra logs sem erros
- [ ] ✅ Console do frontend (F12) mostra logs sem erros

### Build de Produção:

- [ ] Execute `cd frontend && npm run build`
- [ ] Verifique se a pasta `frontend/build/` foi criada
- [ ] Execute `cd .. && npm run dist:win`
- [ ] Aguarde criação do instalador (~5-10 minutos)
- [ ] Verifique se `dist/totem-barbalho-setup-1.0.0.exe` foi criado
- [ ] Verifique se `dist/win-unpacked/` foi criado
- [ ] Teste o instalador em outra máquina

### Estrutura de Pastas (Verificação):

- [ ] `backend/` - Servidor Node.js
- [ ] `backend/services/` - Serviços (PDF, etc)
- [ ] `backend/.env` - Variáveis de ambiente (CRIADO POR VOCÊ)
- [ ] `backend/server.js` - Servidor principal
- [ ] `backend/package.json` - Dependências backend
- [ ] `frontend/` - Aplicação React
- [ ] `frontend/src/` - Código-fonte React
- [ ] `frontend/public/` - Assets estáticos
- [ ] `frontend/build/` - Build de produção (gerado)
- [ ] `frontend/package.json` - Dependências frontend
- [ ] `dist/` - Instaladores Electron (gerado)
- [ ] `electron-main.js` - Processo principal Electron
- [ ] `package.json` - Dependências raiz

### Verificação de Dependências Críticas:

- [ ] `@google/generative-ai` instalado no backend
- [ ] `express` instalado no backend
- [ ] `react` instalado no frontend
- [ ] `electron` instalado na raiz
- [ ] `electron-builder` instalado na raiz

---

## 🔍 Logs e Depuração

### Verificar Logs do Backend:

```powershell
cd backend
npm start
# Logs aparecem aqui
```

**Logs esperados**:
```
GEMINI_API_KEY: AIzaSyBcj0...
🌐 Network IP: 192.168.X.X
📸 [PDF SERVICE] Logo carregado: 11.70 KB
🚀 Totem Barbalho Backend (HTTP) running on port 3000
📡 Health check local: http://localhost:3000/health
✅ Backend iniciado com sucesso na porta 3000
```

### Verificar Logs do Frontend:

```powershell
cd frontend
npm start
# Logs aparecem aqui
```

**Logs esperados**:
```
Compiled successfully!
You can now view frontend in the browser.
  Local:            http://localhost:3001
  On Your Network:  http://192.168.X.X:3001
```

### Verificar Logs do Electron (Produção):

Execute via PowerShell para ver logs:
```powershell
cd "C:\Users\[Usuario]\AppData\Local\Programs\totem-barbalho"
.\totem-barbalho.exe
```

---

## 📊 Monitoramento de Performance

### Tempo de Inicialização Esperado:

- [ ] Splash Screen: 3 segundos
- [ ] Carregamento inicial: < 2 segundos
- [ ] Geração de receita (com IA): 15-30 segundos
- [ ] Geração de receita (fallback): < 2 segundos
- [ ] Abertura do QR Code mobile: < 1 segundo

### Uso de Recursos:

- [ ] RAM: ~300-500 MB
- [ ] CPU: < 10% (idle), < 40% (gerando receita)
- [ ] Disco: ~240 MB instalado
- [ ] Rede: Download de ~2-5 MB por receita gerada (chamadas à API)

---

## ✅ Checklist Final de Entrega

### Arquivos para Enviar ao Cliente:

- [ ] `totem-barbalho-setup-1.0.0.exe` (Instalador)
- [ ] `QUICK_INSTALL.md` (Guia rápido)
- [ ] `INSTRUCOES_GEMINI_API.txt` (Como obter API Key)
- [ ] Exemplo de arquivo `.env`:
  ```
  GEMINI_API_KEY=SUBSTITUA_PELA_SUA_CHAVE
  ```

### Instruções para o Cliente:

**Envie um email com**:

```
Assunto: Instalação do Totem Barbalho - Instruções

Olá!

Segue em anexo o instalador do Totem Interativo Barbalho.

PASSOS DE INSTALAÇÃO:

1. Execute o arquivo "totem-barbalho-setup-1.0.0.exe"
2. Após instalar, siga as instruções do arquivo "QUICK_INSTALL.md"
3. IMPORTANTE: Configure a API Key do Google Gemini conforme instruções

A API Key é gratuita e pode ser obtida em:
https://makersuite.google.com/app/apikey

Após obter a chave, edite o arquivo:
C:\Users\[SeuUsuario]\AppData\Local\Programs\totem-barbalho\resources\app\backend\.env

E adicione a linha:
GEMINI_API_KEY=SuaChaveAqui

Qualquer dúvida, estou à disposição!

Att,
Equipe TI Barbalho Alimentos
```

---

## 🎯 Resumo Executivo

### Para Usuário Final:
1. ✅ Instale o `.exe`
2. ✅ Configure API Key no `.env`
3. ✅ Execute e use

### Para Desenvolvedor:
1. ✅ `npm run install:all`
2. ✅ Configure `.env`
3. ✅ `npm start`
4. ✅ Desenvolva
5. ✅ `npm run dist:win`

---

**🎉 Instalação Completa e Verificada!**

Todos os checkboxes marcados = Sistema funcionando perfeitamente.
