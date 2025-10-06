const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const os = require('os');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Log parcial da chave Gemini para debug
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(0, 10) + '...' : 'NÃO DEFINIDA');

// Import services
const PDFService = require('./services/pdfService');

const app = express();
const PORT = process.env.PORT || 3000;

// Função para detectar IP de rede local
function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Pular interfaces internas e não IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost'; // Fallback
}

const NETWORK_IP = getNetworkIP();
console.log('🌐 Network IP:', NETWORK_IP);

// Middleware com CSP permissivo para mobile-recipe
app.use((req, res, next) => {
  // Rotas que precisam de JavaScript inline (mobile-recipe)
  if (req.path.startsWith('/mobile-recipe')) {
    // Desabilitar CSP completamente para esta rota
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('X-Content-Security-Policy');
    res.removeHeader('X-WebKit-CSP');
  }
  next();
});

app.use(helmet({
  contentSecurityPolicy: false, // Desabilitar CSP global para evitar conflitos
  crossOriginOpenerPolicy: false, // Desabilitar COOP para HTTP
  crossOriginResourcePolicy: false, // Desabilitar CORP para HTTP
}));
app.use(cors({
  origin: function(origin, callback) {
    // Permitir requisições sem origin (como apps mobile, Postman, etc)
    if (!origin) return callback(null, true);
    
    // Permitir localhost e IPs da rede local (192.168.x.x, 10.x.x.x)
    const allowedOrigins = [
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
      /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
      /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,
      /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:\d+$/
    ];
    
    const isAllowed = allowedOrigins.some(pattern => pattern.test(origin));
    if (isAllowed || origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      console.warn('⚠️  CORS bloqueado para origem:', origin);
      callback(null, true); // Permitir de qualquer forma em desenvolvimento
    }
  },
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

// Initialize services
const pdfService = new PDFService();

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Totem Barbalho - Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Endpoint para obter IP de rede e porta
app.get('/api/network-info', (req, res) => {
  res.json({
    networkIP: NETWORK_IP,
    port: PORT,
    fullUrl: `http://${NETWORK_IP}:${PORT}`
  });
});

// Recipe generation endpoint
app.post('/generate-recipe', async (req, res) => {
  const fs = require('fs');
  try {
    const {
      userData,
      selectedProducts,
      additionalIngredients,
      customIngredients,
      preferences,
      restrictions
    } = req.body;

    if (!selectedProducts || selectedProducts.length === 0) {
      return res.status(400).json({ error: 'Pelo menos um produto Barbalho deve ser selecionado' });
    }

    const prompt = buildRecipePrompt({
      selectedProducts,
      additionalIngredients,
      customIngredients,
      preferences,
      restrictions
    });
    console.log('Generating recipe with prompt:', prompt);

    let recipeData = null;
    let usedFallback = false;
    
    // Helper function to load fallback recipe
    const loadFallbackRecipe = () => {
      try {
        const fallbackRaw = fs.readFileSync(__dirname + '/fallback-receitas.json', 'utf-8');
        const fallbackList = JSON.parse(fallbackRaw);
        
        // Tenta encontrar receitas para qualquer um dos produtos selecionados
        let receitasDoProduto = [];
        for (const product of selectedProducts) {
          const prodName = product?.name || product;
          const matches = fallbackList.filter(r => 
            r.produto.includes(prodName) || prodName.includes(r.produto.split(' ')[0])
          );
          if (matches.length > 0) {
            receitasDoProduto = matches;
            break;
          }
        }
        
        if (receitasDoProduto.length > 0) {
          // Sorteia uma receita fallback
          const selectedRecipe = receitasDoProduto[Math.floor(Math.random() * receitasDoProduto.length)];
          console.log(`✅ Fallback ativado: "${selectedRecipe.titulo}"`);
          return { ...selectedRecipe };
        } else {
          console.warn('⚠️ Nenhuma receita fallback encontrada para os produtos selecionados');
          // Retorna receita aleatória como último recurso
          const randomRecipe = fallbackList[Math.floor(Math.random() * fallbackList.length)];
          console.log(`🎲 Receita aleatória selecionada: "${randomRecipe.titulo}"`);
          return { ...randomRecipe };
        }
      } catch (fallbackError) {
        console.error('❌ Erro ao carregar fallback:', fallbackError.message);
        throw fallbackError;
      }
    };
    
    try {
      // Create timeout promise (45 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('TIMEOUT: A API demorou mais de 45 segundos para responder'));
        }, 45000);
      });
      
      // Create API call promise
      const apiPromise = model.generateContent(prompt).then(async (result) => {
        const response = await result.response;
        const recipeText = response.text();
        // Remove any markdown formatting and parse JSON
        const cleanJson = recipeText.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanJson);
      });
      
      // Race between API call and timeout
      console.log('⏱️ Iniciando geração de receita com timeout de 45 segundos...');
      const startTime = Date.now();
      recipeData = await Promise.race([apiPromise, timeoutPromise]);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`✅ Receita gerada pela API em ${elapsed}s`);
      
    } catch (error) {
      // Fallback: buscar receita local
      if (error.message.includes('TIMEOUT')) {
        console.warn('⏱️ TIMEOUT: API demorou mais de 45s, ativando fallback...');
      } else {
        console.error('❌ Erro na Gemini API:', error.message);
      }
      
      try {
        recipeData = loadFallbackRecipe();
        usedFallback = true;
      } catch (fallbackError) {
        return res.status(500).json({ 
          error: 'Erro na IA e ao carregar fallback.', 
          details: fallbackError.message 
        });
      }
    }

    // Add metadata
    recipeData.generatedAt = new Date().toISOString();
    recipeData.userData = userData;
    recipeData.usedProducts = selectedProducts;
    if (usedFallback && recipeData.titulo && !recipeData.titulo.endsWith('*')) {
      recipeData.titulo += '*';
    }

    res.json({
      success: true,
      recipe: recipeData
    });
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// Recipe sharing endpoints

app.post('/generate-recipe-pdf', async (req, res) => {
  try {
    const { recipe, userData } = req.body;

    // Validate input
    if (!recipe || !userData) {
      return res.status(400).json({
        error: 'Dados da receita e usuário são obrigatórios'
      });
    }

    console.log(`📄 [API] Solicitação de geração de PDF recebida`);
    console.log(`📊 [API] Receita: ${recipe.titulo}`);
    console.log(`👤 [API] Usuário: ${userData.name} (${userData.email})`);
    console.log(`⏰ [API] Timestamp: ${new Date().toISOString()}`);

    // Generate PDF automatically with puppeteer
    const result = await pdfService.generateAndSavePDF(recipe, userData);

    console.log(`✅ [API] PDF gerado com sucesso!`);
    console.log(`📁 [API] Arquivo: ${result.fileName}`);
    console.log(`📊 [API] Tamanho: ${result.fileSize} MB`);
    console.log(`💾 [API] Caminho: ${result.filePath}`);

    res.json({
      success: true,
      message: 'PDF gerado e salvo automaticamente com sucesso!',
      data: {
        fileName: result.fileName,
        fileSize: result.fileSize,
        generatedAt: new Date().toISOString(),
        recipe: recipe.titulo,
        user: userData.name
      }
    });

  } catch (error) {
    console.error('❌ [API] Erro ao gerar PDF:', error);
    console.error('📊 [API] Stack trace:', error.stack);
    res.status(500).json({
      error: 'Erro ao gerar PDF',
      details: error.message
    });
  }
});

// Service status endpoints
app.get('/service-status', (req, res) => {
  res.json({
    pdf: { available: true },
    timestamp: new Date().toISOString()
  });
});

// Helper function to build the AI prompt
function buildRecipePrompt({ selectedProducts, additionalIngredients, customIngredients, preferences, restrictions }) {
  const products = selectedProducts.map(p => p.name).join(', ');
  const extras = [...(additionalIngredients || []), ...(customIngredients || [])].join(', ');
  const difficulty = preferences?.difficulty || 'Fácil';
  const time = preferences?.time || '30 minutos';
  const portions = preferences?.portions || '4 pessoas';
  const mealType = preferences?.mealType || 'almoço';
  const restrictionsList = restrictions?.length ? restrictions.join(', ') : 'Nenhuma';

  // Prompt otimizado: estrutura pronta, instruções diretas, menos texto
  return `Gere APENAS um JSON válido para uma receita culinária Barbalho, preenchendo os campos abaixo. NÃO coloque markdown, nem comentários, nem vírgulas extras. Seja objetivo e direto. Use todos os produtos obrigatórios: ${products}. Ingredientes extras: ${extras}. Configurações: ${mealType}, ${difficulty}, ${time}, ${portions}. Restrições: ${restrictionsList}.
{
  "titulo": "Nome da Receita (até 70 caracteres)",
  "descricao": "Descrição apetitosa (até 120 caracteres)",
  "ingredientes": ["10-12 ingredientes, quantidades exatas, incluindo Barbalho"],
  "instrucoes": ["8-10 passos detalhados, linguagem simples, técnicas culinárias"],
  "dicas": ["4-5 dicas práticas, nutricionais, de preparo ou variação"],
  "tempoPreparo": "${time}",
  "dificuldade": "${difficulty}",
  "porcoes": "${portions}",
  "categoria": "${mealType}"
}`;
}

// Armazenamento temporário de receitas (em produção, usar Redis ou banco de dados)
const temporaryRecipes = new Map();

// Endpoint para salvar receita temporariamente
app.post('/save-recipe', (req, res) => {
  try {
    const { recipe, userData } = req.body;
    
    if (!recipe) {
      return res.status(400).json({
        success: false,
        error: 'Dados da receita são obrigatórios'
      });
    }

    // Gerar ID único
    const recipeId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    // Salvar receita com timestamp para expiração (24 horas)
    const recipeData = {
      recipe,
      userData: userData || {},
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    };
    
    temporaryRecipes.set(recipeId, recipeData);
    
    console.log(`📝 Receita salva temporariamente com ID: ${recipeId}`);
    
    res.json({
      success: true,
      recipeId: recipeId,
      message: 'Receita salva com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro ao salvar receita:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Endpoint para recuperar receita por ID
app.get('/recipe/:id', (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipeData = temporaryRecipes.get(recipeId);
    
    if (!recipeData) {
      return res.status(404).json({
        success: false,
        error: 'Receita não encontrada ou expirada'
      });
    }
    
    // Verificar se a receita não expirou
    if (Date.now() > recipeData.expiresAt) {
      temporaryRecipes.delete(recipeId);
      return res.status(404).json({
        success: false,
        error: 'Receita expirada'
      });
    }
    
    console.log(`📖 Receita recuperada com ID: ${recipeId}`);
    
    res.json({
      success: true,
      recipe: recipeData.recipe,
      userData: recipeData.userData
    });
    
  } catch (error) {
    console.error('❌ Erro ao recuperar receita:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Endpoint para servir logo Barbalho
app.get('/api/logo', (req, res) => {
  try {
    const logoPath = path.join(__dirname, '..', 'frontend', 'public', 'logo-barbalho.png');
    
    if (fs.existsSync(logoPath)) {
      res.sendFile(logoPath);
    } else {
      // Fallback: SVG inline
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">
            BARBALHO
          </text>
        </svg>
      `);
    }
  } catch (error) {
    console.error('Erro ao servir logo:', error);
    res.status(404).send('Logo não encontrado');
  }
});

// Endpoint para visualização mobile da receita (acesso via QR Code)
app.get('/mobile-recipe/:id', (req, res) => {
  try {
    const recipeId = req.params.id;
    console.log(`📱 [MOBILE] Acesso à receita via QR Code - ID: ${recipeId}`);
    
    const recipeData = temporaryRecipes.get(recipeId);
    
    if (!recipeData) {
      console.error(`❌ [MOBILE] Receita não encontrada: ${recipeId}`);
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Receita não encontrada - Barbalho</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
              background: linear-gradient(135deg, #F59D28, #793902);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              text-align: center;
            }
            .container {
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(20px);
              border-radius: 20px;
              padding: 40px;
              max-width: 500px;
            }
            h1 { font-size: 2rem; margin-bottom: 1rem; }
            p { font-size: 1.1rem; opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔍 Receita não encontrada</h1>
            <p>A receita que você está procurando não existe ou já expirou.</p>
            <p>Por favor, gere uma nova receita no totem Barbalho.</p>
          </div>
        </body>
        </html>
      `);
    }
    
    // Verificar se a receita não expirou
    if (Date.now() > recipeData.expiresAt) {
      temporaryRecipes.delete(recipeId);
      console.error(`❌ [MOBILE] Receita expirada: ${recipeId}`);
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Receita expirada - Barbalho</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
              background: linear-gradient(135deg, #F59D28, #793902);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              text-align: center;
            }
            .container {
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(20px);
              border-radius: 20px;
              padding: 40px;
              max-width: 500px;
            }
            h1 { font-size: 2rem; margin-bottom: 1rem; }
            p { font-size: 1.1rem; opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>⏱️ Receita expirada</h1>
            <p>Esta receita expirou após 24 horas.</p>
            <p>Por favor, gere uma nova receita no totem Barbalho.</p>
          </div>
        </body>
        </html>
      `);
    }
    
    const { recipe, userData } = recipeData;
    console.log(`✅ [MOBILE] Servindo receita: ${recipe.titulo}`);
    
    // Logo Barbalho via URL externa (garantida)
    const logoUrl = 'https://barbalhoalimentos.com.br/wp-content/uploads/2022/04/logo-barbalho-alimentos-color-400-200x100.png';
    
    // Gerar página HTML completa e responsiva da receita (OTIMIZADA PARA 1 PÁGINA)
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="mobile-web-app-capable" content="yes">
        <title>${recipe.titulo} - Barbalho Alimentos</title>
        <link rel="icon" href="${logoUrl}" type="image/png">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Italianno&display=swap" rel="stylesheet">
        
        <style>
          /* Variáveis de cor da Barbalho */
          :root {
            --barbalho-red: #C8102E;
            --barbalho-red-dark: #A00E26;
            --barbalho-yellow: #FBB343;
            --barbalho-brown: #A0522D;
            --barbalho-gray-800: #262626;
            --barbalho-gray-600: #525252;
          }
          
          /* Reset e Estilos Base */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 10px;
            color: var(--barbalho-gray-800);
            background: linear-gradient(135deg, #F59D28, #793902);
            background-attachment: fixed;
            font-size: 0.9em;
            padding-bottom: 100px;
          }
          
          .page-container {
            max-width: 95%;
            margin: 10px auto;
            padding: 15px 25px;
            background: white;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border-radius: 20px;
          }
          
          /* Cabeçalho do PDF */
          .pdf-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--barbalho-red);
            margin-bottom: 10px;
          }
          
          .pdf-header img {
            max-height: 50px;
            height: auto;
          }
          
          .pdf-header .brand-title {
            font-family: 'Italianno', cursive;
            font-size: 1.8rem;
            color: var(--barbalho-red);
            text-align: right;
          }
          
          /* Título e Meta */
          h1 {
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--barbalho-red);
            margin: 0 0 5px 0;
            line-height: 1.1;
          }
          
          .recipe-description {
            font-size: 0.95rem;
            color: var(--barbalho-gray-600);
            margin-bottom: 10px;
          }
          
          .recipe-meta {
            display: flex;
            gap: 10px;
            font-size: 0.8rem;
            color: var(--barbalho-gray-600);
            margin-bottom: 10px;
            flex-wrap: wrap;
          }
          
          .recipe-meta strong {
            color: var(--barbalho-red);
          }
          
          /* Grid de Conteúdo (2 colunas) */
          .recipe-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          
          h2 {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--barbalho-gray-800);
            border-bottom: 1px solid var(--barbalho-yellow);
            padding-bottom: 5px;
            margin-top: 0;
            margin-bottom: 8px;
          }
          
          /* Listas */
          ul, ol {
            padding-left: 15px;
            list-style-position: outside;
            font-size: 0.85rem;
            line-height: 1.5;
          }
          
          ul li, ol li {
            margin-bottom: 5px;
          }
          
          ul li {
            padding-left: 1em;
            text-indent: -1em;
          }
          
          ol li {
            padding-left: 0.5em;
          }
          
          /* Seção de Dicas */
          .tips-section {
            margin-top: 15px;
            padding: 10px;
            background-color: #FFFBEB;
            border-left: 3px solid var(--barbalho-yellow);
            font-size: 0.85em;
            grid-column: 1 / -1;
          }
          
          .tips-section h2 {
            border-bottom: none;
            padding-bottom: 0;
            margin-bottom: 5px;
            font-size: 1em;
          }
          
          .tips-section ul li::before {
            content: '💡 ';
          }
          
          /* Botão de Impressão (oculto na impressão) */
          .download-section {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
            padding: 15px 20px;
            display: flex;
            gap: 10px;
            z-index: 1000;
          }
          
          .btn {
            flex: 1;
            background: linear-gradient(45deg, #C8102E, #A00E26);
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 50px;
            font-size: clamp(0.9rem, 3vw, 1.1rem);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s ease;
          }
          
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(200, 16, 46, 0.4);
          }
          
          /* Rodapé */
          .pdf-footer {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 0.7rem;
            color: var(--barbalho-gray-600);
          }
          
          /* Otimizações para Impressão */
          @media print {
            body {
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              margin: 0;
              padding: 0;
            }
            
            .page-container {
              box-shadow: none;
              margin: 0;
              padding: 15px;
              width: 100%;
              border-radius: 0;
            }
            
            .pdf-header {
              margin-bottom: 5px;
              padding-bottom: 5px;
            }
            
            .pdf-header img {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .recipe-meta {
              margin-bottom: 5px;
            }
            
            h1 {
              margin-bottom: 2px;
            }
            
            h2 {
              margin-bottom: 4px;
              padding-bottom: 2px;
            }
            
            ul, ol, .tips-section ul, .tips-section ol {
              margin-bottom: 2px;
            }
            
            .recipe-section, .tips-section, .pdf-header, .pdf-footer, h1, .recipe-meta {
              page-break-inside: avoid;
              margin-bottom: 5px;
            }
            
            .download-section {
              display: none !important;
            }
            
            .tips-section {
              background-color: #FFFBEB !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          
          /* Responsivo Mobile */
          @media (max-width: 600px) {
            body {
              padding: 10px;
              padding-bottom: 100px;
            }
            
            .page-container {
              padding: 15px;
            }
            
            .pdf-header {
              flex-direction: column;
              text-align: center;
            }
            
            .pdf-header .brand-title {
              text-align: center;
              margin-top: 10px;
            }
            
            .recipe-content {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <header class="pdf-header">
            <img src="${logoUrl}" alt="Logo Barbalho Alimentos" onerror="this.style.display='none'">
            <div class="brand-title">Receita Exclusiva</div>
          </header>
          
          <main>
            <h1>${recipe.titulo}</h1>
            <p class="recipe-description">${recipe.descricao || ''}</p>
            
            <div class="recipe-meta">
              <span><strong>Tempo:</strong> ${recipe.tempoPreparo}</span>
              <span><strong>Serve:</strong> ${recipe.porcoes}</span>
              <span><strong>Dificuldade:</strong> ${recipe.dificuldade}</span>
            </div>
            
            <div class="recipe-content">
              <div class="recipe-section">
                <h2>🛒 Ingredientes</h2>
                <ul>
                  ${recipe.ingredientes.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
              </div>
              
              <div class="recipe-section">
                <h2>👨‍🍳 Modo de Preparo</h2>
                <ol>
                  ${recipe.instrucoes.map(inst => `<li>${inst}</li>`).join('')}
                </ol>
              </div>
              
              ${recipe.dicas && recipe.dicas.length > 0 ? `
              <div class="tips-section">
                <h2>💡 Dicas Especiais</h2>
                <ul>
                  ${recipe.dicas.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
              </div>
              ` : ''}
            </div>
          </main>
          
          <footer class="pdf-footer">
            <p><strong>Gerado pelo Totem IA Barbalho Alimentos</strong></p>
            <p>&copy; ${new Date().getFullYear()} Barbalho Alimentos - Qualidade que alimenta gerações</p>
          </footer>
        </div>
        
        <div class="download-section">
          <button id="printBtn" class="btn">
            🖨️ Imprimir Receita
          </button>
        </div>
        
        <script>
          // Botão de impressão
          const printBtn = document.getElementById('printBtn');
          
          if (printBtn) {
            printBtn.addEventListener('click', async () => {
              printBtn.textContent = '⏳ Preparando impressão...';
              printBtn.style.opacity = '0.7';
              
              try {
                // Aguarda 300ms para garantir renderização completa
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Abre diálogo de impressão nativo do navegador
                window.print();
                
                // Restaura botão após impressão/cancelamento
                setTimeout(() => {
                  printBtn.textContent = '�️ Imprimir Receita';
                  printBtn.style.opacity = '1';
                }, 1000);
              } catch (error) {
                console.error('Erro ao imprimir:', error);
                printBtn.textContent = '❌ Erro ao imprimir';
                setTimeout(() => {
                  printBtn.textContent = '🖨️ Imprimir Receita';
                  printBtn.style.opacity = '1';
                }, 2000);
              }
            });
          }
        </script>
      </body>
      </html>
    `;
    
    res.send(html);
  } catch (error) {
    console.error('❌ [MOBILE] Erro ao buscar receita:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Erro - Barbalho Alimentos</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #F59D28, #793902);
            color: white;
            text-align: center;
            padding: 20px;
          }
          .error-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 20px;
            max-width: 500px;
          }
          h1 { font-size: 3rem; margin-bottom: 20px; }
          p { font-size: 1.2rem; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>😔 Ops!</h1>
          <p>Não foi possível carregar a receita. Por favor, tente escanear o QR Code novamente.</p>
        </div>
      </body>
      </html>
    `);
  }
});

// ==================== ENDPOINTS DE SISTEMA ====================

// Health check - verifica se servidor está online
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== INICIALIZAÇÃO DO SERVIDOR ====================

// Função para iniciar servidores
function startServers() {
  try {
    // Servidor HTTP (porta 3000)
    const httpServer = http.createServer(app);
    httpServer.listen(PORT, () => {
      console.log(`🚀 Totem Barbalho Backend (HTTP) running on port ${PORT}`);
      console.log(`📡 Health check local: http://localhost:${PORT}/health`);
      console.log(`🌐 Network access: http://${NETWORK_IP}:${PORT}/health`);
      console.log(`📱 Mobile devices can access: http://${NETWORK_IP}:${PORT}`);
      console.log(`✅ Backend iniciado com sucesso na porta ${PORT}`);
    });

    // Servidor HTTPS (porta 3443) - opcional para desenvolvimento
    try {
      const httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'cert.pem')),
        pfx: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'cert.pfx')),
        passphrase: 'barbalho123'
      };

      const httpsServer = https.createServer(httpsOptions, app);
      httpsServer.listen(3443, () => {
        console.log(`🔒 Totem Barbalho Backend (HTTPS) running on port 3443`);
        console.log(`📡 Health check HTTPS: https://localhost:3443/health`);
        console.log(`🌐 Network HTTPS access: https://${NETWORK_IP}:3443/health`);
        console.log(`📱 Mobile HTTPS: https://${NETWORK_IP}:3443`);
        console.log(`⚠️  Certificado auto-assinado - navegadores mostrarão aviso de segurança`);
      });
    } catch (sslError) {
      console.log(`⚠️  SSL não configurado ou certificado não encontrado: ${sslError.message}`);
      console.log(`🔄 Continuando apenas com HTTP na porta ${PORT}`);
    }

  } catch (error) {
    console.error('❌ Erro ao iniciar servidores:', error);
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promessa rejeitada não tratada:', reason);
  process.exit(1);
});

// Iniciar servidores
startServers();