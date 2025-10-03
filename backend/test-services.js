#!/usr/bin/env node
/**
 * Script de teste dos serviços backend
 * Totem Barbalho IA Culinária
 * 
 * Este script testa todos os serviços implementados
 */

// Carregar variáveis de ambiente
require('dotenv').config();

const EmailService = require('./services/emailService');
const WhatsAppService = require('./services/whatsappService');
const PDFService = require('./services/pdfService');

// Dados de teste
const testRecipe = {
  titulo: "Arroz com Feijão Especial Barbalho",
  descricao: "Uma receita tradicional brasileira com produtos premium Barbalho",
  ingredientes: [
    "2 xícaras de Arroz Agulhinha Tipo 1 Barbalho",
    "1 xícara de Feijão Carioca Premium Barbalho", 
    "1 cebola média picada",
    "2 dentes de alho picados",
    "Sal a gosto",
    "Óleo para refogar"
  ],
  instrucoes: [
    "Deixe o feijão de molho na noite anterior",
    "Cozinhe o feijão na panela de pressão por 20 minutos",
    "Em outra panela, refogue a cebola e o alho no óleo",
    "Adicione o arroz e refogue por 2 minutos",
    "Adicione água quente (2 xícaras para cada xícara de arroz)",
    "Cozinhe em fogo baixo por 15-20 minutos até secar a água",
    "Tempere o feijão com sal e sirva junto com o arroz"
  ],
  dicas: [
    "Use sempre produtos Barbalho para garantir qualidade superior",
    "O arroz agulhinha fica sempre soltinho",
    "Deixe o feijão de molho para facilitar o cozimento"
  ],
  tempoPreparo: "40 minutos",
  dificuldade: "Fácil",
  porcoes: "4 porções",
  categoria: "Almoço"
};

const testUserData = {
  name: "João Silva Santos",
  email: "joao.teste@exemplo.com",
  phone: "+55 11 99999-8888",
  city: "São Paulo",
  state: "SP"
};

async function testServices() {
  console.log('🧪 INICIANDO TESTES DOS SERVIÇOS BACKEND');
  console.log('==========================================\n');

  // Test PDF Service
  console.log('📄 TESTANDO SERVIÇO DE PDF...');
  try {
    const pdfService = new PDFService();
    const pdfResult = await pdfService.generateAndSavePDF(testRecipe, testUserData);
    console.log('✅ PDF Service: OK');
    console.log(`   📁 Arquivo: ${pdfResult.fileName}`);
    console.log(`   📊 Tamanho: ${pdfResult.fileSize} MB`);
  } catch (error) {
    console.log('❌ PDF Service: ERRO');
    console.log(`   💥 ${error.message}`);
  }

  console.log();

  // Test Email Service
  console.log('📧 TESTANDO SERVIÇO DE EMAIL...');
  try {
    const emailService = new EmailService();
    const status = emailService.getServiceStatus();
    console.log('📊 Status do Email Service:', status);
    
    if (status.configured) {
      console.log('🔄 Testando conexão SMTP...');
      await emailService.testConnection();
      console.log('✅ Email Service: CONFIGURADO E FUNCIONANDO');
    } else {
      console.log('⚠️ Email Service: NÃO CONFIGURADO');
      console.log('   💡 Configure EMAIL_USER e EMAIL_PASS no .env');
    }
  } catch (error) {
    console.log('❌ Email Service: ERRO');
    console.log(`   💥 ${error.message}`);
  }

  console.log();

  // Test WhatsApp Service
  console.log('📱 TESTANDO SERVIÇO DE WHATSAPP...');
  try {
    const whatsappService = new WhatsAppService();
    const status = whatsappService.getServiceStatus();
    console.log('📊 Status do WhatsApp Service:', status);
    
    // Test phone validation
    const phoneValidation = await whatsappService.validatePhoneNumber(testUserData.phone);
    console.log('📞 Validação de telefone:', phoneValidation);
    
    if (status.configured) {
      console.log('✅ WhatsApp Service: CONFIGURADO');
    } else {
      console.log('⚠️ WhatsApp Service: NÃO CONFIGURADO');
      console.log('   💡 Configure WHATSAPP_ACCESS_TOKEN e WHATSAPP_PHONE_NUMBER_ID no .env');
    }
  } catch (error) {
    console.log('❌ WhatsApp Service: ERRO');
    console.log(`   💥 ${error.message}`);
  }

  console.log();

  // Test API endpoints simulation
  console.log('🔌 TESTANDO INTEGRAÇÃO DE APIS...');
  console.log('📡 Endpoints disponíveis:');
  console.log('   POST /generate-recipe - Gerar receita com IA');
  console.log('   POST /send-recipe-email - Enviar receita por email');
  console.log('   POST /send-recipe-whatsapp - Enviar receita por WhatsApp');
  console.log('   POST /generate-recipe-pdf - Gerar PDF da receita');
  console.log('   GET /service-status - Status dos serviços');
  console.log('   POST /test-email - Testar envio de email');

  console.log();
  console.log('🏁 TESTE CONCLUÍDO!');
  console.log('==========================================');
  console.log();
  console.log('📝 PRÓXIMOS PASSOS:');
  console.log('1. Configure as variáveis de ambiente no arquivo .env');
  console.log('2. Teste os endpoints da API usando o frontend');
  console.log('3. Verifique se os emails/WhatsApp estão sendo enviados corretamente');
  console.log('4. Ajuste as configurações conforme necessário');
}

// Run tests
if (require.main === module) {
  testServices().catch(console.error);
}

module.exports = { testServices, testRecipe, testUserData };