# 🔑 Como Obter a Chave da API do Google Gemini

## 📋 Requisitos

Para usar o Totem Barbalho, você precisa de uma **chave da API do Google Gemini**. Esta chave é **gratuita** e permite que o sistema gere receitas usando Inteligência Artificial.

---

## ✅ Passo a Passo

### 1️⃣ Acesse o Google AI Studio

Abra seu navegador e acesse:
```
https://makersuite.google.com/app/apikey
```

Ou pesquise no Google: **"Google AI Studio API Key"**

### 2️⃣ Faça Login com sua Conta Google

- Use uma conta **Google Workspace** (recomendado para empresas)
- Ou use uma conta **Gmail** pessoal

### 3️⃣ Aceite os Termos de Uso

- Leia e aceite os termos de uso da API Gemini
- Clique em **"Accept"** ou **"Aceitar"**

### 4️⃣ Crie uma Nova API Key

1. Clique no botão **"Create API Key"** (Criar chave de API)
2. Escolha um projeto:
   - **Opção A**: Crie um novo projeto chamado **"Totem Barbalho"**
   - **Opção B**: Use um projeto existente
3. Clique em **"Create API key in new project"** ou **"Create API key"**

### 5️⃣ Copie a Chave

Uma janela aparecerá com sua chave de API. Exemplo:
```
AIzaSyBcj0PQR8sT3vWxYz...
```

**IMPORTANTE**:
- ✅ Copie a chave completa (clique no ícone de copiar)
- ✅ Salve em local seguro (Bloco de Notas)
- ❌ NUNCA compartilhe esta chave publicamente
- ❌ NUNCA envie em emails não criptografados

---

## 🔧 Como Usar a Chave no Totem

### Para Instalação de Produção:

1. Após instalar o Totem, navegue até:
   ```
   C:\Users\[SeuUsuario]\AppData\Local\Programs\totem-barbalho\resources\app\backend\
   ```

2. Abra o arquivo **`.env`** com Bloco de Notas

3. Adicione esta linha:
   ```
   GEMINI_API_KEY=SuaChaveAquiColadaDoGemini
   ```

4. Salve o arquivo (Ctrl+S)

5. **Reinicie o Totem** (feche e abra novamente)

### Para Instalação de Desenvolvimento:

1. Navegue até a pasta do projeto:
   ```
   C:\projetos\totem-barbalho\backend\
   ```

2. Crie ou edite o arquivo **`.env`**

3. Adicione a linha:
   ```
   GEMINI_API_KEY=SuaChaveAquiColadaDoGemini
   ```

4. Salve o arquivo

5. **Reinicie o backend** (`npm start`)

---

## 🔍 Como Verificar se a Chave Funciona

### Teste Rápido:

1. Abra o Totem
2. Preencha os dados do usuário
3. Selecione produtos Barbalho
4. Clique em **"Gerar Receita com IA"**
5. Aguarde 15-30 segundos

**✅ Funcionou se**:
- Uma receita nova é gerada
- O título NÃO tem asterisco (*) no final
- A receita é diferente a cada geração

**❌ Não funcionou se**:
- Aparece erro de "API Key"
- Receita tem asterisco (*) no final (receita fallback offline)
- Sempre gera a mesma receita

---

## 💰 Custos da API

### Plano Gratuito (Gemini 2.0):

- ✅ **60 requisições por minuto** (RPM)
- ✅ **100.000 tokens por dia** (TPD)
- ✅ **Gratuito permanentemente**

**Isso significa**:
- Você pode gerar **~2.000 receitas por dia** gratuitamente
- Perfeito para eventos e feiras
- Sem necessidade de cartão de crédito

### Plano Pago (se necessário no futuro):

- Gemini 2.0 Pro: $0.00025 por 1.000 caracteres
- ~10.000 receitas = ~$2.50 USD

---

## 🔒 Segurança da Chave

### ✅ Boas Práticas:

- Guarde a chave em local seguro
- Use uma conta Google dedicada para a empresa
- Não compartilhe a chave com terceiros
- Revogue a chave se comprometida
- Monitore uso no Google Cloud Console

### ❌ Não faça:

- Não envie a chave por email não criptografado
- Não poste a chave em fóruns/GitHub
- Não compartilhe screenshots com a chave visível
- Não use a mesma chave para múltiplos projetos

### 🔄 Como Revogar/Renovar:

1. Acesse: https://makersuite.google.com/app/apikey
2. Clique nos **3 pontos** ao lado da chave
3. Selecione **"Delete"** (Deletar)
4. Crie uma nova chave
5. Atualize o arquivo `.env` no Totem

---

## ❓ Perguntas Frequentes

### **P: A API Key expira?**
R: Não, ela é válida permanentemente até você deletá-la manualmente.

### **P: Posso usar a mesma chave em vários computadores?**
R: Sim, mas recomendamos criar chaves diferentes para cada instalação (por segurança).

### **P: O que acontece se eu atingir o limite de requisições?**
R: O sistema automaticamente usará as receitas offline (fallback) sem interromper o funcionamento.

### **P: Preciso de cartão de crédito?**
R: Não, o plano gratuito não requer cartão de crédito.

### **P: Como sei quantas requisições já usei?**
R: Acesse o Google Cloud Console e veja o dashboard de uso da API.

### **P: Posso usar para fins comerciais?**
R: Sim, o plano gratuito permite uso comercial dentro dos limites de quota.

---

## 🆘 Troubleshooting

### ❌ Erro: "API key not valid"

**Solução**:
1. Verifique se copiou a chave completa
2. Verifique se não há espaços extras no arquivo `.env`
3. Verifique se a linha está correta: `GEMINI_API_KEY=SuaChave`
4. Reinicie o Totem

### ❌ Erro: "Quota exceeded"

**Solução**:
1. Aguarde 1 minuto (limite de 60 requisições/minuto)
2. Ou use o sistema fallback (receitas offline)

### ❌ Receita sempre tem asterisco (*)

**Causa**: API Key não configurada ou inválida

**Solução**:
1. Verifique o arquivo `.env`
2. Confirme que a chave está correta
3. Reinicie o Totem

---

## 📞 Suporte

Se ainda tiver problemas:

1. Verifique o **CHECKLIST_INSTALACAO.md**
2. Consulte o **INSTALACAO_COMPLETA.md**
3. Entre em contato: **Equipe TI Barbalho Alimentos**

---

## 📄 Exemplo de Arquivo `.env`

```env
# API Key do Google Gemini (OBRIGATÓRIA)
GEMINI_API_KEY=AIzaSyBcj0PQR8sT3vWxYz1234567890ABCDEF

# Configurações opcionais (não é necessário mudar)
PORT=3000
FRONTEND_URL=http://localhost:3001
```

---

**✅ Chave Configurada! Agora você pode usar o Totem com IA!**

🎉 Receitas criativas e personalizadas a cada geração!
