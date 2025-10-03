# 🚀 MCP - Totem Interativo IA Culinária Barbalho

**Versão do Documento:** 1.1
**Data da Última Atualização:** 15 de Setembro de 2025

## 1. 🎯 Missão Principal (Overview)

Desenvolver uma aplicação web interativa e imersiva para um totem de exposição da **Barbalho Alimentos**. O objetivo é engajar visitantes em feiras e eventos, permitindo que eles criem receitas personalizadas utilizando produtos Barbalho e ingredientes diversos através de uma interface touch-screen. A geração da receita é realizada por uma IA (Google Gemini). A aplicação também captura dados básicos dos usuários para fins comerciais e permite que a receita gerada seja impressa ou compartilhada.

---

## 2. 📊 Status Atual do Projeto

O projeto está em fase de **desenvolvimento ativo**. A estrutura principal da interface do usuário (`ia.html`) e a lógica de navegação entre as etapas (`totem-ia.js`) estão implementadas.

-   ✅ **Etapa 1 (Dados Pessoais):** Funcional, com validação e máscara de telefone.
-   🟡 **Etapa 2 (Seleção de Ingredientes):**
    -   **2A (Produtos Barbalho):** A exibição de categorias está funcional. A exibição dos produtos ao clicar na categoria foi **recém-corrigida** com a implementação de um carrossel dinâmico (Swiper.js).
    -   **2B e 2C (Ingredientes e Preferências):** Estrutura de UI pronta, mas a lógica de seleção e armazenamento no estado precisa ser finalizada e integrada ao fluxo principal.
-   🔴 **Etapa 3 (Geração da Receita):** A integração front-end -> back-end para a chamada da API do Gemini ainda precisa ser implementada. O back-end (`server.js`) está pronto e funcional isoladamente.
-   ✅ **Layout & Design:** A interface visual está bem definida, com um design "glassmorphism" moderno e animações. O layout foi ajustado para as dimensões específicas do totem.

---

## 3. 🛠️ Arquitetura e Componentes Chave

A aplicação é uma SPA (Single Page Application) baseada em "Vanilla JavaScript" (JS puro e moderno), com um back-end leve em Node.js para a integração com a IA.

### Arquivos Principais:

| Ficheiro                 | Descrição                                                                                               | Linguagem/Tecnologia      |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------- |
| `ia.html`                | Estrutura principal da aplicação. Contém todos os elementos visuais das etapas.                           | HTML5, Tailwind CSS       |
| `totem-ia.js`            | O "cérebro" da aplicação. Gerencia o estado, a navegação, as interações do usuário e as chamadas de API.    | JavaScript (ES6 Classes)  |
| `produtos-data.js`       | Banco de dados local (em formato de objeto JS) contendo todos os produtos da Barbalho.                    | JavaScript                |
| `recipe-ai-config.js`    | Ficheiro de configuração com listas de ingredientes comuns e restrições.                                | JavaScript                |
| `server.js`              | Back-end responsável por receber os dados do totem, construir o prompt e comunicar com a API do Gemini. | Node.js, Express          |

### Tecnologias Externas:

-   **Tailwind CSS:** Para estilização rápida e responsiva.
-   **Swiper.js:** Para o carrossel interativo de produtos.
-   **Font Awesome:** Para os ícones da interface.
-   **Google Gemini API:** Para a geração do conteúdo das receitas.
-   **Express.js:** Framework para o servidor Node.js.

---

## 4. 🖥️ Ambiente de Execução (Totem)

A aplicação foi projetada para rodar em um hardware específico, cujas características são a principal diretriz para o design da UI/UX.

-   **Dispositivo:** Totem Vertical com TV Touch Screen.
-   **Modelo da Tela:** Samsung QN43LS03DAG (43 polegadas).
-   **Orientação:** Vertical (Modo Retrato).
-   **Resolução Alvo:** **1080px (largura) x 1920px (altura)**.
-   **Interação:** Primariamente por toque (touch).

---

## 5. 🌊 Fluxo do Usuário

O percurso do usuário é linear e dividido em etapas claras para facilitar a interação no totem.

1.  **Tela de Splash:** Boas-vindas e botão "Iniciar Experiência".
2.  **Etapa 1 - Dados Pessoais:** Coleta de nome, sobrenome, telefone, e-mail e cidade/estado.
3.  **Etapa 2A - Produtos Barbalho:**
    -   Visão de Categorias.
    -   Clique na categoria -> Abre o Carrossel de Produtos.
    -   Seleção de um ou mais produtos (obrigatório).
4.  **Etapa 2B - Ingredientes Adicionais:** Seleção de ingredientes comuns (ex: alho, cebola) e adição de ingredientes personalizados.
5.  **Etapa 2C - Preferências:** Definição de dificuldade, tempo de preparo e porções.
6.  **Tela de Loading:** Feedback visual enquanto a IA processa a receita.
7.  **Etapa Final - Receita Gerada:** Exibição da receita completa, com título, ingredientes, modo de preparo e dicas.
8.  **Ações Finais:** Opção de imprimir a receita e/ou iniciar uma nova experiência (reset).

---

## 6. 🔗 Fluxo de Dados e Integração com a API

O fluxo de dados é fundamental para o sucesso da geração da receita.

```
Frontend (ia.html)
|
v
[Interação do Usuário] -> Coleta de dados do formulário e das seleções
|
v
Estado do JavaScript (objeto this.recipeData em totem-ia.js)
|
v
[Clique em "Gerar Receita"] -> Monta um payload JSON com todos os dados
|
v
Fetch API Call -> Envia o payload para o Backend (http://localhost:3000/generate-recipe)
|
v
Backend (server.js)
|
v
Constrói o Prompt para a IA com base no payload recebido
|
v
Chamada para a API do Google Gemini
|
v
Resposta da IA (em formato JSON)
|
v
Backend -> Envia a resposta JSON de volta para o Frontend
|
v
Frontend (totem-ia.js) -> Recebe o JSON e renderiza o HTML da receita na tela
```

### Prompt da API (Exemplo)

O `server.js` monta um prompt estruturado para garantir que a IA retorne os dados no formato exato que precisamos.

```
Crie uma receita JSON com produtos Barbalho:

PRODUTOS OBRIGATÓRIOS: Feijão Carioca Premium Barbalho, Arroz Agulhinha Tipo 1 Barbalho
INGREDIENTES EXTRAS: Cebola, Alho, Tomate, Bacon
CONFIGURAÇÕES: almoço, Fácil, 30min, 4 pessoas
RESTRIÇÕES: Nenhuma

Responda APENAS com JSON válido:
{
"titulo": "Nome da Receita",
"descricao": "Descrição breve e apetitosa",
"ingredientes": ["lista de ingredientes com quantidades"],
"instrucoes": ["passos numerados de preparo"],
"dicas": ["2-3 dicas úteis"]
}
```

---

## 7. ❗️ Itens de Ação Imediata (Next Steps)

1.  **Finalizar Lógica da Etapa 2B e 2C:** Garantir que a seleção de ingredientes comuns e a adição de ingredientes personalizados estejam a funcionar corretamente e a atualizar o estado da aplicação (`this.recipeData`).
2.  **Conectar Front-end e Back-end:** Implementar a função `generateRecipe` em `totem-ia.js` para realizar a chamada `fetch` para o `server.js`, enviar o `payload` e tratar a resposta.
3.  **Implementar Impressão:** Desenvolver a função `printRecipe` para popular um template otimizado para impressão e acionar a janela de impressão do navegador.
4.  **Testar Sistema de Inatividade:** Validar o temporizador que reinicia a aplicação após um período sem interação, garantindo uma boa experiência no ambiente de feira.
5.  **Refinar Feedback Visual:** Adicionar micro-interações e animações de feedback para cada seleção de ingrediente, melhorando a experiência do toque.

## 8. 🚀 Como Executar o Projeto

### 🎯 Método Mais Simples (RECOMENDADO)

**Windows:**
```powershell
# Clique duplo no arquivo ou execute:
.\start.bat
```

**PowerShell (Windows):**
```powershell
.\start.ps1
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### 🔧 Método Manual

**1. Backend:**
```bash
cd backend
npm install
npm start
```

**2. Frontend (em outro terminal):**
```bash
cd frontend
npm install
npm start
```

### 📦 Método NPM (Após instalar dependências)

```bash
# Instalar dependências de todos os projetos
npm run setup

# Iniciar ambos os serviços
npm start

# Ou comandos individuais
npm run start:backend
npm run start:frontend
```

### 🌐 URLs de Acesso

- **Frontend (Totem):** http://localhost:3001
- **Backend (API):** http://localhost:3000
- **Health Check:** http://localhost:3000/health

### ⚙️ Configuração da API Gemini

1. Obtenha uma chave API em: https://makersuite.google.com/app/apikey
2. Edite o arquivo `backend/.env`
3. Adicione: `GEMINI_API_KEY=AIzaSyA3TW_hG5btEfXuw1pZucbRQGA94qo3-iU-iU`

O totem estará disponível em modo fullscreen otimizado para resolução 1080x1920 (vertical).
