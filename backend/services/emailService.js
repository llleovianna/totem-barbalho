const nodemailer = require('nodemailer');

/**
 * Serviço de envio de email para receitas
 * Barbalho Alimentos - IA Culinária
 * 
 * CONFIGURAÇÃO NECESSÁRIA:
 * Configure as variáveis de ambiente:
 * - EMAIL_HOST: Servidor SMTP
 * - EMAIL_PORT: Porta SMTP
 * - EMAIL_USER: Usuário do email
 * - EMAIL_PASS: Senha do email
 * - EMAIL_FROM: Email remetente
 */

class EmailService {
  constructor() {
    // Garantir que dotenv seja carregado
    require('dotenv').config();
    
    this.config = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_PORT === '465', // true para 465, false para outras portas
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
      }
    };

    this.fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'naoresponder@barbalho.com.br';
    this.businessName = 'Barbalho Alimentos';
    this.isConfigured = this.checkConfiguration();
    this.transporter = null;

    if (this.isConfigured) {
      this.initializeTransporter();
    }
  }

  /**
   * Verifica se o serviço está configurado corretamente
   * @returns {Boolean} Status da configuração
   */
  checkConfiguration() {
    const hasRequiredConfig = this.config.auth.user && this.config.auth.pass;
    
    if (!hasRequiredConfig) {
      console.warn('⚠️ [EMAIL SERVICE] Configuração incompleta:');
      console.warn('   • EMAIL_USER não definido');
      console.warn('   • EMAIL_PASS não definido');
      console.warn('   • Configure as variáveis de ambiente para ativar o email');
    }

    return hasRequiredConfig;
  }

  /**
   * Inicializa o transportador de email
   */
  async initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport(this.config);
      
      // Verifica a conexão
      await this.transporter.verify();
      console.log('✅ [EMAIL SERVICE] Servidor SMTP conectado com sucesso');
      
    } catch (error) {
      console.error('❌ [EMAIL SERVICE] Erro na conexão SMTP:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Cria template HTML para email da receita
   * @param {Object} recipe - Dados da receita
   * @param {Object} userData - Dados do usuário
   * @returns {String} HTML do email
   */
  createRecipeEmailTemplate(recipe, userData) {
    const firstName = userData.name.split(' ')[0];
    const currentDate = new Date().toLocaleString('pt-BR');
    const currentYear = new Date().getFullYear();

    // URL da logo Barbalho
    const logoUrl = 'https://barbalhoalimentos.com.br/wp-content/uploads/2022/04/logo-barbalho-alimentos-color-400-200x100.png';

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sua Receita Personalizada - ${recipe.titulo}</title>
          <style>
            /* Reset CSS */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f8f9fa;
            }

            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }

            /* Cabeçalho */
            .header {
              background: linear-gradient(135deg, #C8102E, #A00E26);
              color: white;
              padding: 30px 20px 20px 20px;
              text-align: center;
            }

            .header .logo-barbalho {
              display: block;
              margin: 0 auto 15px auto;
              max-width: 220px;
              height: auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.08);
              padding: 8px 16px;
            }

            .header h1 {
              font-size: 28px;
              margin-bottom: 10px;
              font-weight: 700;
            }

            .header p {
              font-size: 16px;
              opacity: 0.9;
            }

            /* Conteúdo principal */
            .content {
              padding: 30px 25px;
            }

            .greeting {
              background: linear-gradient(135deg, #fff3cd, #fef7e0);
              border-left: 5px solid #FFD23F;
              padding: 20px;
              margin-bottom: 25px;
              border-radius: 8px;
              text-align: center;
            }

            .greeting h2 {
              color: #C8102E;
              margin-bottom: 10px;
              font-size: 22px;
            }

            .greeting p {
              font-size: 16px;
              color: #666;
            }

            /* Título da receita */
            .recipe-title {
              text-align: center;
              margin-bottom: 25px;
            }

            .recipe-title h3 {
              font-size: 26px;
              color: #C8102E;
              margin-bottom: 10px;
            }

            .recipe-description {
              font-style: italic;
              color: #666;
              font-size: 16px;
            }

            /* Meta informações */
            .recipe-meta {
              display: flex;
              justify-content: space-around;
              flex-wrap: wrap;
              gap: 15px;
              background: #f8f9fa;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 25px;
              border: 1px solid #e9ecef;
            }

            .recipe-meta div {
              text-align: center;
              flex: 1;
              min-width: 120px;
            }

            .recipe-meta .meta-icon {
              font-size: 24px;
              margin-bottom: 5px;
            }

            .recipe-meta .meta-label {
              font-weight: 600;
              color: #333;
              font-size: 14px;
              margin-bottom: 2px;
            }

            .recipe-meta .meta-value {
              color: #666;
              font-size: 13px;
            }

            /* Seções da receita */
            .recipe-section {
              margin-bottom: 25px;
            }

            .recipe-section h4 {
              font-size: 20px;
              color: #333;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 3px solid #FFD23F;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .recipe-section ul,
            .recipe-section ol {
              padding-left: 20px;
            }

            .recipe-section li {
              margin-bottom: 8px;
              font-size: 15px;
              line-height: 1.5;
            }

            /* Dicas especiais */
            .tips-section {
              background: linear-gradient(135deg, #e8f5e8, #f0f9f0);
              border-left: 5px solid #3BB273;
              padding: 20px;
              border-radius: 10px;
              margin: 25px 0;
            }

            .tips-section h4 {
              color: #2d8f47;
              border-bottom-color: #3BB273;
            }

            /* Mensagem de despedida */
            .farewell {
              background: linear-gradient(135deg, #fff3cd, #fef7e0);
              border-left: 5px solid #FFD23F;
              padding: 20px;
              border-radius: 10px;
              text-align: center;
              margin: 25px 0;
            }

            .farewell h4 {
              color: #C8102E;
              margin-bottom: 10px;
              border: none;
            }

            .farewell p {
              color: #666;
              font-size: 15px;
            }

            /* Rodapé */
            .footer {
              background: #333;
              color: white;
              padding: 25px 20px;
              text-align: center;
            }

            .footer h4 {
              color: #FFD23F;
              margin-bottom: 10px;
            }

            .footer p {
              font-size: 14px;
              opacity: 0.8;
              margin-bottom: 5px;
            }

            .footer .generation-info {
              font-weight: 600;
              color: #FFD23F;
              margin-top: 15px;
            }

            /* Responsividade */
            @media (max-width: 600px) {
              .email-container {
                margin: 10px;
                border-radius: 5px;
              }

              .header {
                padding: 20px 15px;
              }

              .content {
                padding: 20px 15px;
              }

              .recipe-meta {
                flex-direction: column;
                gap: 10px;
              }

              .recipe-meta div {
                min-width: auto;
              }

              .header h1 {
                font-size: 24px;
              }

              .recipe-title h3 {
                font-size: 22px;
              }
            }
          </style>
        </head>
        
        <body>
          <div class="email-container">

            <!-- Cabeçalho -->
            <div class="header">
              <img src="${logoUrl}" alt="Barbalho Alimentos" class="logo-barbalho" width="200" height="100" />
              <h1>🍽️ Receita Personalizada</h1>
              <p>Criada especialmente para você pela IA Culinária Barbalho</p>
            </div>

            <!-- Conteúdo -->
            <div class="content">
              <!-- Saudação personalizada -->
              <div class="greeting">
                <h2>Olá, ${firstName}! 👋</h2>
                <p>Sua receita exclusiva está pronta! Esperamos que aproveite cada sabor e que esta receita traga momentos deliciosos para sua mesa.</p>
              </div>

              <!-- Título da receita -->
              <div class="recipe-title">
                <h3>${recipe.titulo}</h3>
                ${recipe.descricao ? `<p class="recipe-description">${recipe.descricao}</p>` : ''}
              </div>

              <!-- Meta informações -->
              <div class="recipe-meta">
                <div>
                  <div class="meta-icon">⏱️</div>
                  <div class="meta-label">Tempo de Preparo</div>
                  <div class="meta-value">${recipe.tempoPreparo || '30 minutos'}</div>
                </div>
                <div>
                  <div class="meta-icon">👥</div>
                  <div class="meta-label">Rendimento</div>
                  <div class="meta-value">${recipe.porcoes || '4 porções'}</div>
                </div>
                <div>
                  <div class="meta-icon">⭐</div>
                  <div class="meta-label">Dificuldade</div>
                  <div class="meta-value">${recipe.dificuldade || 'Fácil'}</div>
                </div>
                <div>
                  <div class="meta-icon">🍽️</div>
                  <div class="meta-label">Categoria</div>
                  <div class="meta-value">${recipe.categoria || 'Prato Principal'}</div>
                </div>
              </div>

              <!-- Ingredientes -->
              <div class="recipe-section">
                <h4>📋 Ingredientes</h4>
                <ul>
                  ${recipe.ingredientes.map(ingrediente => `<li>${ingrediente}</li>`).join('')}
                </ul>
              </div>

              <!-- Modo de preparo -->
              <div class="recipe-section">
                <h4>👩‍🍳 Modo de Preparo</h4>
                <ol>
                  ${recipe.instrucoes.map(instrucao => `<li>${instrucao}</li>`).join('')}
                </ol>
              </div>

              <!-- Dicas especiais -->
              ${recipe.dicas && recipe.dicas.length > 0 ? `
              <div class="tips-section">
                <div class="recipe-section">
                  <h4>💡 Dicas Especiais da IA</h4>
                  <ul>
                    ${recipe.dicas.map(dica => `<li>${dica}</li>`).join('')}
                  </ul>
                </div>
              </div>` : ''}

              <!-- Mensagem de despedida -->
              <div class="farewell">
                <h4>Obrigado por experimentar nossa IA Culinária! 🤖</h4>
                <p>Desejamos uma excelente degustação e uma ótima feira!</p>
                <p>Que esta receita traga momentos deliciosos e muito sabor para sua mesa. 🍽️❤️</p>
              </div>
            </div>

            <!-- Rodapé -->
            <div class="footer">
              <h4>Barbalho Alimentos</h4>
              <p>Qualidade que alimenta gerações</p>
              <p>🌟 Inovação e tradição em cada ingrediente 🌟</p>
              <p class="generation-info">📅 Receita gerada em: ${currentDate}</p>
              <p>© ${currentYear} Barbalho Alimentos - Todos os direitos reservados</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Cria versão texto da receita para email
   * @param {Object} recipe - Dados da receita
   * @param {Object} userData - Dados do usuário
   * @returns {String} Texto da receita
   */
  createRecipeTextVersion(recipe, userData) {
    const firstName = userData.name.split(' ')[0];
    const currentDate = new Date().toLocaleString('pt-BR');

    return `
🍽️ RECEITA PERSONALIZADA BARBALHO 🍽️

Olá, ${firstName}!

Sua receita exclusiva criada pela nossa IA Culinária Barbalho está pronta!

📋 ${recipe.titulo.toUpperCase()}
${recipe.descricao ? `${recipe.descricao}\n` : ''}
⏱️ Tempo de Preparo: ${recipe.tempoPreparo || '30 minutos'}
👥 Rendimento: ${recipe.porcoes || '4 porções'}
⭐ Dificuldade: ${recipe.dificuldade || 'Fácil'}
🍽️ Categoria: ${recipe.categoria || 'Prato Principal'}

INGREDIENTES:
${recipe.ingredientes.map((ing, index) => `${index + 1}. ${ing}`).join('\n')}

MODO DE PREPARO:
${recipe.instrucoes.map((inst, index) => `${index + 1}. ${inst}`).join('\n')}

${recipe.dicas && recipe.dicas.length > 0 ? `DICAS ESPECIAIS DA IA:\n${recipe.dicas.map((dica, index) => `${index + 1}. ${dica}`).join('\n')}\n` : ''}

---

Obrigado por experimentar nossa IA Culinária Barbalho!
Desejamos uma excelente degustação e uma ótima feira!
Que esta receita traga momentos deliciosos e muito sabor para sua mesa. 🍽️❤️

📅 Receita gerada em: ${currentDate}
🏢 Barbalho Alimentos - Qualidade que alimenta gerações
🤖 Gerado por: Assistente de Receitas IA Barbalho Alimentos
🌟 Inovação e tradição em cada ingrediente 🌟

© ${new Date().getFullYear()} Barbalho Alimentos - Todos os direitos reservados
    `;
  }

  /**
   * Envia email com a receita e PDF anexo opcional
   * @param {Object} recipe - Dados da receita
   * @param {Object} userData - Dados do usuário
   * @param {String} pdfPath - Caminho para o arquivo PDF (opcional)
   * @returns {Promise} Resultado do envio
   */
  async sendRecipe(recipe, userData, pdfPath = null) {
    if (!this.isConfigured) {
      throw new Error('Email Service não está configurado. Verifique as variáveis de ambiente.');
    }

    try {
      console.log('📧 [EMAIL SERVICE] Iniciando envio de receita por email...');
      console.log(`📋 [EMAIL SERVICE] Receita: ${recipe.titulo}`);
      console.log(`👤 [EMAIL SERVICE] Destinatário: ${userData.email}`);
      if (pdfPath) {
        console.log(`📎 [EMAIL SERVICE] Anexando PDF: ${pdfPath}`);
      }

      const firstName = userData.name.split(' ')[0];
      const htmlContent = this.createRecipeEmailTemplate(recipe, userData);
      const textContent = this.createRecipeTextVersion(recipe, userData);

      const mailOptions = {
        from: {
          name: this.businessName,
          address: this.fromEmail
        },
        to: {
          name: userData.name,
          address: userData.email
        },
        subject: `🍝 Sua Receita Personalizada: ${recipe.titulo} - Barbalho Alimentos`, // trocado para 🍉 (melancia, vibrante e chamativo)
        text: textContent,
        html: htmlContent,
        headers: {
          'X-Mailer': 'IA Culinária Barbalho',
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal'
        },
        messageId: `<${Date.now()}.${userData.email.split('@')[0]}@barbalho.com.br>`
      };

      // Adicionar anexo PDF se fornecido
      if (pdfPath) {
        const path = require('path');
        const fileName = path.basename(pdfPath);
        
        mailOptions.attachments = [{
          filename: fileName,
          path: pdfPath,
          contentType: 'application/pdf'
        }];
        
        console.log(`📎 [EMAIL SERVICE] PDF anexado: ${fileName}`);
      }

      const result = await this.transporter.sendMail(mailOptions);

      console.log('✅ [EMAIL SERVICE] Email enviado com sucesso!');
      console.log(`📧 [EMAIL SERVICE] Message ID: ${result.messageId}`);
      if (pdfPath) {
        console.log(`📎 [EMAIL SERVICE] PDF anexo enviado com sucesso!`);
      }

      return {
        success: true,
        messageId: result.messageId,
        recipient: userData.email,
        recipe: recipe.titulo,
        user: userData.name,
        method: 'email',
        pdfAttached: !!pdfPath,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ [EMAIL SERVICE] Erro ao enviar email:', error);
      throw new Error(`Erro no envio do email: ${error.message}`);
    }
  }

  /**
   * Envia email de teste
   * @param {String} emailAddress - Email de destino
   * @returns {Promise} Resultado do teste
   */
  async sendTestEmail(emailAddress) {
    if (!this.isConfigured) {
      throw new Error('Email Service não está configurado.');
    }

    try {
      console.log(`📧 [EMAIL SERVICE] Enviando email de teste para: ${emailAddress}`);

      const mailOptions = {
        from: {
          name: this.businessName,
          address: this.fromEmail
        },
        to: emailAddress,
        subject: '✅ Teste - IA Culinária Barbalho',
        text: 'Este é um email de teste do sistema IA Culinária Barbalho.',
        html: `
          <h2>✅ Email de Teste</h2>
          <p>Olá!</p>
          <p>Este é um email de teste do sistema <strong>IA Culinária Barbalho</strong>.</p>
          <p>Se você recebeu este email, o serviço está funcionando corretamente! 🎉</p>
          <hr>
          <p><small>© ${new Date().getFullYear()} Barbalho Alimentos</small></p>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);

      console.log('✅ [EMAIL SERVICE] Email de teste enviado com sucesso!');
      
      return {
        success: true,
        messageId: result.messageId,
        recipient: emailAddress
      };

    } catch (error) {
      console.error('❌ [EMAIL SERVICE] Erro no envio do teste:', error);
      throw error;
    }
  }

  /**
   * Valida endereço de email
   * @param {String} email - Email a ser validado
   * @returns {Boolean} Status da validação
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    console.log(`🔍 [EMAIL SERVICE] Validando email: ${email} - ${isValid ? 'Válido' : 'Inválido'}`);
    
    return isValid;
  }

  /**
   * Obtém status do serviço de email
   * @returns {Object} Status do serviço
   */
  getServiceStatus() {
    return {
      configured: this.isConfigured,
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      hasAuth: !!(this.config.auth.user && this.config.auth.pass),
      fromEmail: this.fromEmail,
      businessName: this.businessName
    };
  }

  /**
   * Testa a conexão SMTP
   * @returns {Promise} Status da conexão
   */
  async testConnection() {
    if (!this.isConfigured) {
      throw new Error('Email Service não está configurado.');
    }

    try {
      console.log('🔄 [EMAIL SERVICE] Testando conexão SMTP...');
      
      if (!this.transporter) {
        await this.initializeTransporter();
      }
      
      await this.transporter.verify();
      
      console.log('✅ [EMAIL SERVICE] Conexão SMTP OK');
      
      return {
        success: true,
        message: 'Conexão SMTP estabelecida com sucesso'
      };
      
    } catch (error) {
      console.error('❌ [EMAIL SERVICE] Erro na conexão SMTP:', error);
      throw new Error(`Erro na conexão SMTP: ${error.message}`);
    }
  }
}

module.exports = EmailService;