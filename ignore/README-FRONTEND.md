# Totem Barbalho - Frontend

Aplicação React otimizada para totem touch screen vertical (1080x1920).

## Características

- **Interface Touch-First:** Otimizada para interação por toque
- **Resolução Específica:** 1080px × 1920px (modo retrato)
- **Design Responsivo:** Layout adaptado para tela vertical
- **Glassmorphism:** Design moderno com efeitos de vidro
- **Auto-reset:** Reinicia automaticamente após inatividade

## Tecnologias

- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Swiper.js** para carrosséis interativos
- **Font Awesome** para ícones

## Configuração

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento:**
   ```bash
   npm start
   ```

3. **Build para produção:**
   ```bash
   npm run build
   ```

## Fluxo da Aplicação

1. **Splash Screen** - Tela de boas-vindas
2. **Dados do Usuário** - Coleta informações pessoais
3. **Seleção de Produtos** - Escolha produtos Barbalho
4. **Ingredientes Extras** - Adiciona ingredientes opcionais
5. **Preferências** - Configura dificuldade, tempo, porções
6. **Loading** - Geração da receita pela IA
7. **Receita Final** - Exibe receita com opção de impressão

## Componentes Principais

- `SplashScreen` - Tela inicial
- `UserDataForm` - Formulário de dados pessoais
- `ProductSelection` - Seleção de produtos Barbalho
- `IngredientSelection` - Seleção de ingredientes extras
- `PreferencesSelection` - Configuração de preferências
- `LoadingScreen` - Tela de carregamento
- `RecipeDisplay` - Exibição da receita final

## Configuração para Totem

Para usar em modo kiosk/totem:

1. **Navegador em tela cheia:**
   - Chrome: `--kiosk --disable-web-security`
   - Edge: `--kiosk --disable-web-security`

2. **Auto-inicialização:**
   - Configure o sistema para abrir o navegador automaticamente
   - URL: `http://localhost:3001`

3. **Configurações recomendadas:**
   - Desativar cursor do mouse após inatividade
   - Configurar reinicialização automática do sistema
   - Monitoramento de saúde da aplicação

## Estrutura de Pastas

```
src/
├── components/          # Componentes React
│   ├── SplashScreen.tsx
│   ├── UserDataForm.tsx
│   ├── ProductSelection.tsx
│   ├── IngredientSelection.tsx
│   ├── PreferencesSelection.tsx
│   ├── LoadingScreen.tsx
│   └── RecipeDisplay.tsx
├── data/               # Dados e configurações
│   ├── productos-data.ts
│   └── recipe-config.ts
├── App.tsx             # Componente principal
├── App.css             # Estilos customizados
└── index.css           # Estilos Tailwind
```
