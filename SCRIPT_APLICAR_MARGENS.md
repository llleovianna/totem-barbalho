# 🔧 Script de Correção: Aplicar Margens Laterais

## Instruções para aplicar manualmente

### 1. ProductSelection.tsx

**Localizar** (linha ~223):
```tsx
<div className="min-h-screen w-full relative overflow-hidden"
  style={STYLES.container}
>
```

**Dentro do container, localizar** (~linha 240):
```tsx
<div className="relative z-10 h-screen flex flex-col"
  style={{
    padding: 'clamp(0.5rem, 1.5vw, 1rem)',
```

**SUBSTITUIR POR**:
```tsx
<div className="relative z-10 h-screen flex flex-col totem-screen-padding"
  style={{
```

**Localizar botões de navegação** (~linha 950):
```tsx
<div 
  className="flex justify-center items-center gap-4"
```

**SUBSTITUIR POR**:
```tsx
<div 
  className="flex justify-center items-center gap-4 totem-buttons-margin"
```

---

### 2. IngredientSelection.tsx

**Localizar** (linha ~145):
```tsx
<div className="relative z-10 h-screen flex flex-col"
  style={{
    padding: 'clamp(0.5rem, 1.5vw, 1rem)',
```

**SUBSTITUIR POR**:
```tsx
<div className="relative z-10 h-screen flex flex-col totem-screen-padding"
  style={{
```

**Localizar botões de navegação** (~linha 520):
```tsx
<div 
  className="flex justify-center items-center gap-4"
```

**SUBSTITUIR POR**:
```tsx
<div 
  className="flex justify-center items-center gap-4 totem-buttons-margin"
```

---

### 3. RecipeDisplay.tsx

**Localizar** (linha ~450):
```tsx
<div className="min-h-screen w-full relative overflow-hidden"
  style={STYLES.container}
>
```

**Dentro, localizar** (~linha 470):
```tsx
<div className="relative z-10 flex-1 flex flex-col"
  style={{
    padding: 'clamp(0.5rem, 1vw, 1rem)',
```

**SUBSTITUIR POR**:
```tsx
<div className="relative z-10 flex-1 flex flex-col totem-screen-padding"
  style={{
```

**Localizar buttonRow** (~linha 850):
```tsx
buttonRow: {
  display: 'flex',
  justifyContent: 'center',
  gap: 'clamp(0.6rem, 1.2vw, 0.8rem)',
  marginTop: 'clamp(1rem, 2vw, 1.5rem)',
  flexWrap: 'wrap' as const,
}
```

**ADICIONAR classe no uso** (~linha 1200):
```tsx
<div style={STYLES.buttonRow} className="totem-buttons-margin">
```

---

### 4. LoadingScreen.tsx

**Localizar** (linha ~200):
```tsx
<div className="min-h-screen w-full relative overflow-hidden"
  style={STYLES.container}
>
```

**Dentro, localizar** (~linha 220):
```tsx
<div className="relative z-10 h-screen flex flex-col"
  style={{
    padding: 'clamp(0.5rem, 1.5vw, 1rem)',
```

**SUBSTITUIR POR**:
```tsx
<div className="relative z-10 h-screen flex flex-col totem-screen-padding"
  style={{
```

---

## Verificação

Após aplicar as mudanças, verificar:

1. ✅ Todos os componentes importam as classes CSS do `index.css`
2. ✅ Nenhum conteúdo toca as bordas da tela
3. ✅ Botões de navegação têm espaçamento lateral
4. ✅ Layout permanece responsivo

---

## Testes

Execute o sistema e navegue por todas as telas:

```bash
npm start
```

Verifique visualmente:
- SplashScreen → ✅ Margens aplicadas
- ProductSelection → ⏳ Aplicar manualmente
- IngredientSelection → ⏳ Aplicar manualmente
- PreferencesSelection → ✅ Margens aplicadas
- LoadingScreen → ⏳ Aplicar manualmente
- RecipeDisplay → ⏳ Aplicar manualmente
- BrindeScreen → ✅ SEM margens (fullscreen OK)
- IdleVideoScreen → ✅ SEM margens (fullscreen OK)

---

**Tempo estimado**: 5-10 minutos para aplicar todas as mudanças
