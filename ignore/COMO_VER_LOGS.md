# 🔍 COMO VER OS LOGS DO TOTEM

## 📂 Localização dos Logs

### Windows

O arquivo de log fica em:
```
C:\Users\<SeuUsuario>\AppData\Roaming\Totem Barbalho\totem-barbalho.log
```

Ou usando variável de ambiente:
```
%APPDATA%\Totem Barbalho\totem-barbalho.log
```

---

## 🚀 Como Abrir o Log

### Método 1: Executável Direto (Abrir no Console)

1. Abra PowerShell ou CMD
2. Navegue até a pasta de instalação:
   ```powershell
   cd "C:\Users\leovi\AppData\Local\Programs\Totem Barbalho"
   ```

3. Execute o aplicativo pelo terminal:
   ```powershell
   .\Totem Barbalho.exe
   ```

4. Os logs aparecerão no console EM TEMPO REAL

### Método 2: Arquivo de Log

1. Após executar o aplicativo instalado normalmente
2. Abra o Explorador de Arquivos
3. Cole na barra de endereço:
   ```
   %APPDATA%\Totem Barbalho
   ```

4. Abra o arquivo `totem-barbalho.log` com Bloco de Notas

### Método 3: PowerShell (Monitorar em Tempo Real)

```powershell
# Ver conteúdo atual
Get-Content "$env:APPDATA\Totem Barbalho\totem-barbalho.log"

# Monitorar em tempo real (como tail -f)
Get-Content "$env:APPDATA\Totem Barbalho\totem-barbalho.log" -Wait -Tail 50
```

---

## 📋 O Que Procurar no Log

### ✅ Inicialização Bem-Sucedida

```
======================================================================
🚀 Totem Barbalho - Iniciando aplicação
📂 App Path: C:\Users\...\Totem Barbalho\resources\app
📂 User Data: C:\Users\...\AppData\Roaming\Totem Barbalho
📂 Resources: C:\Users\...\Totem Barbalho\resources
🔧 Electron: 38.1.2
🔧 Node: 20.x.x
🔧 Modo: PRODUÇÃO
======================================================================
📱 Electron app ready
✅ Porta livre encontrada: 3000
1️⃣  Passo 1: Iniciando backend...
🔌 Backend usará porta 3000
📂 Backend path: C:\...\backend\server.js
✅ Backend node_modules encontrado
🚀 Spawning Node.js process para backend...
⏳ Aguardando backend ficar pronto...
[Backend] 🚀 Totem Barbalho Backend (HTTP) running on port 3000
✅ Backend pronto na porta 3000
✅ Backend iniciado com sucesso na porta 3000
2️⃣  Passo 2: Criando janela...
📱 Criando janela principal...
📱 Carregando frontend: file:///C:/.../frontend/build/index.html
🖥️  Janela principal pronta e visível
✅ Totem Barbalho iniciado com sucesso!
```

### ❌ Erros Comuns

#### 1. Backend node_modules não encontrado
```
⚠️  node_modules não encontrado em: C:\...\backend\node_modules
❌ Backend node_modules não encontrado
```

**Solução:** Instalar dependências manualmente
```powershell
cd "C:\Users\leovi\AppData\Local\Programs\Totem Barbalho\resources\app\backend"
npm install --production
```

#### 2. Backend não inicia
```
❌ Erro no processo backend: spawn node ENOENT
```

**Solução:** Node.js não está instalado ou não está no PATH

#### 3. Frontend não carrega
```
❌ Falha ao carregar: -6 - ERR_FILE_NOT_FOUND
```

**Solução:** Pasta `frontend/build` não existe ou está vazia

#### 4. Porta ocupada
```
⚠️  Porta 3000 ocupada, tentando 3001
⚠️  Porta 3001 ocupada, tentando 3002
...
```

**Normal:** Sistema procura porta livre automaticamente

---

## 🐛 Debug Avançado

### Executar em Modo Debug

1. Abra PowerShell como Administrador
2. Execute:
   ```powershell
   cd "C:\Users\leovi\AppData\Local\Programs\Totem Barbalho"
   $env:NODE_ENV="development"
   .\Totem Barbalho.exe
   ```

3. DevTools abrirão automaticamente

### Ver Estrutura de Arquivos Instalada

```powershell
cd "C:\Users\leovi\AppData\Local\Programs\Totem Barbalho\resources\app"
tree /F
```

Deve mostrar:
```
app/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── services/
│   └── node_modules/    ← IMPORTANTE!
├── frontend/
│   └── build/
│       ├── index.html
│       ├── static/
│       └── ...
├── electron-main.js
├── preload.js
└── package.json
```

---

## 🚨 Mensagens de Erro no Windows

Se o aplicativo não abrir E não mostrar erro:

### 1. Verificar se está rodando em background

Abra Gerenciador de Tarefas (Ctrl+Shift+Esc):
- Procure por "Totem Barbalho" ou "node.exe"
- Se houver 3 processos, significa que:
  - 1 = Electron main
  - 2 = Electron renderer (janela)
  - 3 = Backend Node.js

Se vê 3 processos mas não vê janela:
- Problema no frontend
- Janela pode estar em monitor secundário
- Tente Alt+Tab para alternar

### 2. Forçar Reinício Limpo

```powershell
# Matar todos os processos
taskkill /f /im "Totem Barbalho.exe"
taskkill /f /im node.exe

# Limpar dados do app (cuidado: apaga logs!)
Remove-Item -Recurse "$env:APPDATA\Totem Barbalho"

# Executar novamente
& "C:\Users\leovi\AppData\Local\Programs\Totem Barbalho\Totem Barbalho.exe"
```

### 3. Executar Direto do win-unpacked (Teste)

```powershell
cd "C:\Users\leovi\Desktop\totem\dist\win-unpacked"
.\Totem Barbalho.exe
```

Isso executa SEM instalar e mostra erros no console.

---

## 📊 Checklist de Diagnóstico

Execute os comandos abaixo e cole a saída:

```powershell
# 1. Verificar se Node.js está instalado
node --version
npm --version

# 2. Verificar se arquivos existem
Test-Path "C:\Users\leovi\AppData\Local\Programs\Totem Barbalho\Totem Barbalho.exe"
Test-Path "C:\Users\leovi\AppData\Local\Programs\Totem Barbalho\resources\app\backend\server.js"
Test-Path "C:\Users\leovi\AppData\Local\Programs\Totem Barbalho\resources\app\backend\node_modules"
Test-Path "C:\Users\leovi\AppData\Local\Programs\Totem Barbalho\resources\app\frontend\build\index.html"

# 3. Verificar processos rodando
Get-Process | Where-Object {$_.Name -like "*Totem*" -or $_.Name -eq "node"}

# 4. Ver último log
if (Test-Path "$env:APPDATA\Totem Barbalho\totem-barbalho.log") {
    Get-Content "$env:APPDATA\Totem Barbalho\totem-barbalho.log" -Tail 50
} else {
    Write-Host "Log não encontrado"
}
```

---

## ✅ Próximos Passos

1. **Executar do win-unpacked primeiro** (teste sem instalação)
2. **Ver logs em tempo real** no console
3. **Identificar erro específico**
4. **Corrigir baseado no erro**
5. **Rebuild se necessário**

---

**DICA RÁPIDA:** Se instalador não funciona, teste sempre o `dist\win-unpacked\Totem Barbalho.exe` primeiro!
