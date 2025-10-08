# ⚠️ Node.js Obrigatório - Instruções de Instalação

## 🚨 ATENÇÃO: Este aplicativo requer Node.js instalado

O **Totem Barbalho** precisa do **Node.js 18 ou superior** instalado no computador para funcionar.

---

## 📥 Como Instalar Node.js

### Passo 1: Download
Acesse: **https://nodejs.org/**

### Passo 2: Escolha a Versão
- Clique em **"LTS"** (Recomendado)
- Ou baixe diretamente: https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi

### Passo 3: Instalar
1. Execute o arquivo `.msi` baixado
2. Clique em **"Next"** em todas as telas
3. Aceite os termos e clique em **"Install"**
4. Aguarde a instalação concluir
5. Clique em **"Finish"**

### Passo 4: Verificar Instalação
Abra o **Prompt de Comando** (cmd) e digite:
```
node --version
```

Deve mostrar algo como: `v20.11.0`

---

## 🚀 Após Instalar Node.js

1. **Reinicie o computador** (recomendado)
2. Execute novamente o **Totem Barbalho**
3. O sistema deve iniciar normalmente

---

## ❓ Perguntas Frequentes

### 1. "Por que preciso instalar Node.js?"
O backend do Totem Barbalho é escrito em Node.js e precisa do runtime para executar.

### 2. "Node.js é gratuito?"
Sim! Node.js é 100% gratuito e open-source.

### 3. "É seguro instalar Node.js?"
Sim! Node.js é usado por milhões de desenvolvedores e empresas no mundo todo.

### 4. "Qual versão devo instalar?"
**Versão LTS 20.x ou superior** (recomendado)

### 5. "Preciso de conhecimento técnico?"
Não! A instalação é automática, apenas clique em "Next".

---

## 🔧 Troubleshooting

### Erro: "Node.js Não Encontrado" Mesmo Após Instalar

**Solução 1: Reiniciar o Computador**
- Reinicie o PC após instalar Node.js
- Isso atualiza as variáveis de ambiente

**Solução 2: Verificar PATH**
1. Abra o cmd e digite: `node --version`
2. Se der erro "comando não reconhecido":
   - Node.js não está no PATH do sistema
   - Reinstale o Node.js marcando a opção "Add to PATH"

**Solução 3: Instalação Manual do PATH**
1. Copie o caminho: `C:\Program Files\nodejs\`
2. Adicione às variáveis de ambiente PATH
3. Reinicie o sistema

---

## 📞 Suporte

Se você seguiu todos os passos e ainda tem problemas:

1. Verifique o log em: `C:\Users\[SeuUsuario]\AppData\Roaming\totem-barbalho-workspace\totem-barbalho.log`
2. Entre em contato com o suporte informando o erro do log
3. Email: suporte@barbalho.com.br

---

## 📋 Checklist de Instalação

- [ ] Baixei Node.js LTS de https://nodejs.org/
- [ ] Executei o instalador .msi
- [ ] Instalação concluída com sucesso
- [ ] Reiniciei o computador
- [ ] Abri o cmd e verifiquei com `node --version`
- [ ] Executei o Totem Barbalho novamente

---

**Data**: 08/10/2025  
**Versão do Sistema**: 1.0.1  
**Requisito**: Node.js 18+ (Recomendado: 20 LTS)
