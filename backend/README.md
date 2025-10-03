# Totem Barbalho - Backend API

Backend Node.js para o sistema de totem interativo da Barbalho Alimentos.

## Configuração

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` e adicione sua chave da API do Google Gemini:
   ```
   GEMINI_API_KEY=AIzaSyA3TW_hG5btEfXuw1pZucbRQGA94qo3-iU-iU
   ```

3. **Executar servidor:**
   ```bash
   # Desenvolvimento
   npm run dev
   
   # Produção
   npm start
   ```

## API Endpoints

### GET /
- **Descrição:** Status da API
- **Resposta:** Informações sobre a API

### GET /health
- **Descrição:** Health check
- **Resposta:** Status do servidor

### POST /generate-recipe
- **Descrição:** Gera receita usando IA
- **Body:**
  ```json
  {
    "userData": {
      "name": "João",
      "lastName": "Silva",
      "phone": "(11) 99999-9999",
      "email": "joao@email.com",
      "city": "São Paulo",
      "state": "SP"
    },
    "selectedProducts": [
      {
        "id": "arroz-agulhinha-t1",
        "name": "Arroz Agulhinha Tipo 1 Barbalho",
        "category": "arroz"
      }
    ],
    "additionalIngredients": ["Cebola", "Alho"],
    "customIngredients": ["Bacon"],
    "preferences": {
      "difficulty": "Fácil",
      "time": "30min",
      "portions": "4 pessoas",
      "mealType": "almoço"
    },
    "restrictions": []
  }
  ```

## Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Google Gemini AI** - Geração de receitas
- **CORS** - Cross-origin resource sharing
- **Helmet** - Segurança HTTP
- **Morgan** - Logging de requisições

## Estrutura do Projeto

```
backend/
├── server.js          # Servidor principal
├── package.json       # Dependências e scripts
├── .env.example       # Exemplo de variáveis de ambiente
└── .env              # Variáveis de ambiente (criar)
```
