# 🔧 Correção do Erro "spawn node ENOENT"

## 🚨 Problema Reportado

Ao instalar e executar o Totem Barbalho em uma máquina limpa, o aplicativo apresentava o seguinte erro:

```
A JavaScript error occurred in the main process
Uncaught Exception:
Error: spawn node ENOENT
  at ChildProcess._handle.onexit (node:internal/child_process:285:19)
  at onErrorNT (node:internal/child_process:483:16)
  at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
```

**Sintoma visual:** Tela laranja do Electron com mensagem de erro.

---

## 🔍 Análise da Causa Raiz

### Problema 1: Node.js não embutido (CRÍTICO)

**Arquivo:** `electron-main.js` (linha 268)

**Código problemático:**
```javascript
backendProcess = spawn('node', [backendPath], { ... });
```

**Por que falha:**
- O comando `spawn('node', ...)` tenta executar o Node.js do **PATH do sistema**
- Em aplicativos Electron empacotados, o Node.js **NÃO está no PATH**
- A máquina do usuário **pode não ter Node.js instalado**
- Resultado: `ENOENT` (Error NO ENTry - arquivo não encontrado)

**Solução aplicada:**
```javascript
// Usar o Node.js embutido no Electron
const nodeExecutable = process.execPath;
backendProcess = spawn(nodeExecutable, [backendPath], { ... });
```

`process.execPath` aponta para o executável do Electron, que contém o Node.js embutido.

---

### Problema 2: node_modules excluído do instalador (CRÍTICO)

**Arquivo:** `package.json` (linha 61)

**Código problemático:**
```json
"files": [
  "backend/**/*",
  "!backend/node_modules/**/*",  // ❌ EXCLUINDO dependências!
  ...
]
```

**Por que falha:**
- O símbolo `!` significa "excluir" no electron-builder
- As dependências do backend **NÃO eram incluídas** no instalador
- O aplicativo tentava rodar sem as bibliotecas necessárias (Express, Gemini, etc.)
- Resultado: Backend falhava ao iniciar

**Solução aplicada:**
```json
"files": [
  "backend/**/*",
  "backend/node_modules/**/*",  // ✅ INCLUINDO dependências
  ...
]
```

---

### Problema 3: afterPack.js tentando instalar durante empacotamento

**Arquivo:** `scripts/afterPack.js`

**Código problemático:**
```javascript
execSync('npm install --production --no-optional', {
  cwd: backendPath,
  stdio: 'inherit'
});
```

**Por que é problemático:**
- `npm install` roda **DEPOIS** do empacotamento
- O `node_modules` já deveria estar empacotado
- Pode falhar se não houver npm instalado na máquina de build
- Aumenta tempo de build desnecessariamente

**Solução aplicada:**
- `afterPack.js` agora apenas **VERIFICA** se as dependências foram incluídas
- As dependências são instaladas **ANTES** do build pelo `build-production.js`
- Falha com erro claro se algo estiver faltando

---

## ✅ Correções Implementadas

### 1. electron-main.js

```diff
- backendProcess = spawn('node', [backendPath], {
+ const nodeExecutable = process.execPath;
+ backendProcess = spawn(nodeExecutable, [backendPath], {
```

**Efeito:** Usa Node.js embutido no Electron, não depende do sistema.

---

### 2. package.json

```diff
  "files": [
    "backend/**/*",
-   "!backend/node_modules/**/*",
+   "backend/node_modules/**/*",
```

**Efeito:** Dependências do backend são incluídas no instalador.

---

### 3. scripts/afterPack.js

**Antes:** Tentava rodar `npm install` durante empacotamento  
**Depois:** Apenas verifica se arquivos críticos estão presentes

**Verificações adicionadas:**
- ✅ `server.js` existe
- ✅ `package.json` existe
- ✅ `node_modules/` existe e contém dependências críticas
- ✅ Dependências principais: `express`, `cors`, `@google/generative-ai`, `dotenv`

---

## 🚀 Como Gerar Instalador Corrigido

### Passo 1: Instalar Dependências

```powershell
# Na raiz do projeto
npm install

# Backend
cd backend
npm install --production

# Frontend
cd ../frontend
npm install

cd ..
```

### Passo 2: Gerar Build de Produção

```powershell
npm run dist:win
```

**O que acontece:**
1. `build-production.js` verifica e instala dependências (se necessário)
2. Frontend é compilado (`npm run build`)
3. `electron-builder` empacota tudo
4. `afterPack.js` verifica se tudo foi incluído corretamente
5. Instalador `.exe` é criado em `dist/`

### Passo 3: Verificar Resultado

```powershell
# Verificar se instalador foi criado
ls dist/*.exe

# Resultado esperado:
# Totem Barbalho-Setup-1.0.0.exe (~300-400 MB)
```

**Tamanho esperado:** 300-400 MB (aumentou porque agora inclui node_modules)

---

## 🧪 Como Testar

### Teste 1: Máquina Limpa (Recomendado)

1. Use uma máquina Windows **SEM Node.js instalado**
2. Instale o `Totem Barbalho-Setup-1.0.0.exe`
3. Configure a API Key no `.env`
4. Execute o atalho "Totem Barbalho"
5. **Resultado esperado:** Aplicativo abre sem erros

### Teste 2: Verificar Logs

```powershell
# Localização dos logs em produção:
C:\Users\[Usuario]\AppData\Roaming\Totem Barbalho\totem-barbalho.log
```

**Logs esperados (sem erros):**
```
🚀 Totem Barbalho - Iniciando aplicação
🔧 Iniciando backend...
📂 Node executable: C:\Users\...\totem-barbalho.exe
✅ Backend node_modules encontrado
✅ Backend iniciado com sucesso na porta 3000
```

### Teste 3: Verificar Estrutura do Instalador

Após instalar, verifique:
```
C:\Users\[Usuario]\AppData\Local\Programs\totem-barbalho\
├── resources\
│   └── app\
│       ├── backend\
│       │   ├── node_modules\      ← DEVE EXISTIR
│       │   │   ├── express\       ← DEVE EXISTIR
│       │   │   ├── cors\          ← DEVE EXISTIR
│       │   │   ├── @google\       ← DEVE EXISTIR
│       │   │   └── ...
│       │   ├── server.js
│       │   └── package.json
│       ├── frontend\
│       │   └── build\
│       └── electron-main.js
└── totem-barbalho.exe
```

---

## 📋 Checklist Pré-Distribuição

Antes de enviar o instalador para clientes, verifique:

- [ ] Todas as dependências instaladas (`npm install` nas 3 pastas)
- [ ] Backend funciona localmente (`npm start`)
- [ ] Frontend funciona localmente (`npm start`)
- [ ] Build de produção executado (`npm run dist:win`)
- [ ] Nenhum erro durante o build
- [ ] Instalador criado em `dist/`
- [ ] Tamanho do instalador ~300-400 MB
- [ ] Testado em máquina limpa (sem Node.js)
- [ ] Logs não mostram erros de "spawn node" ou "node_modules"
- [ ] API Gemini funciona após configurar `.env`

---

## 🔄 Comparação: Antes vs Depois

### Antes (Problemático)

```
Instalador:
├── Backend (SEM node_modules) ❌
├── Frontend
└── Electron

Execução:
1. Tenta executar comando 'node' do sistema ❌
2. Sistema não tem Node.js instalado ❌
3. Erro: spawn node ENOENT ❌
4. Tela laranja com erro ❌
```

### Depois (Corrigido)

```
Instalador:
├── Backend (COM node_modules) ✅
├── Frontend
└── Electron (com Node.js embutido) ✅

Execução:
1. Usa Node.js do Electron (process.execPath) ✅
2. Carrega dependências do node_modules incluído ✅
3. Backend inicia com sucesso ✅
4. Aplicativo funciona normalmente ✅
```

---

## 🎯 Resumo das Mudanças

| Arquivo | Mudança | Impacto |
|---------|---------|---------|
| `electron-main.js` | `spawn('node')` → `spawn(process.execPath)` | Backend usa Node.js embutido |
| `package.json` | Removido `!backend/node_modules/**/*` | Dependências incluídas no instalador |
| `afterPack.js` | Removido `npm install`, adicionada verificação | Build mais rápido e confiável |

---

## 📞 Suporte

Se o erro persistir após estas correções:

1. Verifique logs em: `%APPDATA%\Totem Barbalho\totem-barbalho.log`
2. Confirme que o instalador foi gerado **APÓS** as correções
3. Confirme que `backend/node_modules` existe antes de rodar `npm run dist:win`
4. Teste em máquina virtual limpa (Windows 10+)

---

## ✅ Status

- [x] Causa raiz identificada
- [x] Correções implementadas
- [x] Documentação atualizada
- [ ] Novo instalador gerado e testado
- [ ] Distribuído para cliente

**Próximo passo:** Gerar novo instalador com `npm run dist:win` e testar em máquina limpa.
