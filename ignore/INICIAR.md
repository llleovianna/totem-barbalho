# 🚀 Iniciar Sistema do Totem Barbalho

## ✅ Comando Único para Iniciar Tudo

```bash
npm start
```

Este comando irá:
- ✅ **Backend** na porta 3000 (http://localhost:3000)
- ✅ **Frontend** na porta 3001 (http://localhost:3001)
- ✅ **Logs organizados** com prefixos [BACKEND] e [FRONTEND]
- ✅ **Auto-kill** - Ctrl+C encerra ambos os serviços

## 📋 Outros Comandos Úteis

```bash
# Instalar todas as dependências
npm run install:all

# Apenas backend
npm run start:backend

# Apenas frontend  
npm run start:frontend

# Build para produção
npm run build

# Verificar configuração
npm run check-env
```

## 🌐 URLs de Acesso

- **Totem (Frontend):** http://localhost:3001
- **API (Backend):** http://localhost:3000
- **Health Check:** http://localhost:3000/health

## ⚠️ Pré-requisitos

1. **Node.js 18+** instalado
2. **Chave Gemini AI** configurada em `backend/.env`
3. **Dependências** instaladas com `npm run install:all`

## 🎯 Está Funcionando!

Quando executar `npm start`, você verá:
- `[BACKEND] 🚀 Totem Barbalho Backend running on port 3000`
- `[FRONTEND] Compiled successfully!`
- `[FRONTEND] You can now view frontend in the browser.`

**O sistema estará pronto para uso no totem!** 🎉