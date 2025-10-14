# 🧪 Guia de Testes - Preferências de Receitas

## 🚀 Como Testar as Correções

### Pré-requisitos
1. Backend e Frontend devem estar rodando
2. Ter console do backend aberto para ver os logs

---

## 📋 Teste 1: Vegano + Ingrediente com Carne

### Passos:
1. **SplashScreen**: Clique em "Começar"
2. **ProductSelection**: Selecione 2-3 produtos Barbalho
3. **IngredientSelection**: 
   - Selecione **"Frango"** ou **"Carne Bovina"**
   - Clique em "Avançar"
4. **PreferencesSelection**:
   - Dificuldade: Qualquer
   - Tempo: Qualquer
   - Porções: Qualquer
   - Tipo de Refeição: Qualquer
   - **RESTRIÇÕES: Marque "Vegano" ✓**
   - Clique em "Gerar Receita"

### ✅ Resultado Esperado:
- **No console do backend**, você deve ver:
  ```
  ⚠️ CONFLITOS DETECTADOS: [ 'Vegano: encontrados produtos de origem animal (frango)' ]
  ```
- **Na receita gerada**:
  - NÃO deve conter frango/carne
  - Deve ter substitutos vegetais (tofu, grão-de-bico, lentilha, cogumelos)

---

## 📋 Teste 2: Receita Fácil vs Difícil

### Teste 2A: Receita FÁCIL
1. **SplashScreen**: Clique em "Começar"
2. **ProductSelection**: Selecione 2-3 produtos
3. **IngredientSelection**: Selecione ingredientes simples
4. **PreferencesSelection**:
   - **Dificuldade: Fácil ⭐**
   - **Tempo: 15min ⚡**
   - Porções: 4 pessoas
   - Tipo: Almoço
5. Gere a receita

### ✅ Resultado Esperado (Fácil):
- **Console do backend**:
  ```
  📊 Diretrizes de Dificuldade: Receita FÁCIL - Use 6-8 passos SIMPLES e DIRETOS...
  ```
- **Receita gerada**:
  - **6-8 passos** simples e diretos
  - Técnicas básicas: "Corte a cebola", "Frite o alho", "Misture tudo"
  - Linguagem simples e direta

### Teste 2B: Receita DIFÍCIL
1. Repita os passos acima, mas escolha:
   - **Dificuldade: Difícil ⭐⭐⭐**
   - **Tempo: 1h+ 🕐**

### ✅ Resultado Esperado (Difícil):
- **Console do backend**:
  ```
  📊 Diretrizes de Dificuldade: Receita DIFÍCIL - Use 10-15 passos MUITO DETALHADOS...
  ```
- **Receita gerada**:
  - **10-15 passos** muito detalhados
  - Técnicas avançadas: "Faça uma redução de vinho", "Monte em camadas", "Finalize com ervas frescas"
  - Instruções complexas e profissionais

---

## 📋 Teste 3: Ajuste de Porções

### Teste 3A: 1 PESSOA
1. **SplashScreen**: Clique em "Começar"
2. **ProductSelection**: Selecione produtos
3. **IngredientSelection**: Selecione ingredientes
4. **PreferencesSelection**:
   - Dificuldade: Qualquer
   - Tempo: Qualquer
   - **Porções: 1 pessoa 👤**
   - Tipo: Qualquer
5. Gere a receita

### ✅ Resultado Esperado (1 pessoa):
- **Console do backend**:
  ```
  👥 Diretrizes de Porções: Ajuste TODAS as quantidades para 1 PESSOA (reduza drasticamente as medidas).
  ```
- **Receita gerada - Ingredientes**:
  - "1/2 cebola pequena"
  - "1 colher de sopa de óleo"
  - "100g de arroz"
  - "1 dente de alho"
  - Quantidades **reduzidas** drasticamente

### Teste 3B: 6+ PESSOAS
1. Repita, mas escolha:
   - **Porções: 6 pessoas 👨‍👩‍👧‍👦👥** ou **8+ pessoas 👥👥**

### ✅ Resultado Esperado (6+ pessoas):
- **Console do backend**:
  ```
  👥 Diretrizes de Porções: Ajuste TODAS as quantidades para 6+ PESSOAS (aumente significativamente as medidas, use panelas grandes).
  ```
- **Receita gerada - Ingredientes**:
  - "3 cebolas grandes"
  - "1/2 xícara de óleo"
  - "1kg de arroz"
  - "1 cabeça de alho"
  - Instruções: "Use uma panela grande"

---

## 📋 Teste 4: Sem Glúten + Macarrão

### Passos:
1. **SplashScreen**: Clique em "Começar"
2. **ProductSelection**: Selecione produtos
3. **IngredientSelection**: 
   - Selecione **"Macarrão"** ou **"Farinha de Trigo"**
4. **PreferencesSelection**:
   - **RESTRIÇÕES: Marque "Sem Glúten" ✓ 🌾**
5. Gere a receita

### ✅ Resultado Esperado:
- **Console do backend**:
  ```
  ⚠️ CONFLITOS DETECTADOS: [ 'Sem Glúten: encontrados produtos com glúten (macarrão)' ]
  ```
- **Receita gerada**:
  - NÃO deve conter macarrão tradicional
  - Substitutos: "macarrão de arroz", "macarrão sem glúten", "farinha de arroz"

---

## 📋 Teste 5: Sem Lactose + Queijo

### Passos:
1. **SplashScreen**: Clique em "Começar"
2. **ProductSelection**: Selecione produtos
3. **IngredientSelection**: 
   - Selecione **"Queijo"** ou **"Leite"**
4. **PreferencesSelection**:
   - **RESTRIÇÕES: Marque "Sem Lactose" ✓ 🥛**
5. Gere a receita

### ✅ Resultado Esperado:
- **Console do backend**:
  ```
  ⚠️ CONFLITOS DETECTADOS: [ 'Sem Lactose: encontrados laticínios (queijo)' ]
  ```
- **Receita gerada**:
  - NÃO deve conter queijo/leite
  - Substitutos: "queijo vegano", "leite de amêndoas", "creme de castanha"

---

## 📋 Teste 6: Múltiplas Restrições

### Passos:
1. Selecione produtos e ingredientes variados
2. **PreferencesSelection**:
   - **RESTRIÇÕES: Marque DUAS ou MAIS**:
     - ✓ Vegano
     - ✓ Sem Glúten
     - ✓ Sem Lactose
3. Gere a receita

### ✅ Resultado Esperado:
- **Console do backend**: Deve listar TODOS os conflitos detectados
- **Receita gerada**: Deve respeitar TODAS as restrições simultaneamente

---

## 🔍 Como Interpretar os Logs do Backend

Ao gerar uma receita, você verá no console do backend:

```
📋 ===== CONSTRUÇÃO DO PROMPT =====
🥘 Produtos Barbalho: Tempero Completo Barbalho, Molho de Tomate Barbalho
🧂 Ingredientes extras: Frango, Cebola, Alho
⚙️ Preferências: {
  difficulty: 'Difícil',
  time: '1h+',
  portions: '6 pessoas',
  mealType: 'jantar'
}
🚫 Restrições (original): [ 'vegan' ]
🌐 Restrições (traduzido): Vegano
⚠️ CONFLITOS DETECTADOS: [
  'Vegano: encontrados produtos de origem animal (frango)'
]
📊 Diretrizes de Dificuldade: Receita DIFÍCIL - Use 10-15 passos MUITO DETALHADOS e ELABORADOS. Inclua técnicas avançadas (redução, sous-vide, montagem complexa, multitasking). Tempo de preparo real: 1+ hora. Pode exigir equipamentos específicos e ingredientes premium.
👥 Diretrizes de Porções: Ajuste TODAS as quantidades para 6+ PESSOAS (aumente significativamente as medidas, use panelas grandes).
===================================
```

---

## ✅ Checklist de Validação

Após cada teste, verifique:

- [ ] **Logs aparecem no console do backend** com detalhes completos
- [ ] **Conflitos são detectados** quando há ingredientes incompatíveis com restrições
- [ ] **Dificuldade afeta o número de passos** (Fácil: 6-8, Médio: 8-10, Difícil: 10-15)
- [ ] **Porções afetam as quantidades** (1 pessoa: reduzido, 6+: aumentado)
- [ ] **Tempo de preparo na receita** corresponde ao selecionado (15min, 30min, 1h+)
- [ ] **Tipo de refeição** é respeitado (café da manhã, almoço, jantar, lanche, sobremesa)
- [ ] **Restrições são respeitadas** (sem carnes para vegano, sem glúten, sem lactose)

---

## 🐛 O Que Fazer Se Algo Não Funcionar

### Problema: Logs não aparecem
**Solução**: 
- Verifique se o backend está rodando
- Confirme que está olhando o terminal/console correto do backend (não frontend)

### Problema: Receita ignora restrições
**Solução**:
- Verifique os logs do backend para confirmar que as restrições foram enviadas
- Verifique se há `⚠️ CONFLITOS DETECTADOS` nos logs
- Se o Gemini ainda ignorar, pode ser necessário tornar o prompt ainda mais enfático

### Problema: Dificuldade não afeta passos
**Solução**:
- Verifique se as diretrizes de dificuldade aparecem nos logs
- O Gemini pode ocasionalmente ignorar - teste algumas vezes
- Se persistir, ajuste a função `getDifficultyGuidelines()` para ser mais explícita

### Problema: Quantidades não mudam com porções
**Solução**:
- Verifique se as diretrizes de porções aparecem nos logs
- Compare receitas geradas com porções diferentes lado a lado
- Ajuste a função `getPortionGuidelines()` se necessário

---

## 📊 Resultados Esperados Gerais

✅ **O sistema agora deve**:
1. Detectar e alertar sobre conflitos entre ingredientes e restrições
2. Gerar receitas fáceis com menos passos que receitas difíceis
3. Ajustar quantidades proporcionalmente ao número de porções
4. Respeitar restrições alimentares substituindo ingredientes conflitantes
5. Manter o tempo de preparo exatamente como selecionado
6. Criar receitas adequadas ao tipo de refeição escolhido

---

## 📞 Suporte

Se encontrar problemas:
1. Capture os logs do backend
2. Tire screenshot da receita gerada
3. Anote exatamente quais opções foram selecionadas
4. Compare com os resultados esperados neste guia

**Boa sorte nos testes!** 🎉
