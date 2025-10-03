/**
 * Serviço de integração com WhatsApp Business API
 * Barbalho Alimentos - IA Culinária
 * 
 * CONFIGURAÇÃO NECESSÁRIA:
 * 1. Meta Business Account
 * 2. WhatsApp Business API
 * 3. Webhook configurado
 * 4. Token de acesso válido
 */

class WhatsAppService {
  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.businessName = 'Barbalho Alimentos';
    this.isConfigured = this.checkConfiguration();
  }

  /**
   * Verifica se o serviço está configurado corretamente
   * @returns {Boolean} Status da configuração
   */
  checkConfiguration() {
    const hasRequiredConfig = this.accessToken && this.phoneNumberId;
    
    if (!hasRequiredConfig) {
      console.warn('⚠️ [WHATSAPP SERVICE] Configuração incompleta:');
      console.warn('   • WHATSAPP_ACCESS_TOKEN não definido') 
      console.warn('   • WHATSAPP_PHONE_NUMBER_ID não definido');
      console.warn('   • Configure as variáveis de ambiente para ativar o WhatsApp');
    }

    return hasRequiredConfig;
  }

  /**
   * Formata número de telefone brasileiro para WhatsApp
   * @param {String} phone - Número de telefone
   * @returns {String} Número formatado
   */
  formatPhoneNumber(phone) {
    // Remove todos os caracteres não numéricos
    let cleaned = phone.replace(/\D/g, '');
    
    // Se não tem código do país, adiciona 55 (Brasil)
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      cleaned = '55' + cleaned.substring(1);
    } else if (cleaned.length === 11) {
      cleaned = '55' + cleaned;
    } else if (cleaned.length === 10) {
      cleaned = '559' + cleaned;
    }

    console.log(`📱 [WHATSAPP SERVICE] Número formatado: ${phone} -> ${cleaned}`);
    return cleaned;
  }

  /**
   * Cria mensagem personalizada com a receita
   * @param {Object} recipe - Dados da receita
   * @param {Object} userData - Dados do usuário
   * @returns {String} Mensagem formatada
   */
  createRecipeMessage(recipe, userData) {
    const firstName = userData.name.split(' ')[0];
    const currentDate = new Date().toLocaleString('pt-BR');

    return `🍽️ *Receita Personalizada Barbalho* 🍽️

Olá, *${firstName}*! 

Sua receita exclusiva criada pela nossa *IA Culinária Barbalho* está pronta! ✨

📋 *${recipe.titulo}*
${recipe.descricao ? `_${recipe.descricao}_\n` : ''}
⏱️ *Tempo:* ${recipe.tempoPreparo || '30 minutos'}
👥 *Rende:* ${recipe.porcoes || '4 porções'}  
⭐ *Dificuldade:* ${recipe.dificuldade || 'Fácil'}

*🥘 INGREDIENTES:*
${recipe.ingredientes.map((ing, index) => `${index + 1}. ${ing}`).join('\n')}

*👩‍🍳 MODO DE PREPARO:*
${recipe.instrucoes.map((inst, index) => `${index + 1}. ${inst}`).join('\n')}

${recipe.dicas && recipe.dicas.length > 0 ? `*💡 DICAS ESPECIAIS:*\n${recipe.dicas.map((dica, index) => `${index + 1}. ${dica}`).join('\n')}\n` : ''}

---
🤖 *Gerado em:* ${currentDate}
🏢 *Barbalho Alimentos* - Qualidade que alimenta gerações
🌟 Obrigado por experimentar nossa IA Culinária!

_Desejamos uma excelente degustação e uma ótima feira!_ 🎪✨`;
  }

  /**
   * Envia mensagem de texto via WhatsApp Business API
   * @param {String} phoneNumber - Número do destinatário
   * @param {String} message - Mensagem a ser enviada
   * @returns {Promise} Resultado do envio
   */
  async sendTextMessage(phoneNumber, message) {
    if (!this.isConfigured) {
      throw new Error('WhatsApp Service não está configurado. Verifique as variáveis de ambiente.');
    }

    try {
      console.log('📱 [WHATSAPP SERVICE] Iniciando envio de mensagem...');
      console.log(`📞 [WHATSAPP SERVICE] Destinatário: ${phoneNumber}`);

      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const payload = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: {
          preview_url: false,
          body: message
        }
      };

      const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (response.ok && responseData.messages && responseData.messages[0]) {
        console.log('✅ [WHATSAPP SERVICE] Mensagem enviada com sucesso!');
        console.log(`📧 [WHATSAPP SERVICE] ID da mensagem: ${responseData.messages[0].id}`);
        
        return {
          success: true,
          messageId: responseData.messages[0].id,
          phone: formattedPhone,
          timestamp: new Date().toISOString()
        };
      } else {
        console.error('❌ [WHATSAPP SERVICE] Erro na resposta da API:', responseData);
        throw new Error(responseData.error?.message || 'Erro desconhecido na API do WhatsApp');
      }

    } catch (error) {
      console.error('❌ [WHATSAPP SERVICE] Erro ao enviar mensagem:', error);
      throw new Error(`Erro no envio do WhatsApp: ${error.message}`);
    }
  }

  /**
   * Envia receita completa via WhatsApp
   * @param {Object} recipe - Dados da receita
   * @param {Object} userData - Dados do usuário
   * @returns {Promise} Resultado do envio
   */
  async sendRecipe(recipe, userData) {
    try {
      console.log('🔄 [WHATSAPP SERVICE] Preparando envio de receita...');
      console.log(`📋 [WHATSAPP SERVICE] Receita: ${recipe.titulo}`);
      console.log(`👤 [WHATSAPP SERVICE] Usuário: ${userData.name} (${userData.phone})`);

      const message = this.createRecipeMessage(recipe, userData);
      const result = await this.sendTextMessage(userData.phone, message);

      console.log('✅ [WHATSAPP SERVICE] Receita enviada com sucesso!');
      
      return {
        ...result,
        recipe: recipe.titulo,
        user: userData.name,
        method: 'whatsapp'
      };

    } catch (error) {
      console.error('❌ [WHATSAPP SERVICE] Erro ao enviar receita:', error);
      throw error;
    }
  }

  /**
   * Envia template de mensagem (para casos específicos)
   * @param {String} phoneNumber - Número do destinatário
   * @param {String} templateName - Nome do template
   * @param {Array} parameters - Parâmetros do template
   * @returns {Promise} Resultado do envio
   */
  async sendTemplate(phoneNumber, templateName, parameters = []) {
    if (!this.isConfigured) {
      throw new Error('WhatsApp Service não está configurado.');
    }

    try {
      console.log(`📱 [WHATSAPP SERVICE] Enviando template: ${templateName}`);

      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const payload = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'pt_BR'
          },
          components: parameters.length > 0 ? [{
            type: 'body',
            parameters: parameters.map(param => ({ type: 'text', text: param }))
          }] : []
        }
      };

      const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (response.ok && responseData.messages) {
        console.log('✅ [WHATSAPP SERVICE] Template enviado com sucesso!');
        return {
          success: true,
          messageId: responseData.messages[0].id,
          template: templateName
        };
      } else {
        throw new Error(responseData.error?.message || 'Erro no envio do template');
      }

    } catch (error) {
      console.error('❌ [WHATSAPP SERVICE] Erro ao enviar template:', error);
      throw error;
    }
  }

  /**
   * Valida se um número de telefone está no WhatsApp
   * @param {String} phoneNumber - Número a ser validado
   * @returns {Promise} Status da validação
   */
  async validatePhoneNumber(phoneNumber) {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      // Simulação de validação (em produção, usar endpoint de validação da API)
      console.log(`🔍 [WHATSAPP SERVICE] Validando número: ${formattedPhone}`);
      
      // Por enquanto, aceita números brasileiros com 13 dígitos (55 + DDD + número)
      const isValid = formattedPhone.length === 13 && formattedPhone.startsWith('55');
      
      return {
        isValid,
        formattedNumber: formattedPhone,
        message: isValid ? 'Número válido' : 'Formato de número inválido'
      };
      
    } catch (error) {
      console.error('❌ [WHATSAPP SERVICE] Erro na validação:', error);
      return {
        isValid: false,
        message: error.message
      };
    }
  }

  /**
   * Obtém status do serviço WhatsApp
   * @returns {Object} Status do serviço
   */
  getServiceStatus() {
    return {
      configured: this.isConfigured,
      apiUrl: this.apiUrl,
      hasAccessToken: !!this.accessToken,
      hasPhoneNumberId: !!this.phoneNumberId,
      businessName: this.businessName
    };
  }
}

module.exports = WhatsAppService;