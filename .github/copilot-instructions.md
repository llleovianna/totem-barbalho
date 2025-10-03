# Totem Interativo IA Culinária Barbalho - Copilot Instructions

## Project Overview
This is an interactive totem application for Barbalho Alimentos food company, designed to run on a vertical touch screen (1080x1920 resolution) for trade shows and exhibitions. The system generates automatic recipes using Barbalho products and AI (Google Gemini).

## Architecture
- **Frontend**: React TypeScript application optimized for touch interactions in portrait mode
- **Backend**: Node.js with Express for API integration with Google Gemini
- **Target Resolution**: 1080px width x 1920px height (vertical orientation)
- **Interaction**: Primary touch-based interface
- **Design System**: Glass Morphism with corporate colors and responsive clamp() scaling

## Key Features
1. User data collection (name, phone, email, location)
2. Product selection from Barbalho catalog
3. Additional ingredients selection
4. Recipe preferences (difficulty, time, portions)
5. AI-powered recipe generation
6. Recipe printing and sharing capabilities
7. Automatic reset after inactivity

## Established Design System
Based on completed components `SplashScreen.tsx` and `UserDataForm.tsx`, all future components MUST follow these patterns:

### Design Standards
- **Glass Morphism**: `rgba(255, 255, 255, 0.1)` backgrounds with `backdrop-filter: blur(20px)`
- **Corporate Colors**: 
  - Primary: `#C8102E` (Barbalho Red)
  - Secondary: `#FFD23F` (Barbalho Yellow)
  - Accent: `#FFB347` (Orange)
  - Background: `linear-gradient(135deg, #F59D28, #793902)`
- **Typography**: `clamp()` responsive scaling with system fonts
- **Animations**: `fadeInScale`, `slideInRight`, `shimmer-continuous` with cubic-bezier easing
- **Icons**: FontAwesome React icons with proper styling
- **Assets Integration**: Logo, Gustavo character, product images positioned as decorative elements

### Technical Standards
- **Responsiveness**: Use `clamp()` for all dimensions, fonts, spacing
- **Performance**: `useMemo()` for dynamic styles, `useCallback()` for handlers
- **Structure**: Centralized `STYLES` constants, separate `CSS_ANIMATIONS`
- **Touch Optimization**: `-webkit-tap-highlight-color: transparent`, proper touch targets
- **No Scroll**: All content must fit viewport height, strictly prohibited scroll

### Component Structure Template
```typescript
const STYLES = {
  container: { background: 'linear-gradient(135deg, #F59D28, #793902)' },
  glassCard: { background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' },
  // ... other centralized styles
};

const CSS_ANIMATIONS = `
  @keyframes fadeInScale { /* standard animations */ }
`;

const Component: React.FC<Props> = ({ props }) => {
  return (
    <>
      <style>{CSS_ANIMATIONS}</style>
      <div style={STYLES.container}>
        {/* Glass morphism content */}
      </div>
    </>
  );
};
```

## Development Guidelines
- **Modern React**: Use React 18+ with TypeScript, hooks pattern
- **Design Consistency**: Follow established TOTEM_DESIGN_SYSTEM.md exactly
- **Touch Interface**: Optimize for fullscreen kiosk mode with touch interactions
- **User Experience**: Focus on public exhibition environment usability
- **Error Handling**: Implement proper fallbacks and loading states
- **Visual Feedback**: Consistent animations and state indicators
- **Asset Integration**: Include Barbalho branding and product imagery

## File Structure
- `/frontend` - React TypeScript application
  - `/src/components/` - React components following design system
  - `/src/assets/` - Images, logos, products, icons
  - `TOTEM_DESIGN_SYSTEM.md` - Complete design reference guide
- `/backend` - Node.js Express server
- `/docs` - Documentation and project specifications

## Reference Components
- **SplashScreen.tsx** - ✅ COMPLETED - Perfect glass morphism, 3D logo card, particles
- **UserDataForm.tsx** - ✅ COMPLETED - Perfect form styling, validation, responsive layout
- **TOTEM_DESIGN_SYSTEM.md** - Complete style guide for all future components

## Progress Tracking
- [x] Project structure created
- [x] Documentation established
- [x] Design system established (SplashScreen + UserDataForm)
- [x] Complete style guide documentation
- [ ] Additional frontend components (ProductSelection, RecipeDisplay, etc.)
- [ ] Backend API implementation
- [ ] Google Gemini integration
- [ ] Touch interface optimization
- [ ] Testing and deployment

## Critical Requirements
1. **NO SCROLL**: All components must fit in viewport without vertical scrolling
2. **Design Consistency**: Must match SplashScreen.tsx and UserDataForm.tsx exactly
3. **Glass Morphism**: Required on all cards and containers
4. **Corporate Colors**: Use established Barbalho color palette only
5. **clamp() Responsiveness**: All sizing must use clamp() for fluid scaling
6. **Touch Optimization**: All interactions optimized for touch screens
7. **Asset Integration**: Include character and product decorative elements
8. **Performance**: Memoize styles and optimize animations

All future development must reference `TOTEM_DESIGN_SYSTEM.md` and maintain the established visual and technical standards.
