# 🎨 Totem Interativo Barbalho - Design System Completo

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Paleta de Cores](#paleta-de-cores)
3. [Tipografia](#tipografia)
4. [Layout e Estrutura](#layout-e-estrutura)
5. [Componentes Base](#componentes-base)
6. [Animações e Efeitos](#animações-e-efeitos)
7. [Assets e Imagens](#assets-e-imagens)
8. [Responsividade](#responsividade)
9. [Acessibilidade](#acessibilidade)
10. [Padrões de Implementação](#padrões-de-implementação)

---

## 🎯 Visão Geral

Este design system foi desenvolvido para o **Totem Interativo da Barbalho Alimentos**, criando uma experiência visual premium e moderna. O sistema combina **Glass Morphism**, **gradientes complexos**, **animações 3D**, e uma **paleta de cores corporativa** para criar uma interface envolvente e profissional.

### Características Principais:
- **Glass Morphism Design** com transparências e blur effects
- **Gradientes de fundo corporativos** em tons marrom/laranja
- **Animações suaves** com cubic-bezier otimizadas
- **Responsividade total** usando clamp() e viewport units
- **Touch-first interface** otimizada para totems
- **Assets visuais integrados** (logos, personagens, produtos)

---

## 🎨 Paleta de Cores

### Cores Corporativas Barbalho
```css
/* Cores Primárias da Marca */
--barbalho-red: #C8102E        /* Vermelho principal da marca */
--barbalho-yellow: #FFD23F     /* Amarelo/dourado da marca */
--barbalho-orange: #FFB347     /* Laranja complementar */

/* Gradientes de Fundo */
--background-primary: linear-gradient(135deg, #F59D28, #793902)
--background-effects: radial-gradient(
  circle at 30% 70%, rgba(200, 16, 46, 0.1) 0%, transparent 50%
), radial-gradient(
  circle at 70% 30%, rgba(255, 193, 7, 0.1) 0%, transparent 50%
)
```

### Cores de Interface
```css
/* Textos */
--text-primary: #ffffff                    /* Texto principal branco */
--text-secondary: #fff3cd                  /* Texto com gradiente suave */
--text-muted: rgba(255, 255, 255, 0.8)    /* Texto com opacidade */
--text-description: rgba(255, 255, 255, 0.9) /* Texto descritivo */

/* Glass Morphism */
--glass-bg: rgba(255, 255, 255, 0.1)      /* Fundo glass cards */
--glass-border: rgba(255, 255, 255, 0.2)  /* Bordas glass */
--glass-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) /* Sombra glass cards */

/* Estados de Input */
--input-bg: rgba(255, 255, 255, 0.1)      /* Fundo inputs */
--input-border: rgba(255, 255, 255, 0.2)  /* Borda normal */
--input-border-error: #ef4444             /* Borda erro */
--input-focus: #FFB347                    /* Foco laranja */

/* Estados de Botão */
--button-primary: linear-gradient(45deg, #C8102E, #ff4444)
--button-secondary-bg: rgba(255, 255, 255, 0.1)
--button-secondary-border: #FFD23F
```

### Efeitos Visuais
```css
/* Shimmer e Brilhos */
--shimmer: rgba(255, 255, 255, 0.2)       /* Efeito shimmer */
--glow-primary: rgba(255, 193, 7, 0.6)    /* Glow amarelo */
--glow-secondary: rgba(255, 179, 71, 0.4) /* Glow laranja */

/* Bordas Especiais */
--border-success: #3BB273                  /* Verde para info positiva */
--border-decorative: linear-gradient(90deg, transparent, rgba(255, 193, 7, 0.8), transparent)
```

---

## ✍️ Tipografia

### Família de Fontes
```css
/* Fonte Principal do Sistema */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

### Hierarquia Tipográfica

#### Títulos Principais (H1)
```css
.title-primary {
  font-size: clamp(2.2rem, 4.5vw, 3rem);     /* 35.2px - 48px */
  font-weight: 700;                           /* Bold */
  line-height: 1.1;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  background: linear-gradient(135deg, #ffffff 0%, #fff3cd 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeInScale 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}
```

#### Subtítulos (H2)
```css
.subtitle {
  font-size: clamp(1rem, 2.2vw, 1.4rem);     /* 16px - 22.4px */
  font-weight: 600;                           /* Semi-bold */
  color: #ffffff;
  opacity: 0.9;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
}
```

#### Labels de Formulário
```css
.form-label {
  font-size: clamp(1rem, 2.2vw, 1.3rem);     /* 16px - 20.8px */
  font-weight: 700;                           /* Bold */
  color: #ffffff;
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}
```

#### Texto Descritivo
```css
.description-text {
  font-size: clamp(0.8rem, 1.8vw, 1rem);     /* 12.8px - 16px */
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  padding: 0 2rem;                           /* Respiração lateral */
}
```

#### Inputs e Campos
```css
.input-text {
  font-size: clamp(0.9rem, 2vw, 1.1rem);     /* 14.4px - 17.6px */
  color: #ffffff;
  font-weight: 400;                           /* Regular */
}
```

#### Botões
```css
.button-text {
  font-size: clamp(0.9rem, 2vw, 1.2rem);     /* 14.4px - 19.2px */
  font-weight: 700;                           /* Bold */
  text-transform: uppercase;
  letter-spacing: 0.05em;                     /* Espaçamento entre letras */
}
```

---

## 📐 Layout e Estrutura

### Container Principal
```css
.totem-container {
  min-height: 100vh;                          /* Altura total da viewport */
  width: 100%;
  position: relative;
  overflow: hidden;                           /* Previne scroll */
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #F59D28, #793902);
  background-attachment: fixed;
}
```

### Container de Conteúdo
```css
.content-wrapper {
  position: relative;
  z-index: 10;                               /* Acima dos efeitos de fundo */
  width: 100%;
  max-width: 6xl;                            /* 1152px - limitação máxima */
  margin: 0 auto;                            /* Centralização */
  padding: 1rem;                             /* 16px horizontal */
}
```

### Espaçamentos Padrão
```css
/* Margens Verticais */
.section-spacing {
  margin-bottom: clamp(1.5rem, 3vw, 3.5rem); /* Entre seções */
}

.form-spacing {
  margin-bottom: clamp(3rem, 6vw, 4rem);     /* Form para footer */
}

.header-spacing {
  margin-bottom: clamp(1rem, 2vw, 1.5rem);  /* Header para form */
}

/* Margens Laterais */
.side-padding {
  padding-left: clamp(1rem, 2vw, 2rem);
  padding-right: clamp(1rem, 2vw, 2rem);
}
```

### Grid Systems
```css
/* Grid para Cards de Features */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: clamp(0.5rem, 1vw, 1rem);
  margin: clamp(2rem, 4vw, 3rem) clamp(1rem, 7vw, 7rem);
}

/* Layout de Formulário */
.form-layout {
  max-width: 800px;                          /* Largura máxima otimizada */
  margin: 0 auto;
  padding: clamp(1.5rem, 3vw, 2.5rem);
}
```

---

## 🧩 Componentes Base

### 1. Glass Card Padrão

#### Estrutura Base
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  position: relative;
  overflow: hidden;
}

/* Shimmer Effect */
.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg, 
    transparent 30%, 
    rgba(255, 255, 255, 0.2) 50%, 
    transparent 70%
  );
  border-radius: inherit;
  animation: shimmer-continuous 8s ease-in-out infinite;
  pointer-events: none;
}
```

#### Variações de Cards
```css
/* Card com Borda Verde (Sucesso) */
.glass-card-success {
  border: 2.5px solid #3BB273;
}

/* Card Compacto */
.glass-card-compact {
  padding: clamp(0.8rem, 1.5vw, 1.2rem);
}

/* Card com Hover */
.glass-card-interactive {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.glass-card-interactive:hover {
  transform: translateY(-2px);
}
```

### 2. Inputs e Campos

#### Input Padrão
```css
.totem-input {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  color: #ffffff;
  padding: clamp(0.8rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.5rem);
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  width: 100%;
  transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.totem-input:focus {
  outline: none;
  ring: 4px;
  ring-color: rgba(255, 179, 71, 0.3);
  border-color: #FFB347;
}

.totem-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* Estado de Erro */
.totem-input.error {
  border-color: #ef4444;
}
```

### 3. Botões

#### Botão Primário
```css
.button-primary {
  background: linear-gradient(45deg, #C8102E, #ff4444);
  color: white;
  border: none;
  border-radius: 50px;
  padding: clamp(0.8rem, 2vw, 1rem) clamp(1.2rem, 3vw, 1.8rem);
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 10px 30px rgba(200, 16, 46, 0.4);
  transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-primary:hover {
  transform: scale(1.05);
}

.button-primary:active {
  transform: scale(0.95);
}
```

#### Botão Secundário
```css
.button-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #FFD23F;
  border: 2px solid #FFD23F;
  border-radius: 50px;
  padding: clamp(0.8rem, 2vw, 1rem) clamp(1.2rem, 3vw, 1.8rem);
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-secondary:hover {
  background: #FFB347;
  color: white;
}
```

### 4. Ícones
```css
/* Padrão de Ícones FA React */
.icon-wrapper {
  margin-right: 0.75rem;
  filter: drop-shadow(0 0 10px rgba(255, 193, 7, 0.6));
}

/* Tamanhos de Ícones */
.icon-small { font-size: 1.2em; }      /* Labels */
.icon-medium { font-size: 2rem; }      /* Headers */
.icon-large { font-size: 3rem; }       /* Principais */

/* Cores de Ícones */
.icon-primary { color: #FFD23F; }      /* Amarelo principal */
.icon-secondary { color: #FFB347; }    /* Laranja secundário */
```

---

## ✨ Animações e Efeitos

### Animações Principais
```css
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes shimmer-continuous {
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
```

### Padrões de Timing
```css
/* Cubic Bezier Curves Padrão */
--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1)        /* Suave geral */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55) /* Bounce buttons */
--ease-fast: cubic-bezier(0.4, 0, 0.2, 1)            /* Shimmer */

/* Durações Padrão */
--duration-fast: 300ms                                /* Hovers/clicks */
--duration-medium: 600ms                              /* Transições */
--duration-slow: 800ms                                /* Entradas */
--duration-shimmer: 8s                                /* Efeitos contínuos */
```

### Sequenciamento de Animações
```css
/* Escalonamento de Delays */
.anim-delay-1 { animation-delay: 0.2s; }
.anim-delay-2 { animation-delay: 0.4s; }
.anim-delay-3 { animation-delay: 0.6s; }
.anim-delay-4 { animation-delay: 0.8s; }
.anim-delay-5 { animation-delay: 1.0s; }
.anim-delay-6 { animation-delay: 1.2s; }
```

---

## 🖼️ Assets e Imagens

### Estrutura de Assets
```
frontend/src/assets/
├── imagens/
│   ├── logo_barbalho.png           /* Logo principal da marca */
│   └── gustavo.png                 /* Personagem mascote */
├── produtos/
│   ├── arroz/
│   │   └── arroz-agulhinha.png    /* Produtos da linha arroz */
│   ├── derivados-milho/
│   ├── farinaceos/
│   ├── feijao/
│   ├── lamen/
│   └── macarrao/
└── icones/
    ├── logo-barbalho.svg           /* Logo vetorial */
    └── favicon.ico                 /* Favicon */
```

### Especificações de Imagens

#### Logo Principal
```css
.logo-main {
  height: clamp(270px, 30vw, 420px);         /* Responsivo */
  width: auto;
  max-width: 1020px;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
}
```

#### Personagem Gustavo
```css
.character-gustavo {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 20;
  height: min(60vw, 420px);                   /* Muito grande */
  width: auto;
  max-height: 90vh;
  pointer-events: none;
  user-select: none;
  animation: fadeInScale 0.8s cubic-bezier(0.22, 1, 0.36, 1) 2s both;
}
```

#### Produtos Decorativos
```css
.product-decoration {
  position: fixed;
  right: -60px;                               /* Parcialmente fora */
  bottom: -20px;
  z-index: 18;
  height: min(32vw, 550px);
  width: auto;
  max-height: 40vh;
  transform: rotate(-10deg);                  /* Inclinação dinâmica */
  pointer-events: none;
  user-select: none;
}
```

### Efeitos de Imagem
```css
/* Animação de Pop para Logo */
@keyframes barbalho-pop {
  0% { transform: scale(1); }
  30% { transform: scale(1.13); }
  60% { transform: scale(0.97); }
  100% { transform: scale(1); }
}

.logo-interactive {
  transition: transform 0.2s ease;
  cursor: pointer;
}

.logo-interactive.animate-pop {
  animation: barbalho-pop 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

## 📱 Responsividade

### Estratégia Principal: clamp()
```css
/* Função clamp() para Escalonamento Fluido */
/* clamp(mínimo, preferido, máximo) */

/* Exemplo de Aplicação */
font-size: clamp(1rem, 2.2vw, 1.4rem);     /* 16px - 22.4px */
padding: clamp(0.8rem, 2vw, 1rem);         /* 12.8px - 16px */
margin: clamp(1rem, 2vw, 2rem);            /* 16px - 32px */
width: clamp(320px, 90vw, 800px);          /* 320px - 800px */
```

### Breakpoints Implícitos
```css
/* Mobile First Approach */
/* Pequeno: viewport < 480px */
.mobile-small {
  font-size: clamp(0.8rem, 4vw, 1rem);
  padding: clamp(0.5rem, 2vw, 1rem);
}

/* Mobile: 480px - 768px */
.mobile {
  font-size: clamp(1rem, 3vw, 1.2rem);
  padding: clamp(1rem, 2vw, 1.5rem);
}

/* Tablet: 768px - 1024px */
.tablet {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  padding: clamp(1.5rem, 3vw, 2rem);
}

/* Desktop: > 1024px */
.desktop {
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  padding: clamp(2rem, 3vw, 2.5rem);
}
```

### Adaptações Touch
```css
/* Áreas de Toque Otimizadas */
.touch-target {
  min-height: 44px;                          /* Mínimo iOS */
  min-width: 44px;
  touch-action: manipulation;                 /* Otimização touch */
  -webkit-tap-highlight-color: transparent;   /* Remove highlight */
}

/* Estados Touch */
.touch-feedback:active {
  transform: scale(0.95) translateY(-2px);
}
```

### Media Queries Específicas
```css
/* Responsividade para Assets */
@media (max-width: 900px) {
  .character-gustavo {
    height: min(35vw, 180px) !important;
    max-height: 30vh !important;
  }
  
  .product-decoration {
    height: min(28vw, 120px) !important;
    max-height: 18vh !important;
  }
}

@media (max-width: 600px) {
  .character-gustavo {
    height: min(30vw, 120px) !important;
    max-height: 18vh !important;
  }
  
  .product-decoration {
    height: min(22vw, 90px) !important;
    max-height: 12vh !important;
  }
}
```

---

## ♿ Acessibilidade

### Estrutura Semântica
```html
<!-- Hierarquia Clara de Headings -->
<h1>Título Principal da Página</h1>
<h2>Subtítulo Descritivo</h2>

<!-- Labels Associados -->
<label htmlFor="input-name">Nome Completo *</label>
<input id="input-name" type="text" />

<!-- Roles e ARIA Labels -->
<button role="button" aria-label="Logo Barbalho Interativo">
<img alt="Barbalho Alimentos" />
```

### Contrastes e Legibilidade
```css
/* Contrastes Altos */
color: #ffffff;                             /* Branco em fundo escuro */
text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* Sombra para legibilidade */

/* Estados de Foco */
.focus-visible {
  outline: 2px solid #FFD23F;
  outline-offset: 2px;
}

/* Indicadores Visuais */
.interactive-element {
  cursor: pointer;
  transition: all 300ms ease;
}
```

### Navegação por Teclado
```css
/* Tab Index Apropriados */
button { tabindex: 0; }                     /* Incluído na navegação */
.decorative { tabindex: -1; }              /* Excluído da navegação */

/* Estados de Foco Claros */
:focus-visible {
  outline: 2px solid #FFD23F;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.3);
}
```

---

## 🛠️ Padrões de Implementação

### 1. Estrutura de Estilos

#### Organização em Constantes
```typescript
// Constantes de Estilo Centralizadas
const STYLES = {
  container: {
    background: 'linear-gradient(135deg, #F59D28, #793902)',
    backgroundAttachment: 'fixed' as const
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
  },
  button: {
    primary: { /* estilos primários */ },
    secondary: { /* estilos secundários */ }
  }
};

// Animações CSS Separadas
const CSS_ANIMATIONS = `
  @keyframes fadeInScale { /* keyframes */ }
  @keyframes slideInRight { /* keyframes */ }
  @keyframes shimmer-continuous { /* keyframes */ }
`;
```

### 2. Memoização de Performance
```typescript
// Estilos Dinâmicos Memoizados
const inputStyle = useMemo(() => (hasError: boolean) => ({
  ...STYLES.input,
  borderColor: hasError ? '#ef4444' : 'rgba(255, 255, 255, 0.2)',
  padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.5rem)',
  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
  color: '#fff'
}), []);
```

### 3. Componentização Padrão
```typescript
// Estrutura de Componente Padrão
interface ComponentProps {
  // Props tipadas
}

const Component: React.FC<ComponentProps> = ({ props }) => {
  // Estado local mínimo
  const [state, setState] = useState();
  
  // Handlers otimizados
  const handleAction = useCallback(() => {
    // Lógica
  }, [dependencies]);
  
  // Render com padrões estabelecidos
  return (
    <>
      <style>{CSS_ANIMATIONS}</style>
      <div className="totem-container" style={STYLES.container}>
        <div className="content-wrapper">
          {/* Conteúdo */}
        </div>
      </div>
    </>
  );
};
```

### 4. Import de Assets
```typescript
// Padrão de Importação de Assets
const logoBarbalho = require('../assets/imagens/logo_barbalho.png');
const gustavo = require('../assets/imagens/gustavo.png');
const arrozAgulhinha = require('../assets/produtos/arroz/arroz-agulhinha.png');

// Uso em JSX
<img src={logoBarbalho} alt="Barbalho Alimentos" />
```

---

## 📝 Checklist de Implementação

### ✅ Componente Novo - Checklist
- [ ] **Importar React Icons FA** necessários
- [ ] **Aplicar STYLES constantes** do design system
- [ ] **Usar CSS_ANIMATIONS** padronizadas
- [ ] **Implementar clamp()** para responsividade
- [ ] **Glass morphism** em cards principais
- [ ] **Gradiente de fundo** corporativo
- [ ] **Animações escalonadas** (delays)
- [ ] **Estados de hover/active** apropriados
- [ ] **Touch optimization** (-webkit-tap-highlight)
- [ ] **Semântica HTML** adequada
- [ ] **ARIA labels** quando necessário
- [ ] **Assets** (imagens/ícones) integrados
- [ ] **Memoização** de estilos dinâmicos
- [ ] **Transições suaves** com cubic-bezier
- [ ] **Testes de responsividade** (móvel/desktop)

### 🚫 Anti-Padrões Evitados
- ❌ **Estilos inline repetitivos** → ✅ Constantes reutilizáveis
- ❌ **Tamanhos fixos** → ✅ clamp() e viewport units
- ❌ **Cores hardcoded** → ✅ Paleta centralizada
- ❌ **Animações pesadas** → ✅ requestAnimationFrame
- ❌ **Event listeners desnecessários** → ✅ Handlers consolidados
- ❌ **Assets não otimizados** → ✅ user-select: none, pointer-events: none

---

## 🎯 Conclusão

Este Design System estabelece um padrão visual e técnico consistente para todo o projeto:

### 🌟 **Características Premium**
- **Glass Morphism** sofisticado com blur effects
- **Gradientes corporativos** profissionais  
- **Animações suaves** otimizadas
- **Responsividade fluida** com clamp()
- **Assets integrados** (logos, personagens, produtos)

### 🚀 **Performance Otimizada**
- **Memoização** de estilos dinâmicos
- **requestAnimationFrame** para animações
- **Transições CSS** eficientes
- **Assets otimizados** para touch

### 📐 **Consistência Visual**
- **Paleta de cores** unificada
- **Tipografia escalonada** responsiva
- **Espaçamentos padronizados**
- **Componentes reutilizáveis**

### ♿ **Acessibilidade Completa**
- **Semântica HTML** apropriada
- **Navegação por teclado** funcional
- **Alto contraste** e legibilidade
- **Touch-first** interface

**Este sistema garante que todas as páginas futuras mantenham a mesma qualidade visual e técnica das páginas SplashScreen.tsx e UserDataForm.tsx.**

---

*Design System criado por: Assistente IA*  
*Baseado em: SplashScreen.tsx e UserDataForm.tsx*  
*Data: 21 de Setembro de 2025*  
*Versão: 1.0*