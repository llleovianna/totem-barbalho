# 🎯 INSTRUÇÕES DE USO - TOTEM BARBALHO

## 🚀 Para COMPILAR o instalador:

```powershell
npm run build:production
```

**Resultado:** `dist\Totem Barbalho-Setup-1.0.0.exe` (instalador completo)

---

## 📋 Antes de compilar (primeira vez):

1. **Instalar dependências:**
   ```powershell
   npm run install:all
   ```

2. **Configurar chave API:**
   - Editar: `backend\.env`
   - Adicionar: `GEMINI_API_KEY=sua_chave_aqui`
   - Obter chave em: https://makersuite.google.com/app/apikey

3. **[OPCIONAL] Adicionar ícone:**
   - Converter logo para .ico (256x256)
   - Salvar em: `assets\icon.ico`

---

## 💻 Para TESTAR localmente (sem compilar):

```powershell
npm start
```

Acesse: http://localhost:3001

---

## 📦 Para INSTALAR em outro PC:

1. Copiar o arquivo: `dist\Totem Barbalho-Setup-1.0.0.exe`
2. Executar no PC de destino
3. Seguir o assistente de instalação
4. Pronto! O app detecta portas e rede automaticamente

---

## 📖 Documentação Completa:

- **Build detalhado:** `ELECTRON_BUILD_GUIDE.md`
- **Referência rápida:** `BUILD_QUICK_GUIDE.md`
- **Instruções gerais:** `README.md`

---

## ⚡ Comandos Úteis:

```powershell
# Compilar instalador (produção)
npm run build:production

# Testar sem instalar (dev web)
npm start

# Testar Electron em dev
npm run dev:electron

# Verificar ambiente
npm run check-env

# Parar processos Node
npm run stop
```

---

## 🆘 Problemas?

**Build falha?**
```powershell
rm -rf node_modules
npm run install:all
npm run build:production
```

**Falta chave API?**
- Editar `backend\.env`
- Adicionar `GEMINI_API_KEY=...`

**Porta em uso?**
- Sistema detecta porta livre automaticamente
- Se persistir: `npm run stop`

---

## ✅ Resultado Esperado:

Após `npm run build:production`, você terá:
- ✅ Instalador completo: `dist\Totem Barbalho-Setup-1.0.0.exe`
- ✅ Tamanho: ~100-200 MB
- ✅ Pronto para distribuir em totems
- ✅ Funciona em Windows 10/11
- ✅ Detecção automática de porta e rede

---

**Tempo de build:** 10-20 minutos  
**Plataforma:** Windows x64  
**Resolução:** 1080x1920 (vertical)

**🎉 Pronto para produção!**
