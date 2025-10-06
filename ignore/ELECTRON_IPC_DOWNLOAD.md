# 🔒 Sistema de Download Seguro via Electron IPC

## 📋 Visão Geral

Implementação profissional de download de PDF usando **IPC (Inter-Process Communication)** do Electron, eliminando bibliotecas de navegador (`file-saver`) e avisos de segurança.

---

## ⚙️ Arquitetura da Solução

### **Antes (Inseguro)** ❌
```
Frontend (Renderer) → fetch() → Backend HTTP → Blob → file-saver → Download
                       ↑ Mixed Content, CSP, CORS warnings
```

### **Depois (Seguro)** ✅
```
Frontend (Renderer) → IPC Message → Main Process → HTTP GET → Native Save Dialog
                       ↑ Secure Bridge    ↑ Full Node.js Access
```

---

## 🔧 Componentes Implementados

### 1. **preload.js** - Ponte Segura (Context Bridge)

**Arquivo**: `preload.js`

**Função adicionada**:
```javascript
downloadRecipePDF: (recipeId, fileName) => ipcRenderer.invoke('download-pdf', { recipeId, fileName })
```

**Segurança**:
- ✅ `contextBridge` isola processos
- ✅ Apenas funções específicas expostas
- ✅ Sem acesso direto ao `require()` ou sistema de arquivos

**Como funciona**:
1. Frontend chama `window.electronAPI.downloadRecipePDF(id, name)`
2. `ipcRenderer.invoke()` envia mensagem para Main Process
3. Retorna Promise com resultado do download

---

### 2. **electron-main.js** - Handler IPC no Main Process

**Arquivo**: `electron-main.js`

**Handler adicionado**:
```javascript
ipcMain.handle('download-pdf', async (event, { recipeId, fileName }) => {
  // 1. Buscar PDF do backend via HTTP
  // 2. Salvar temporariamente em app.getPath('temp')
  // 3. Abrir dialog.showSaveDialog() nativo
  // 4. Copiar para local escolhido pelo usuário
  // 5. Deletar arquivo temporário
  // 6. Retornar { success, filePath }
})
```

**Recursos utilizados**:
- **`http.get()`**: Requisição HTTP nativa do Node.js (sem bibliotecas externas)
- **`dialog.showSaveDialog()`**: Diálogo "Salvar Como" do sistema operacional
- **`fs.writeFileSync()`**: Operações de arquivo diretas (sem sandbox do navegador)
- **`app.getPath('temp')`**: Diretório temporário do sistema
- **`app.getPath('downloads')`**: Pasta Downloads do usuário como padrão

**Validações implementadas**:
- ✅ Status HTTP 200
- ✅ Content-Type: `application/pdf`
- ✅ Tamanho mínimo 10KB (detectar corrupção)
- ✅ Tratamento de cancelamento pelo usuário
- ✅ Limpeza de arquivos temporários
- ✅ Diálogos de erro nativos

---

### 3. **DownloadScreen.tsx** - Frontend com Fallback Inteligente

**Arquivo**: `frontend/src/components/DownloadScreen.tsx`

**Função atualizada**: `generateAndDownloadPDF()`

**Fluxo de decisão**:
```typescript
if (window.electronAPI && window.electronAPI.downloadRecipePDF) {
  // ✅ ELECTRON: Usar IPC seguro
  const result = await window.electronAPI.downloadRecipePDF(recipeId, fileName);
  if (result.success) { /* Sucesso! */ }
  else if (result.canceled) { /* Usuário cancelou */ }
  else { /* Mostrar erro */ }
} else {
  // 🌐 FALLBACK: Navegador web (desenvolvimento)
  const response = await fetch(pdfUrl);
  const blob = await response.blob();
  // Último recurso: window.print()
}
```

**Detecção de ambiente**:
- **Electron**: `window.electronAPI` existe → Usa IPC
- **Navegador**: API não disponível → Fallback para `fetch()` ou `window.print()`

---

### 4. **react-app-env.d.ts** - Tipagem TypeScript

**Arquivo**: `frontend/src/react-app-env.d.ts`

**Declarações adicionadas**:
```typescript
interface ElectronAPI {
  downloadRecipePDF: (recipeId: string, fileName: string) => Promise<{
    success: boolean;
    canceled?: boolean;
    filePath?: string;
    message?: string;
    error?: string;
  }>;
}

interface Window {
  electronAPI?: ElectronAPI;
}
```

**Benefícios**:
- ✅ Autocomplete no VS Code
- ✅ Validação de tipos em tempo de compilação
- ✅ Evita erros de API não disponível

---

## 🚀 Como Funciona (Fluxo Completo)

### **Passo 1: Usuário clica em "Salvar PDF"**
```tsx
// DownloadScreen.tsx (linha ~373)
const result = await window.electronAPI.downloadRecipePDF(recipeId, fileName);
```

### **Passo 2: Mensagem IPC enviada ao Main Process**
```javascript
// preload.js (linha ~26)
ipcRenderer.invoke('download-pdf', { recipeId, fileName })
```

### **Passo 3: Main Process busca PDF do backend**
```javascript
// electron-main.js (linha ~400)
const backendUrl = `http://localhost:3000/api/download-recipe-pdf/${recipeId}`;
http.get(backendUrl, (response) => {
  // Acumula chunks do PDF
  const pdfBuffer = Buffer.concat(chunks);
  fs.writeFileSync(tempFilePath, pdfBuffer);
})
```

### **Passo 4: Diálogo "Salvar Como" exibido**
```javascript
// electron-main.js (linha ~446)
const result = await dialog.showSaveDialog(mainWindow, {
  title: 'Salvar Receita Barbalho',
  defaultPath: path.join(app.getPath('downloads'), 'receita-barbalho.pdf'),
  filters: [{ name: 'Documentos PDF', extensions: ['pdf'] }]
});
```

### **Passo 5: Arquivo copiado para local escolhido**
```javascript
// electron-main.js (linha ~461)
fs.copyFileSync(tempFilePath, result.filePath);
fs.unlinkSync(tempFilePath); // Limpar temp
```

### **Passo 6: Resultado retornado ao Frontend**
```typescript
// DownloadScreen.tsx (linha ~379)
if (result.success) {
  console.log('✅ PDF salvo:', result.filePath);
  setDownloadComplete(true);
}
```

---

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes (file-saver) | Depois (IPC) |
|---------|-------------------|--------------|
| **Segurança** | ⚠️ Mixed Content warnings | ✅ Sem avisos CSP/CORS |
| **Diálogo "Salvar"** | ❌ Download automático | ✅ Diálogo nativo do OS |
| **Controle do usuário** | ❌ Salva em Downloads fixo | ✅ Usuário escolhe local |
| **Tratamento de erros** | ⚠️ Alertas genéricos | ✅ Diálogos nativos detalhados |
| **Compatibilidade** | 🌐 Apenas navegadores | 🖥️ Electron + Fallback web |
| **Validação de PDF** | ❌ Nenhuma | ✅ Content-Type + Tamanho |
| **Limpeza de arquivos** | N/A | ✅ Deleta temporários |

---

## 🧪 Como Testar

### **1. Testar no Electron (Produção)**
```powershell
# Iniciar aplicativo Electron
.\dist\win-unpacked\"Totem Barbalho.exe"

# Passos:
1. Gerar uma receita no totem
2. Clicar em "📥 Salvar Receita em PDF"
3. Verificar que diálogo "Salvar Como" abre (nativo do Windows)
4. Escolher local e confirmar
5. Verificar arquivo PDF salvo no local escolhido
```

**Console esperado** (F12):
```
📥 Iniciando download de PDF para receita: abc123
🖥️  Usando Electron Main Process para download seguro
✅ PDF salvo com sucesso via Electron: C:\Users\...\receita-barbalho.pdf
```

### **2. Testar Fallback (Navegador Web)**
```powershell
# Iniciar apenas backend
cd backend
npm start

# Abrir navegador em http://localhost:3000
# Comportamento esperado: Usar fetch() ou window.print()
```

**Console esperado**:
```
📥 Iniciando download de PDF para receita: abc123
🌐 Electron API não disponível - usando fallback para navegador
🖨️  Usando window.print() como fallback
```

---

## 🔍 Logs e Debug

### **Frontend (DevTools)**
```javascript
// Verificar se API está disponível
console.log('Electron API:', window.electronAPI);
console.log('Download function:', window.electronAPI?.downloadRecipePDF);
```

### **Main Process (Terminal Electron)**
```
📥 [IPC] Recebida solicitação de download - Recipe ID: abc123
🌐 [IPC] Buscando PDF de: http://localhost:3000/api/download-recipe-pdf/abc123
✅ [IPC] PDF baixado: 187.42 KB
💾 [IPC] PDF salvo temporariamente em: C:\Users\...\AppData\Local\Temp\totem-barbalho-abc123.pdf
✅ [IPC] PDF salvo com sucesso em: C:\Users\leovi\Downloads\receita-barbalho.pdf
```

### **Backend (server.js)**
```
📥 [PDF] Gerando PDF para receita: abc123
✅ [PDF] Buffer gerado: 191897 bytes
📤 [PDF] Enviando PDF: receita-barbalho.pdf (187.40 KB)
```

---

## ⚠️ Possíveis Erros e Soluções

### **Erro: "Property 'electronAPI' does not exist on type 'Window'"**

**Causa**: TypeScript não reconhece a interface personalizada.

**Solução**: Verificar que `react-app-env.d.ts` contém as declarações e está incluído no `tsconfig.json`.

---

### **Erro: "Electron API não disponível"**

**Causa**: `preload.js` não foi carregado ou `contextBridge` não foi executado.

**Solução**: Verificar em `electron-main.js`:
```javascript
webPreferences: {
  preload: path.join(__dirname, 'preload.js'), // ✅ Deve existir
}
```

---

### **Erro: "PDF muito pequeno - provavelmente corrompido"**

**Causa**: Backend retornou HTML de erro em vez de PDF.

**Solução**: Verificar logs do backend:
```powershell
cd backend
npm start
# Verificar se GEMINI_API_KEY está configurada
```

---

### **Erro: "Cannot read properties of undefined (reading 'downloadRecipePDF')"**

**Causa**: Código tentando usar API antes do preload estar pronto.

**Solução**: Sempre usar verificação condicional:
```typescript
if (window.electronAPI && window.electronAPI.downloadRecipePDF) {
  // Safe to use
}
```

---

## 📦 Arquivos Modificados

### **Novos arquivos**:
- Nenhum

### **Arquivos atualizados**:
1. ✅ `preload.js` - Adicionado `downloadRecipePDF` ao `contextBridge`
2. ✅ `electron-main.js` - Adicionado handler `ipcMain.handle('download-pdf')`
3. ✅ `frontend/src/components/DownloadScreen.tsx` - Substituído `fetch + saveAs` por IPC
4. ✅ `frontend/src/react-app-env.d.ts` - Adicionadas interfaces TypeScript

### **Arquivos copiados para produção**:
```powershell
frontend/build/* → dist/win-unpacked/resources/app/frontend/build/
preload.js → dist/win-unpacked/resources/app/preload.js
electron-main.js → dist/win-unpacked/resources/app/electron-main.js
```

---

## 🎯 Benefícios da Implementação

### **Segurança**
- ✅ Sem avisos CSP (Content Security Policy)
- ✅ Sem Mixed Content (HTTP + HTTPS)
- ✅ Sem CORS (Cross-Origin Resource Sharing)
- ✅ Processo isolado com `contextBridge`

### **Experiência do Usuário**
- ✅ Diálogo "Salvar Como" nativo do Windows
- ✅ Usuário escolhe onde salvar (em vez de Downloads fixo)
- ✅ Nome de arquivo pré-preenchido com título da receita
- ✅ Mensagens de erro detalhadas e profissionais

### **Performance**
- ✅ Sem dependências externas (`file-saver` removido)
- ✅ Buffers nativos do Node.js (mais rápido que Blob)
- ✅ Limpeza automática de arquivos temporários

### **Compatibilidade**
- ✅ Funciona em Electron (produção)
- ✅ Fallback para navegadores (desenvolvimento/testes)
- ✅ Windows, Mac, Linux (diálogos nativos para cada OS)

---

## 🔄 Próximos Passos (Opcional)

### **Melhorias Futuras**:
1. **Progress Bar**: Mostrar progresso do download para PDFs grandes
   ```typescript
   ipcMain.handle('download-pdf-progress', (event, progress) => {
     mainWindow.webContents.send('download-progress', progress);
   });
   ```

2. **Histórico de Downloads**: Salvar lista de receitas baixadas
   ```javascript
   const downloads = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
   downloads.push({ recipeId, fileName, timestamp: Date.now() });
   ```

3. **Abrir PDF após salvar**: Mostrar opção para abrir com leitor padrão
   ```javascript
   const { shell } = require('electron');
   shell.openPath(result.filePath);
   ```

4. **Compartilhamento direto**: Integrar com email/WhatsApp desktop
   ```javascript
   shell.openExternal(`mailto:?subject=Receita Barbalho&attachment=${filePath}`);
   ```

---

## 📚 Referências

- [Electron IPC Documentation](https://www.electronjs.org/docs/latest/api/ipc-main)
- [Context Bridge Security](https://www.electronjs.org/docs/latest/tutorial/context-isolation)
- [Dialog API](https://www.electronjs.org/docs/latest/api/dialog)
- [Node.js HTTP Module](https://nodejs.org/api/http.html)

---

## ✅ Checklist de Implementação

- [x] Adicionar `downloadRecipePDF` ao `preload.js`
- [x] Implementar handler IPC em `electron-main.js`
- [x] Atualizar `DownloadScreen.tsx` com detecção de ambiente
- [x] Adicionar tipagem TypeScript (`react-app-env.d.ts`)
- [x] Rebuild do frontend (`npm run build`)
- [x] Copiar arquivos para `dist/win-unpacked/`
- [x] Testar download em Electron
- [x] Verificar fallback em navegador
- [x] Validar limpeza de arquivos temporários
- [x] Documentar implementação

---

**🎉 Implementação concluída com sucesso!**

O sistema de download agora funciona de forma profissional, segura e nativa no Electron, eliminando todos os avisos de segurança e proporcionando uma experiência de desktop completa.
