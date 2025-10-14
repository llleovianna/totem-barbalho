# ✅ Checklist de Testes Visuais

## 🎯 Guia Rápido para Validação

Execute `npm start` e siga este checklist:

---

## 1. SplashScreen ✅

### Verificar:
- [ ] Logo Barbalho centralizado
- [ ] Card 3D com efeito de profundidade
- [ ] Margens laterais visíveis (conteúdo não toca bordas)
- [ ] Botão "COMEÇAR" bem posicionado
- [ ] Título "SUPER MINAS FOODSHOW 2025" legível
- [ ] Partículas flutuantes animadas

### Margem Esperada:
- **Esquerda**: ~16-24px
- **Direita**: ~16-24px

---

## 2. ProductSelection ✅

### Verificar:
- [ ] Logo Barbalho no topo
- [ ] Título "Escolha os Produtos Barbalho" centralizado
- [ ] Grid de produtos não toca bordas laterais
- [ ] Botão "Voltar" com espaço à esquerda
- [ ] Botão "Continuar" com espaço à direita
- [ ] Modal de produtos selecionados funciona

### Margem Esperada:
- **Container**: ~16-24px cada lado
- **Botões**: ~16-24px cada lado

---

## 3. IngredientSelection ⏳

### Verificar:
- [ ] Logo Barbalho no topo
- [ ] Categorias de ingredientes visíveis
- [ ] Grid não toca bordas laterais
- [ ] Botões de navegação com espaçamento
- [ ] Modal de ingredientes customizados funciona

### Status: Margens NÃO aplicadas ainda
**Ação necessária**: Seguir `SCRIPT_APLICAR_MARGENS.md`

---

## 4. PreferencesSelection ⭐ REFATORADO ✅

### Verificar Visual Premium:

#### Margens:
- [ ] Container principal tem margens laterais
- [ ] Botões de navegação têm espaço nas bordas

#### Contraste Melhorado:
- [ ] Cards têm gradientes visíveis
- [ ] Sombras 3D perceptíveis
- [ ] Bordas mais definidas

#### Selecionados - O DESTAQUE PRINCIPAL:

**Dificuldade**:
- [ ] **Fácil** → Borda VERDE `#3BB273` + brilho verde pulsante
- [ ] **Médio** → Borda AMARELA `#FFD23F` + brilho amarelo pulsante
- [ ] **Difícil** → Borda VERMELHA `#ef4444` + brilho vermelho pulsante

**Tempo**:
- [ ] Selecionado → Borda laranja `#FFB347` + gradiente + brilho pulsante

**Porções**:
- [ ] Selecionado → Borda laranja `#FFB347` + gradiente + brilho pulsante

**Tipo de Refeição**:
- [ ] Selecionado → Borda laranja `#FFB347` + gradiente + brilho pulsante

**Restrições Alimentares**:
- [ ] Selecionado → Borda laranja + checkbox visível

#### Animações:
- [ ] Selecionados PULSAM sutilmente (escala 1.05 → 1.06)
- [ ] Brilho aumenta e diminui continuamente
- [ ] Hover nos cards funciona

#### Cores Esperadas:
```
Fácil (Selecionado):
  ✅ Borda: Verde brilhante
  ✅ Fundo: Gradiente verde transparente
  ✅ Sombra: Glow verde animado

Médio (Selecionado):
  ✅ Borda: Amarelo vibrante
  ✅ Fundo: Gradiente amarelo transparente
  ✅ Sombra: Glow amarelo animado

Difícil (Selecionado):
  ✅ Borda: Vermelho intenso
  ✅ Fundo: Gradiente vermelho transparente
  ✅ Sombra: Glow vermelho animado
```

---

## 5. LoadingScreen ⏳

### Verificar:
- [ ] Spinner animado centralizado
- [ ] Mensagens criativas rotativas
- [ ] Cards de features visíveis
- [ ] Margens laterais aplicadas

### Status: Margens NÃO aplicadas ainda
**Ação necessária**: Seguir `SCRIPT_APLICAR_MARGENS.md`

---

## 6. RecipeDisplay ⏳

### Verificar:
- [ ] Logo Barbalho no header
- [ ] Card da receita centralizado
- [ ] Ingredientes e instruções legíveis
- [ ] Botões com espaçamento adequado
- [ ] QR Code centralizado
- [ ] Margens laterais aplicadas

### Status: Margens NÃO aplicadas ainda
**Ação necessária**: Seguir `SCRIPT_APLICAR_MARGENS.md`

---

## 7. BrindeScreen ✅ (Fullscreen OK)

### Verificar:
- [ ] Carrossel de prêmios em tela cheia
- [ ] Animação de giro funcionando
- [ ] Resultado final exibido corretamente
- [ ] **SEM margens** (design fullscreen intencional)

---

## 8. IdleVideoScreen ✅ (Fullscreen OK)

### Verificar:
- [ ] Vídeo em tela cheia
- [ ] Botão "Tocar para começar" centralizado
- [ ] **SEM margens** (vídeo fullscreen intencional)

---

## 🐛 Teste do Problema Gemini API

### Cenário: Quota Excedida

1. **Gere uma receita** em PreferencesSelection
2. **Observe os logs do backend**:
```
❌ Erro na Gemini API: [429 Too Many Requests]
✅ Fallback ativado: "Arroz Branco Soltinho Perfeito*"
```

3. **Verifique na tela**:
   - [ ] Receita foi exibida (fallback)
   - [ ] Título tem asterisco (*) no final
   - [ ] Sistema funcionou normalmente

4. **Validação**:
   - ✅ Fallback funcionou
   - ✅ Usuário não percebeu erro
   - ✅ Experiência preservada

---

## 📊 Tabela de Validação Rápida

| Tela | Margens | Visual | Funcional | Status |
|------|---------|--------|-----------|--------|
| SplashScreen | ✅ | ✅ | ✅ | Pronto |
| ProductSelection | ✅ | ✅ | ✅ | Pronto |
| IngredientSelection | ⏳ | ✅ | ✅ | Aplicar margens |
| **PreferencesSelection** | ✅ | ⭐ Premium | ✅ | **Refatorado** |
| LoadingScreen | ⏳ | ✅ | ✅ | Aplicar margens |
| RecipeDisplay | ⏳ | ✅ | ✅ | Aplicar margens |
| BrindeScreen | N/A | ✅ | ✅ | Fullscreen OK |
| IdleVideoScreen | N/A | ✅ | ✅ | Fullscreen OK |

**Legenda**:
- ✅ = Implementado
- ⏳ = Pendente (opcional)
- ⭐ = Destaque especial
- N/A = Não aplicável

---

## 🎨 Teste Visual Especial - PreferencesSelection

### Sequência de Teste Recomendada:

1. **Entre na tela** PreferencesSelection
2. **Observe os cards** antes de selecionar:
   - Gradientes sutis?
   - Sombras 3D?
   - Bordas bem definidas?

3. **Selecione "Fácil"** em Dificuldade:
   - Borda ficou VERDE?
   - Está pulsando?
   - Brilho verde visível?

4. **Troque para "Médio"**:
   - Borda mudou para AMARELO?
   - Animação transferiu?

5. **Troque para "Difícil"**:
   - Borda ficou VERMELHA?
   - Brilho mais intenso?

6. **Selecione opções em outras categorias**:
   - Bordas laranjas?
   - Pulso contínuo?
   - Múltiplas sombras?

7. **Compare com cards não selecionados**:
   - Contraste forte?
   - Selecionados se destacam?

### Resultado Esperado:
✅ Selecionados são **IMPOSSÍVEIS DE IGNORAR**  
✅ Cores vibrantes e dinâmicas  
✅ Animação suave e elegante  
✅ Visual premium e moderno  

---

## 🚨 Problemas Conhecidos

### 1. Quota Gemini Excedida
**Sintoma**: Receitas não geram (erro 429)  
**Solução**: ✅ Fallback automático ativo  
**Ação**: Aguardar 24h ou fazer upgrade

### 2. Imagens 404
**Sintoma**: Imagens de produtos não carregam  
**Impacto**: Visual, não funcional  
**Ação**: Verificar caminhos em `productos-data.ts`

---

## ✅ Critérios de Aceitação

### Mínimo para Produção:
- ✅ Margens aplicadas em pelo menos 3 telas principais
- ✅ PreferencesSelection com visual premium
- ✅ Sistema de fallback funcionando
- ✅ Navegação fluida entre telas

### Ideal para Evento:
- ✅ Margens em todas as telas
- ✅ Quota Gemini resolvida (upgrade ou aguardar)
- ✅ Imagens de produtos corrigidas
- ✅ Testes em tela vertical 1080x1920

---

## 📞 Se Algo Não Funcionar

### Visual não mudou?
1. Limpe cache do navegador (Ctrl+Shift+Delete)
2. Recompile: `npm start`
3. Confira que `index.css` tem as classes `.totem-screen-padding`

### Cores não aparecem?
1. Verifique se está em PreferencesSelection
2. Confirme que você SELECIONOU uma opção
3. Espere a animação (2 segundos)

### Margens não visíveis?
1. Use DevTools (F12)
2. Inspecione elemento
3. Verifique se classe foi aplicada
4. Confirme padding left/right no console

---

**Última atualização**: 14/10/2025 23:10 BRT  
**Pronto para testes!** 🚀
