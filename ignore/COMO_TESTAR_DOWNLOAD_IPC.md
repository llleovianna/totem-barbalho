# 🧪 Como Testar o Novo Sistema de Download IPC

## ✅ Implementação Concluída

O sistema de download de PDF foi **completamente reestruturado** para usar **IPC (Inter-Process Communication)** do Electron, eliminando avisos de segurança e usando diálogos nativos do Windows.

---

## 🚀 Teste Rápido (5 passos)

### **1. Reiniciar o aplicativo Electron**
```powershell
# Fechar aplicativo se estiver aberto (Alt+F4)

# Iniciar novamente
.\dist\win-unpacked\"Totem Barbalho.exe"
```

### **2. Gerar uma receita**
1. Passar pela splash screen
2. Preencher dados do usuário (ou pular)
3. Selecionar produtos Barbalho
4. Escolher ingredientes adicionais
5. Definir preferências
6. Aguardar geração da receita

### **3. Escanear QR Code (ou abrir URL manualmente)**
- Usar celular para escanear QR Code
- OU abrir manualmente: `http://192.168.15.48:3000/mobile-recipe/[ID]`

### **4. Clicar em "📥 Salvar Receita em PDF"**

**Comportamento esperado**:
- ✅ Diálogo "Salvar Como" do Windows abre
- ✅ Nome padrão: `receita-[titulo]-barbalho.pdf`
- ✅ Local padrão: `C:\Users\[usuario]\Downloads\`
- ✅ Usuário pode escolher outro local
- ✅ Confirmação de sucesso após salvar

### **5. Verificar Console (F12)**

**Console limpo esperado**:
```
📥 Iniciando download de PDF para receita: abc123-def456
🖥️  Usando Electron Main Process para download seguro
✅ PDF salvo com sucesso via Electron: C:\Users\leovi\Downloads\receita-arroz-com-frango-barbalho.pdf
```

**SEM erros de**:
- ❌ CSP (Content Security Policy)
- ❌ CORS (Cross-Origin)
- ❌ Mixed Content
- ❌ "insecure download"

---

## 🔍 O Que Mudou?

### **Antes** ❌
```
Frontend → fetch() → Blob → file-saver → Download automático
         ↑ Avisos de segurança, downloads bloqueados
```

### **Depois** ✅
```
Frontend → IPC → Main Process → HTTP → Diálogo "Salvar Como" nativo
         ↑ Sem avisos, diálogo do Windows, usuário controla
```

---

## 📋 Checklist de Validação

- [ ] Diálogo "Salvar Como" abre (nativo do Windows)
- [ ] Nome de arquivo pré-preenchido com título da receita
- [ ] Local padrão é a pasta Downloads
- [ ] Usuário pode escolher outro local
- [ ] PDF é salvo no local escolhido
- [ ] Console não mostra erros de segurança
- [ ] Logo Barbalho aparece no topo da página
- [ ] Botão funciona sem erros

---

## 🐛 Se Algo Não Funcionar

### **Cenário 1: Diálogo não abre**
**Causa**: Electron API não foi carregada

**Verificação**:
```javascript
// No console do navegador (F12)
console.log(window.electronAPI);
// Deve retornar: { downloadRecipePDF: function, ... }
```

**Solução**: Verificar que `preload.js` está configurado em `electron-main.js`

---

### **Cenário 2: Erro "Backend não retornou PDF válido"**
**Causa**: Backend retornou HTML de erro em vez de PDF

**Verificação**: Abrir diretamente a URL do PDF no navegador:
```
http://localhost:3000/api/download-recipe-pdf/[recipeId]
```

**Solução**: Verificar logs do backend, confirmar que receita existe

---

### **Cenário 3: Download cria arquivo vazio**
**Causa**: PDF corrompido ou muito pequeno

**Verificação**: Console do Electron mostra:
```
❌ [IPC] PDF muito pequeno - provavelmente corrompido
```

**Solução**: Verificar geração de PDF no backend (`pdfService.js`)

---

## 🎯 Benefícios Confirmados

Após o teste, você deve confirmar:

1. **✅ Sem avisos de segurança** - Console limpo
2. **✅ Diálogo nativo do Windows** - UX profissional
3. **✅ Controle do usuário** - Escolhe onde salvar
4. **✅ Nome inteligente** - Título da receita no nome do arquivo
5. **✅ Validação de PDF** - Detecta arquivos corrompidos
6. **✅ Limpeza automática** - Remove arquivos temporários

---

## 📞 Próximos Passos

Se tudo funcionar corretamente:

1. ✅ Sistema está pronto para uso em produção
2. 🎨 (Opcional) Adicionar barra de progresso para downloads grandes
3. 📊 (Opcional) Implementar histórico de downloads
4. 📤 (Opcional) Adicionar compartilhamento direto (email/WhatsApp)

---

## 📚 Documentação Completa

Consulte `ELECTRON_IPC_DOWNLOAD.md` para:
- Arquitetura detalhada da solução
- Código completo de cada componente
- Fluxo de dados passo a passo
- Logs e debug avançados
- Troubleshooting completo

---

**🎉 Boa sorte com os testes!**
