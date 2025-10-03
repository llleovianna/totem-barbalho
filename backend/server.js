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
const EmailService = require('./services/emailService');
const WhatsAppService = require('./services/whatsappService');
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

// Middleware
app.use(helmet());
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
const emailService = new EmailService();
const whatsappService = new WhatsAppService();
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
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const recipeText = response.text();
      // Remove any markdown formatting and parse JSON
      const cleanJson = recipeText.replace(/```json\n?|\n?```/g, '').trim();
      recipeData = JSON.parse(cleanJson);
    } catch (error) {
      // Fallback: buscar receita local
      console.error('Erro na Gemini, usando fallback:', error.message);
      try {
        const fallbackRaw = fs.readFileSync(__dirname + '/fallback-receitas.json', 'utf-8');
        const fallbackList = JSON.parse(fallbackRaw);
        // Tenta encontrar receitas para o primeiro produto selecionado
        const prodName = selectedProducts[0]?.name || selectedProducts[0];
        const receitasDoProduto = fallbackList.filter(r => r.produto === prodName);
        if (receitasDoProduto.length > 0) {
          // Sorteia uma receita fallback
          recipeData = { ...receitasDoProduto[Math.floor(Math.random() * receitasDoProduto.length)] };
          usedFallback = true;
        } else {
          // Se não encontrar, retorna erro
          return res.status(500).json({ error: 'Erro na IA e sem fallback disponível para este produto.' });
        }
      } catch (fallbackError) {
        return res.status(500).json({ error: 'Erro na IA e ao carregar fallback.', details: fallbackError.message });
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
app.post('/send-recipe-email', async (req, res) => {
  try {
    const { recipe, userData } = req.body;

    // Validate input
    if (!recipe || !userData || !userData.email) {
      return res.status(400).json({
        error: 'Dados da receita e email do usuário são obrigatórios'
      });
    }

    // Validate email format
    if (!emailService.validateEmail(userData.email)) {
      return res.status(400).json({
        error: 'Formato de email inválido'
      });
    }

    console.log(`📧 [API] Solicitação de envio por email recebida`);
    console.log(`📊 [API] Receita: ${recipe.titulo}`);
    console.log(`👤 [API] Destinatário: ${userData.name} (${userData.email})`);
    console.log(`⏰ [API] Timestamp: ${new Date().toISOString()}`);

    // Send email with embedded recipe (no separate PDF attachment for now)
    console.log(`📧 [API] Enviando email com receita incorporada...`);
    const emailResult = await emailService.sendRecipe(recipe, userData);

    console.log(`✅ [API] Email enviado com sucesso!`);
    console.log(`📧 [API] Email ID: ${emailResult.messageId || 'N/A'}`);

    res.json({
      success: true,
      message: 'Receita enviada por email com sucesso!',
      data: {
        email: emailResult,
        sentAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ [API] Erro ao enviar email:', error);
    console.error('📊 [API] Stack trace:', error.stack);
    res.status(500).json({
      error: 'Erro ao enviar email',
      details: error.message
    });
  }
});

app.post('/send-recipe-whatsapp', async (req, res) => {
  try {
    const { recipe, userData } = req.body;

    // Validate input
    if (!recipe || !userData || !userData.phone) {
      return res.status(400).json({
        error: 'Dados da receita e telefone do usuário são obrigatórios'
      });
    }

    console.log(`📱 [API] Enviando receita por WhatsApp: ${recipe.titulo} -> ${userData.phone}`);

    // Validate phone number
    const phoneValidation = await whatsappService.validatePhoneNumber(userData.phone);
    if (!phoneValidation.isValid) {
      return res.status(400).json({
        error: 'Número de telefone inválido',
        details: phoneValidation.message
      });
    }

    // Send WhatsApp message
    const result = await whatsappService.sendRecipe(recipe, userData);

    res.json({
      success: true,
      message: 'Receita enviada por WhatsApp com sucesso!',
      data: result
    });

  } catch (error) {
    console.error('❌ [API] Erro ao enviar WhatsApp:', error);
    res.status(500).json({
      error: 'Erro ao enviar WhatsApp',
      details: error.message
    });
  }
});

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
    email: emailService.getServiceStatus(),
    whatsapp: whatsappService.getServiceStatus(),
    pdf: { available: true },
    timestamp: new Date().toISOString()
  });
});

app.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email é obrigatório para teste'
      });
    }

    const result = await emailService.sendTestEmail(email);

    res.json({
      success: true,
      message: 'Email de teste enviado com sucesso!',
      data: result
    });

  } catch (error) {
    console.error('❌ [API] Erro no teste de email:', error);
    res.status(500).json({
      error: 'Erro no teste de email',
      details: error.message
    });
  }
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

// Endpoint para download direto de PDF da receita
app.get('/api/download-recipe-pdf/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;
    console.log(`📥 [API] Solicitação de download de PDF para receita ID: ${recipeId}`);
    
    const recipeData = temporaryRecipes.get(recipeId);
    
    if (!recipeData) {
      console.error(`❌ [API] Receita não encontrada: ${recipeId}`);
      return res.status(404).json({
        success: false,
        error: 'Receita não encontrada ou expirada'
      });
    }
    
    // Verificar se a receita não expirou
    if (Date.now() > recipeData.expiresAt) {
      temporaryRecipes.delete(recipeId);
      console.error(`❌ [API] Receita expirada: ${recipeId}`);
      return res.status(404).json({
        success: false,
        error: 'Receita expirada'
      });
    }
    
    console.log(`🔄 [API] Gerando PDF para: ${recipeData.recipe.titulo}`);
    
    // Gera o PDF usando Puppeteer
    const pdfBuffer = await pdfService.generatePDFBuffer(
      recipeData.recipe,
      recipeData.userData
    );
    
    // Nome do arquivo sanitizado
    const sanitizedTitle = recipeData.recipe.titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por -
      .replace(/^-+|-+$/g, '');        // Remove - do início e fim
    
    const fileName = `receita-${sanitizedTitle}-barbalho.pdf`;
    
    console.log(`✅ [API] PDF gerado com sucesso: ${fileName}`);
    console.log(`📊 [API] Tamanho: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
    
    // Configurar headers para download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Enviar o buffer do PDF
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('❌ [API] Erro ao gerar PDF para download:', error);
    console.error('📊 [API] Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar PDF',
      details: error.message
    });
  }
});

// Limpeza automática de receitas expiradas (executa a cada hora)
setInterval(() => {
  const now = Date.now();
  let deletedCount = 0;
  
  for (const [id, data] of temporaryRecipes.entries()) {
    if (now > data.expiresAt) {
      temporaryRecipes.delete(id);
      deletedCount++;
    }
  }
  
  if (deletedCount > 0) {
    console.log(`🧹 Limpeza automática: ${deletedCount} receitas expiradas removidas`);
  }
}, 60 * 60 * 1000); // 1 hora

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Erro interno do servidor',
    details: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado'
  });
});

// SSL/TLS Configuration
const HTTPS_PORT = 3443; // Porta HTTPS separada
let sslOptions = null;

try {
  const keyPath = path.join(__dirname, '..', 'ssl', 'key.pem');
  const certPath = path.join(__dirname, '..', 'ssl', 'cert.pem');
  
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    sslOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
    console.log('🔐 Certificados SSL encontrados e carregados');
  } else {
    console.log('⚠️  Certificados SSL não encontrados. Execute: node ssl/generate-certs.js');
  }
} catch (error) {
  console.error('❌ Erro ao carregar certificados SSL:', error.message);
}

// Start HTTP server (sempre disponível)
const httpServer = http.createServer(app);
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Totem Barbalho Backend (HTTP) running on port ${PORT}`);
  console.log(`📡 Health check local: http://localhost:${PORT}/health`);
  console.log(`🌐 Network access: http://${NETWORK_IP}:${PORT}/health`);
  console.log(`📱 Mobile devices can access: http://${NETWORK_IP}:${PORT}`);
});

// Start HTTPS server (se certificados estiverem disponíveis)
if (sslOptions) {
  const httpsServer = https.createServer(sslOptions, app);
  httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
    console.log(`🔒 Totem Barbalho Backend (HTTPS) running on port ${HTTPS_PORT}`);
    console.log(`📡 Health check HTTPS: https://localhost:${HTTPS_PORT}/health`);
    console.log(`🌐 Network HTTPS access: https://${NETWORK_IP}:${HTTPS_PORT}/health`);
    console.log(`📱 Mobile HTTPS: https://${NETWORK_IP}:${HTTPS_PORT}`);
    console.log(`⚠️  Certificado auto-assinado - navegadores mostrarão aviso de segurança`);
  });
} else {
  console.log(`ℹ️  HTTPS desabilitado - apenas HTTP disponível na porta ${PORT}`);
}

module.exports = app;
