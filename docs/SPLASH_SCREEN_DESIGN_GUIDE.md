# 🎨 SplashScreen.tsx - Guia Completo de Design e Estilização

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Paleta de Cores](#paleta-de-cores)
3. [Tipografia](#tipografia)
4. [Layout e Estrutura](#layout-e-estrutura)
5. [Componentes Visuais](#componentes-visuais)
6. [Animações e Efeitos](#animações-e-efeitos)
7. [Responsividade](#responsividade)
8. [Acessibilidade](#acessibilidade)
9. [Padrões de Implementação](#padrões-de-implementação)

---

## 🎯 Visão Geral

O **SplashScreen** é a tela de entrada do totem interativo da Barbalho Alimentos, projetada para capturar a atenção do usuário com um design moderno, sofisticado e interativo. A tela combina elementos visuais dinâmicos com uma interface intuitiva para criar uma experiência envolvente.

### Características Principais:
- **Design Glass Morphism** com transparências e blur effects
- **Animações 3D** interativas no logo card
- **Partículas flutuantes** para dinamismo visual
- **Gradientes complexos** para profundidade
- **Responsividade total** para diferentes resoluções
- **Otimizado para touch** em dispositivos móveis

---

## 🎨 Paleta de Cores

### Cores Primárias
```css
/* Gradient Principal de Fundo */
background: linear-gradient(135deg, #F59D28, #793902)

/* Cores da Marca Barbalho */
--barbalho-red: #C8102E      /* Vermelho principal da marca */
--barbalho-yellow: #FFD23F   /* Amarelo/dourado da marca */
--barbalho-orange: #FFB347   /* Laranja complementar */
```

### Cores Secundárias e de Apoio
```css
/* Textos */
--text-primary: #ffffff      /* Texto principal branco */
--text-secondary: #fff3cd    /* Texto com gradiente suave */
--text-muted: rgba(255, 255, 255, 0.7)  /* Texto com opacidade */

/* Fundos Glass Morphism */
--glass-bg: rgba(255, 255, 255, 0.1)    /* Fundo glass cards */
--glass-border: rgba(255, 255, 255, 0.2) /* Bordas glass */

/* Partículas e Efeitos */
--particle-glow: #FFD23F88   /* Glow das partículas */
--shimmer: rgba(255, 255, 255, 0.35)    /* Efeito shimmer */
```

### Gradientes Específicos
```css
/* Título Principal */
background: linear-gradient(135deg, #ffffff 0%, #fff3cd 100%)

/* Botão de Ação */
background: linear-gradient(45deg, #C8102E, #ff4444)

/* Efeitos de Fundo */
background: radial-gradient(
  circle at 30% 70%, rgba(200, 16, 46, 0.1) 0%, transparent 50%
), radial-gradient(
  circle at 70% 30%, rgba(255, 193, 7, 0.1) 0%, transparent 50%
)
```

---

## ✍️ Tipografia

### Família de Fontes
```css
/* Fonte Principal */
font-family: system-ui, -apple-system, sans-serif  /* Padrão do sistema */

/* Fonte Decorativa */
font-family: 'Italianno', cursive  /* Para frases especiais */
```

### Hierarquia Tipográfica

#### Título Principal (H1)
```css
font-size: clamp(3rem, 5.5vw, 4rem)  /* 48px - 64px responsivo */
font-weight: 700  /* Bold */
line-height: 1.1
text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5)
background-clip: text  /* Aplicação de gradiente */
-webkit-text-fill-color: transparent
```

#### Subtítulo (H2)
```css
font-size: clamp(1.1rem, 2.8vw, 1.8rem)  /* 17.6px - 28.8px */
font-weight: 600  /* Semi-bold */
text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3)
opacity: 0.9
```

#### Títulos de Cards (H3)
```css
font-size: 2rem  /* 32px fixo */
font-weight: 700  /* Bold */
color: #ffffff
```

#### Texto Descritivo
```css
font-size: clamp(0.9rem, 2.2vw, 1.1rem)  /* 14.4px - 17.6px */
color: rgba(255, 255, 255, 0.8)  /* Branco com transparência */
line-height: 1.5  /* Boa legibilidade */
```

#### Frase Decorativa (Italianno)
```css
font-family: 'Italianno', cursive
font-size: 3.5rem  /* 56px */
font-weight: 700
opacity: 0.9
text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4)
```

#### Botão Principal
```css
font-size: clamp(1.1rem, 2.8vw, 1.6rem)  /* 17.6px - 25.6px */
font-weight: 700
text-transform: uppercase
letter-spacing: 0.05em  /* Espaçamento entre letras */
```

---

## 📐 Layout e Estrutura

### Container Principal
```css
.splash-screen {
  min-height: 100vh  /* Altura total da viewport */
  width: 100%
  position: relative
  overflow: hidden  /* Previne scroll horizontal */
  display: flex
  align-items: center
  justify-content: center
  padding: 0.5rem  /* 8px de padding mínimo */
}
```

### Container de Conteúdo
```css
.main-content {
  width: 100%
  max-width: 112rem  /* 1792px - limitação máxima */
  margin: 0 auto  /* Centralização */
  text-align: center
  padding: 1rem  /* 16px horizontal */
  position: relative
  z-index: 10  /* Acima dos efeitos de fundo */
}
```

### Espaçamentos Verticais
```css
/* Entre seções principais */
margin-top: -8rem     /* Logo para título: -128px */
margin-bottom: 2rem   /* Título para cards: 32px */
margin-top: 3rem      /* Cards para botão: 48px */
margin-top: 4rem      /* Botão para frase: 64px */

/* Logo card */
margin-bottom: 10rem  /* Logo para próximo elemento: 160px */
```

### Grid de Feature Cards
```css
.totem-grid-1 {
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
  gap: 0.5rem  /* 8px entre cards */
  margin: 3rem 7rem  /* Margens laterais: 112px */
}
```

---

## 🧩 Componentes Visuais

### 1. Logo Card 3D

#### Dimensões e Estrutura
```css
.logo-card {
  width: clamp(340px, 45vw, 520px)    /* Responsivo: 340-520px */
  height: clamp(260px, 32vw, 340px)   /* Responsivo: 260-340px */
  min-width: 220px   /* Mínimo absoluto */
  min-height: 220px  /* Mínimo absoluto */
  
  /* Glass Morphism */
  background: rgba(255, 255, 255, 0.1)
  backdrop-filter: blur(10px)
  
  /* Bordas e Sombras */
  border-radius: 24px
  border: 1px solid rgba(255, 255, 255, 0.2)
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),     /* Sombra principal */
    0 0 60px rgba(200, 16, 46, 0.3)      /* Glow colorido */
  
  /* Espaçamento interno */
  padding: 0.7rem  /* 11.2px - compacto */
  
  /* 3D */
  transform-style: preserve-3d
  perspective: 1000px
}
```

#### Efeitos Visuais
```css
/* Borda superior decorativa */
.decorative-border {
  position: absolute
  top: 0
  left: 0
  right: 0
  height: 1px
  background: linear-gradient(
    90deg, 
    transparent, 
    rgba(255, 193, 7, 0.8), 
    transparent
  )
}

/* Logo dentro do card */
.logo-image {
  width: 100%
  height: auto
  max-width: 800px  /* Bem grande para impacto */
  margin: 0 auto
  display: block
}
```

### 2. Feature Cards

#### Estrutura Base
```css
.feature-card {
  /* Glass Morphism */
  background: rgba(255, 255, 255, 0.1)
  backdrop-filter: blur(10px)
  
  /* Bordas */
  border-radius: 24px  /* Bordas bem arredondadas */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1)
  
  /* Espaçamento */
  padding: 1rem  /* 16px interno */
  margin: 2rem 7rem  /* 32px top, 112px laterais */
  
  /* Transições */
  transition: transform 0.3s ease
}

.feature-card:hover {
  transform: translateY(-2px)  /* Leve elevação */
}
```

#### Ícones dos Cards
```css
.feature-icon {
  font-size: 2.25rem  /* 36px */
  margin-bottom: 0.75rem  /* 12px */
  
  /* Cores específicas */
  color: #FFD23F  /* Utensílios */
  color: #FFB347  /* Pão e IA */
}
```

### 3. Botão Principal

#### Estilização Completa
```css
.start-button {
  /* Cores e Gradiente */
  background: linear-gradient(45deg, #C8102E, #ff4444)
  color: white
  
  /* Forma */
  border: none
  border-radius: 50px  /* Totalmente arredondado */
  
  /* Dimensões Responsivas */
  min-width: clamp(220px, 28vw, 280px)
  min-height: clamp(55px, 7vh, 70px)
  padding: clamp(0.8rem, 1.8vw, 1.2rem) clamp(1.8rem, 4.5vw, 2.5rem)
  
  /* Tipografia */
  font-size: clamp(1.1rem, 2.8vw, 1.6rem)
  font-weight: 700
  text-transform: uppercase
  letter-spacing: 0.05em
  
  /* Layout Interno */
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 0.8rem  /* 12.8px entre ícone e texto */
  
  /* Sombras e Efeitos */
  box-shadow: 0 10px 30px rgba(200, 16, 46, 0.4)
  
  /* Interatividade */
  cursor: pointer
  touch-action: manipulation
  -webkit-tap-highlight-color: transparent
  
  /* Transições */
  transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)
  
  /* Posicionamento */
  margin-top: 4rem  /* 64px do elemento anterior */
}

/* Estados Interativos */
.start-button:active {
  transform: translateY(-2px) scale(0.95)
}
```

---

## ✨ Animações e Efeitos

### 1. Partículas Flutuantes

#### Animação Principal
```css
@keyframes particle-float-infinite {
  0% {
    transform: translateY(0) scale(1) rotate(var(--rotate, 0deg));
    opacity: 0.7;
  }
  20% { opacity: 1; }
  50% {
    transform: translateY(-40px) scale(1.08) rotate(var(--rotate, 0deg));
    opacity: 0.85;
  }
  80% { opacity: 1; }
  100% {
    transform: translateY(0) scale(1) rotate(var(--rotate, 0deg));
    opacity: 0.7;
  }
}
```

#### Configuração das Partículas
```javascript
// 12 triângulos distribuídos estrategicamente
const particles = [
  // Cantos superiores
  { left: '8%', top: '10%', rotate: 18, size: 32, delay: 0, duration: 18 },
  { left: '18%', top: '6%', rotate: -12, size: 22, delay: 1.2, duration: 14 },
  
  // Cantos inferiores  
  { left: '10%', top: '88%', rotate: 45, size: 26, delay: 3.5, duration: 16 },
  { left: '20%', top: '92%', rotate: -30, size: 18, delay: 4.2, duration: 12 },
  
  // Laterais
  { left: '2%', top: '50%', rotate: 12, size: 24, delay: 1.8, duration: 15 },
  { left: '98%', top: '60%', rotate: -8, size: 22, delay: 3.3, duration: 13 },
  
  // ... outras posições
]
```

### 2. Efeito Shimmer

#### Animação do Brilho
```css
@keyframes shimmer-loop {
  0% {
    opacity: 0.15;
    transform: translateX(-100%) skewX(-12deg);
  }
  10% { opacity: 0.35; }
  50% {
    opacity: 0.5;
    transform: translateX(100%) skewX(-12deg);
  }
  90% { opacity: 0.35; }
  100% {
    opacity: 0.15;
    transform: translateX(-100%) skewX(-12deg);
  }
}

/* Aplicação */
.shimmer-effect {
  background: linear-gradient(
    100deg, 
    transparent 30%, 
    rgba(255,255,255,0.35) 50%, 
    transparent 70%
  );
  animation: shimmer-loop 5s cubic-bezier(0.4,0,0.2,1) infinite;
}
```

### 3. Animação 3D Idle do Logo

#### Movimento Contínuo
```javascript
// Movimento suave usando seno/cosseno
const rotateX = Math.sin(elapsed * 0.7) * 2.5; // até 2.5 graus
const rotateY = Math.cos(elapsed * 0.5) * 2.5; // até 2.5 graus
const translateZ = 6 + Math.sin(elapsed * 0.9) * 2; // profundidade variável

// Parâmetros de timing
- elapsed * 0.7  // Velocidade rotação X
- elapsed * 0.5  // Velocidade rotação Y  
- elapsed * 0.9  // Velocidade profundidade
```

### 4. Transições e Estados

#### Hover no Logo Card
```css
.logo-card:hover {
  /* Remove transições para resposta imediata */
  transition: none;
  
  /* Profundidade máxima */
  --inner-depth: 28px;
}
```

#### Interações Touch/Mouse
```css
/* Responsividade de clique */
.interactive-element:active {
  transform: translateY(-2px) scale(0.95);
}

/* Suavização de transições */
transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 📱 Responsividade

### Breakpoints e Estratégias

#### Função clamp() - Escalonamento Fluido
```css
/* Estratégia principal para todos os tamanhos */
font-size: clamp(mín, preferido, máx)

/* Exemplos aplicados */
font-size: clamp(3rem, 5.5vw, 4rem)      /* Título: 48-64px */
font-size: clamp(1.1rem, 2.8vw, 1.8rem) /* Subtítulo: 17.6-28.8px */
width: clamp(340px, 45vw, 520px)         /* Logo card: 340-520px */
```

#### Ajustes por Viewport

##### Mobile (< 768px)
```css
/* Logo card menor */
width: clamp(320px, 90vw, 400px)

/* Margens reduzidas */
margin-left: 2rem
margin-right: 2rem

/* Texto mais compacto */
font-size: clamp(2rem, 8vw, 3rem)
```

##### Tablet (768px - 1024px)
```css
/* Balanceamento intermediário */
width: clamp(400px, 50vw, 480px)
margin-left: 4rem
margin-right: 4rem
```

##### Desktop (> 1024px)
```css
/* Tamanhos máximos */
width: clamp(480px, 45vw, 520px)
margin-left: 7rem
margin-right: 7rem
```

### Adaptações Touch

#### Áreas de Toque
```css
/* Mínimos para usabilidade touch */
min-height: 44px  /* Recomendação iOS */
min-width: 44px   /* Área mínima de toque */

/* Botão principal */
min-height: clamp(55px, 7vh, 70px)  /* Generoso para touch */
```

#### Feedback Visual
```css
/* Remoção de highlights padrão */
-webkit-tap-highlight-color: transparent

/* Manipulação de toque */
touch-action: manipulation

/* Estados ativos mais pronunciados */
:active {
  transform: scale(0.95) translateY(-2px)
}
```

---

## ♿ Acessibilidade

### Semântica HTML
```html
<!-- Hierarquia clara de headings -->
<h1>SUPER MINAS FOODSHOW 2025</h1>
<h2>Crie receitas inéditas...</h2>
<h3>Receitas Inéditas</h3>

<!-- Roles e labels apropriados -->
<div role="button" aria-label="Logo Barbalho Interativo" tabindex="0">
  <img alt="Barbalho Alimentos" loading="eager" />
</div>
```

### Contrastes e Legibilidade
```css
/* Contrastes altos para texto */
color: #ffffff  /* Branco em fundo escuro */
text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5)  /* Sombra para legibilidade */

/* Elementos interativos claramente identificáveis */
cursor: pointer
outline: 2px solid transparent  /* Para foco via teclado */
```

### Navegação por Teclado
```css
/* Indicadores de foco */
:focus-visible {
  outline: 2px solid #FFD23F
  outline-offset: 2px
}

/* Tabindex apropriado */
tabindex="0"  /* Incluído na navegação */
tabindex="-1" /* Excluído da navegação */
```

---

## 🛠️ Padrões de Implementação

### 1. Estrutura de Estilos

#### Organização em Constantes
```javascript
// Consolidação de estilos reutilizáveis
const STYLES = {
  container: { /* estilos do container */ },
  logoCard: { /* estilos do logo card */ },
  featureCard: { /* estilos dos cards */ },
  startButton: { /* estilos do botão */ }
}

// Animações separadas
const CSS_ANIMATIONS = {
  particleFloat: `@keyframes particle-float-infinite { ... }`,
  shimmerLoop: `@keyframes shimmer-loop { ... }`
}
```

### 2. Memoização de Performance

#### Estilos Dinâmicos
```javascript
// Uso de useMemo para estilos que dependem de estado
const logoCardTransformStyle = useMemo(() => ({
  ...STYLES.logoCard,
  transition: isHovering ? 'none' : 'all 600ms cubic-bezier(0.22, 1, 0.36, 1)',
  transform: `
    rotateX(${cardTransform.rotateX}deg) 
    rotateY(${cardTransform.rotateY}deg) 
    translateZ(${cardTransform.translateZ}px)
  `,
}), [cardTransform, isHovering]);
```

### 3. Event Handling Otimizado

#### Consolidação de Handlers
```javascript
// Handler único para múltiplos eventos
const handleInteraction = useCallback((e, type) => {
  switch (type) {
    case 'mouseenter': /* lógica */ break;
    case 'mouseleave': /* lógica */ break;
    case 'mousemove': /* lógica */ break;
    // ...
  }
}, [dependencies]);
```

### 4. Componentização

#### Componentes Auxiliares
```javascript
// Separação lógica em sub-componentes
const FloatingParticles = () => (/* JSX específico */);
const LogoCardParticles = () => (/* JSX específico */);
const FeatureCard = ({ icon, title, description }) => (/* JSX específico */);
```

---

## 📝 Diretrizes para Implementação

### ✅ Boas Práticas Aplicadas

1. **Performance First**
   - Uso de `requestAnimationFrame` para animações
   - Memoização de estilos pesados
   - Event listeners otimizados

2. **Responsividade Fluida**
   - `clamp()` para escalonamento contínuo
   - Viewport units para adaptação automática
   - Breakpoints implícitos através de media queries CSS

3. **Acessibilidade Nativa**
   - Semântica HTML apropriada
   - Navegação por teclado funcional
   - Alto contraste e legibilidade

4. **Manutenibilidade**
   - Separação clara de concerns
   - Constantes centralizadas
   - Código autodocumentado

### 🚫 Anti-Padrões Evitados

1. **CSS-in-JS Inline Excessivo**
   - ❌ Evitado: estilos inline repetitivos
   - ✅ Aplicado: constantes reutilizáveis

2. **Animações Pesadas**
   - ❌ Evitado: múltiplas animações em elementos pesados
   - ✅ Aplicado: animações otimizadas com `will-change`

3. **Event Listeners Desnecessários**
   - ❌ Evitado: handlers separados para eventos similares
   - ✅ Aplicado: handler consolidado por tipo

---

## 🎯 Conclusão

O SplashScreen estabelece um padrão visual e técnico robusto que deve ser replicado em todo o projeto:

- **Estética premium** com glass morphism e efeitos 3D
- **Performance otimizada** com técnicas modernas
- **Responsividade total** para qualquer dispositivo
- **Acessibilidade completa** seguindo padrões web
- **Código limpo** e facilmente manutenível

Este componente serve como **referência definitiva** para o design system do projeto, garantindo consistência visual e qualidade técnica em todas as telas subsequentes.

---

*Documentação criada por: Assistente IA*  
*Data: 21 de Setembro de 2025*  
*Versão: 1.0*