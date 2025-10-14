# ⚠️ Problema: Quota Excedida da API Gemini

## 🔴 Erro Identificado

```
[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent: [429 Too Many Requests] You exceeded your current quota, please check your plan and billing details.

* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 50
Please retry in 6.134954342s.
```

---

## 📊 Diagnóstico

### Limite Atual
- **Tier**: Gratuito (Free Tier)
- **Modelo**: `gemini-2.5-pro`
- **Limite**: 50 requisições por dia
- **Status**: ✅ Quota excedida (50/50 requisições usadas)

### Sistema de Fallback
✅ **Funcionando corretamente!**
```javascript
✅ Fallback ativado: "Arroz Branco Soltinho Perfeito*"
```

O sistema detectou o erro e automaticamente retornou uma receita de fallback do arquivo `backend/fallback-receitas.json`.

---

## 🔧 Soluções

### Solução 1: Aguardar Reset (Temporária)
A quota do tier gratuito reseta a cada 24 horas.

**Ação**:
- Aguardar até amanhã no mesmo horário
- A quota será restaurada automaticamente

---

### Solução 2: Upgrade para Tier Pago (Recomendada)

#### **Pay-as-you-go (Pagar conforme usa)**
- **Custo**: ~$0.00025 por requisição
- **Sem limites diários**
- **Ideal para produção**

#### Como fazer upgrade:
1. Acesse [Google AI Studio](https://ai.google.dev/)
2. Vá em "Billing" (Cobrança)
3. Ative o plano "Pay as you go"
4. Adicione método de pagamento

#### Estimativa de custos:
- **100 receitas/dia**: ~$0.025/dia = ~$0.75/mês
- **500 receitas/dia**: ~$0.125/dia = ~$3.75/mês
- **1000 receitas/dia**: ~$0.25/dia = ~$7.50/mês

---

### Solução 3: Usar Modelo Mais Leve (Alternativa)

Trocar `gemini-2.5-pro` por `gemini-1.5-flash` (mais barato e rápido):

#### Vantagens:
- Limite maior no tier gratuito
- Mais rápido
- Menor custo no tier pago

#### Desvantagens:
- Qualidade ligeiramente inferior
- Menos "criatividade" nas receitas

#### Como implementar:
```javascript
// backend/server.js - linha 20
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
```

---

## 📈 Monitoramento de Quota

### Verificar quota atual:
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Navegue até "APIs & Services" → "Quotas"
3. Procure por "Generative Language API"

### Logs do backend mostram:
```
📋 ===== CONSTRUÇÃO DO PROMPT =====
⏱️ Iniciando geração de receita com timeout de 45 segundos...
❌ Erro na Gemini API: [429 Too Many Requests]
✅ Fallback ativado: "Arroz Branco Soltinho Perfeito*"
```

---

## 🎯 Recomendação para Produção

### Para o evento Super Minas Foodshow 2025:

#### Opção A: Tier Pago (Ideal)
- ✅ Sem limites
- ✅ Receitas únicas para cada visitante
- ✅ Melhor experiência do usuário
- 💰 Custo baixo (~$5-10/mês dependendo do movimento)

#### Opção B: Fallback Robusto (Econômico)
- ✅ Manter sistema de fallback atual
- ✅ Expandir `fallback-receitas.json` com 50+ receitas pré-geradas
- ✅ Randomizar seleção de fallback
- ⚠️ Receitas não são 100% personalizadas

#### Opção C: Híbrido (Recomendado)
- ✅ Tier pago para requisições principais
- ✅ Fallback como backup para falhas
- ✅ Melhor custo-benefício
- ✅ Máxima confiabilidade

---

## 🛠️ Como Expandir o Fallback

Se quiser manter o sistema gratuito, expanda o arquivo de fallback:

### Estrutura atual:
```json
{
  "receitas": [
    {
      "titulo": "Arroz Branco Soltinho Perfeito",
      "categoria": "acompanhamento",
      // ... mais campos
    }
  ]
}
```

### Recomendação:
- Adicionar 30-50 receitas variadas
- Categorias: almoço, jantar, café da manhã, lanche, sobremesa
- Dificuldades: fácil, médio, difícil
- Randomizar seleção baseada em preferências do usuário

---

## 📝 Status Atual

- ✅ Sistema funcionando com fallback
- ⚠️ Quota gratuita esgotada (50/50)
- ⏳ Reset automático em ~24h
- 🎯 Sistema pronto para upgrade quando necessário

---

## 🚀 Próximos Passos

1. **Curto prazo** (hoje):
   - ✅ Sistema funciona com fallback
   - ⏳ Aguardar reset da quota

2. **Médio prazo** (antes do evento):
   - Decidir entre tier pago ou fallback expandido
   - Se tier pago: fazer upgrade
   - Se fallback: adicionar 40+ receitas ao `fallback-receitas.json`

3. **Longo prazo** (produção):
   - Implementar sistema de cache
   - Monitorar usage da API
   - Otimizar prompts para reduzir custos

---

## 📞 Suporte

- **Google AI Documentation**: https://ai.google.dev/gemini-api/docs
- **Pricing**: https://ai.google.dev/pricing
- **Quotas & Limits**: https://ai.google.dev/gemini-api/docs/rate-limits

---

**Última atualização**: 14/10/2025 22:12 BRT
