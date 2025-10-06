# 🚀 GUIA RÁPIDO - Build Electron Totem Barbalho

## ⚡ Compilar para Produção (1 Comando)

```powershell
npm run build:production
```

**Resultado:** Instalador em `dist/Totem Barbalho-Setup-1.0.0.exe`

---

## 📋 Pré-requisitos

1. **Node.js 18+** instalado
2. **Dependências instaladas:**
   ```powershell
   npm run install:all
   ```
3. **Chave API configurada** em `backend/.env`:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```

---

## 🛠️ Comandos Principais

| Comando | Descrição |
|---------|-----------|
| `npm run build:production` | Build completo automático ⭐ |
| `npm run dist` | Build manual (avançado) |
| `npm run dist:win` | Build apenas Windows |
| `npm run start:electron` | Testar build localmente |
| `npm run dev:electron` | Testar em modo dev |

---

## 📦 O que é Empacotado?

✅ **Incluído:**
- Frontend React compilado
- Backend Node.js completo
- Todas as imagens e vídeos
- Dependências necessárias
- Arquivo .env com configurações

❌ **Excluído:**
- Pasta `ignore/`
- Código fonte React
- Arquivos de desenvolvimento

---

## 🔧 Resolução Rápida

### Build falha?
```powershell
# Limpar e reinstalar
rm -rf node_modules
npm run install:all
npm run build:production
```

### Falta chave API?
```powershell
# Editar arquivo
notepad backend\.env
# Adicionar: GEMINI_API_KEY=sua_chave
```

### Quer ícone personalizado?
1. Converter logo para .ico (256x256)
2. Salvar em `assets/icon.ico`
3. Rodar build novamente

---

## 📍 Arquivos Importantes

```
totem/
├── electron-main.js              # Processo principal
├── preload.js                    # Segurança IPC
├── package.json                  # Configuração
├── backend/.env                  # ⚠️ CHAVE API AQUI
├── scripts/build-production.js   # Script automático
└── dist/                         # ✅ Instalador gerado
    └── Totem Barbalho-Setup-1.0.0.exe
```

---

## 🎯 Distribuir

1. **Copiar instalador** para pendrive:
   ```
   dist/Totem Barbalho-Setup-1.0.0.exe
   ```

2. **Executar no totem**

3. **Pronto!** O app detecta portas e rede automaticamente

---

## 📖 Documentação Completa

Para detalhes completos, veja: **ELECTRON_BUILD_GUIDE.md**

---

**Tempo estimado de build:** 10-20 minutos  
**Tamanho do instalador:** 100-200 MB  
**Plataformas:** Windows 10/11 (x64)
