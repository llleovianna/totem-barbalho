const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

/**
 * Serviço de geração de PDF personalizado para receitas
 * Barbalho Alimentos - IA Culinária
 */
class PDFService {
  constructor() {
    // Caminho para o logo PNG local (muito menor que base64)
    this.logoPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'logo-barbalho.png');
    
    // Carregar logo como data URI uma única vez (otimizado)
    this.logoDataUri = this.getOptimizedLogoDataUri();
  }

  /**
   * Converte logo PNG local para data URI otimizado
   * @returns {String} Data URI do logo
   */
  getOptimizedLogoDataUri() {
    try {
      if (fs.existsSync(this.logoPath)) {
        const logoBuffer = fs.readFileSync(this.logoPath);
        const base64Logo = logoBuffer.toString('base64');
        console.log(`📸 [PDF SERVICE] Logo carregado: ${(logoBuffer.length / 1024).toFixed(2)} KB`);
        return `data:image/png;base64,${base64Logo}`;
      } else {
        console.warn('⚠️  [PDF SERVICE] Logo não encontrado, usando fallback SVG');
        // Fallback: SVG simples e leve
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNDODEwMkUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhcmJhbGhvPC90ZXh0Pjwvc3ZnPg==';
      }
    } catch (error) {
      console.error('❌ [PDF SERVICE] Erro ao carregar logo:', error.message);
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNDODEwMkUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhcmJhbGhvPC90ZXh0Pjwvc3ZnPg==';
    }
  }

  /**
   * Gera conteúdo HTML personalizado para a receita
   * @param {Object} recipe - Dados da receita gerada
   * @param {Object} userData - Dados do usuário
   * @returns {String} HTML string do PDF
   */
  generateRecipePDFContent(recipe, userData) {
    const firstName = userData.name.split(' ')[0];
    const currentDate = new Date().toLocaleString('pt-BR');
    const currentYear = new Date().getFullYear();

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Receita: ${recipe.titulo} - Barbalho Alimentos</title>
          <style>
            :root {
              --barbalho-red: #C8102E;
              --barbalho-red-dark: #A00E26;
              --barbalho-yellow: #FFD23F;
              --barbalho-brown: #A0522D;
              --barbalho-gray-800: #262626;
              --barbalho-gray-600: #525252;
              --barbalho-gradient-primary: linear-gradient(135deg, var(--barbalho-red), var(--barbalho-red-dark));
            }

            /* Reset e configurações básicas */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              margin: 10px;
              color: var(--barbalho-gray-800);
              background-color: #f9f9f9;
              font-size: 0.9em;
              line-height: 1.5;
            }

            .page-container {
              max-width: 95%;
              margin: 10px auto;
              padding: 20px 25px;
              background: white;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              border-radius: 8px;
            }

            /* Cabeçalho do PDF */
            .pdf-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-bottom: 20px;
              border-bottom: 3px solid var(--barbalho-red);
              margin-bottom: 25px;
            }

            .pdf-header img {
              max-height: 60px;
              width: auto;
            }

            .pdf-header .brand-title {
              font-family: 'Italianno', cursive;
              font-size: 2.4rem;
              color: var(--barbalho-red);
              text-align: right;
              font-weight: 700;
            }

            /* Mensagem personalizada */
            .personal-message {
              background: linear-gradient(135deg, #fff3cd, #fef7e0);
              border-left: 5px solid var(--barbalho-yellow);
              padding: 20px 25px;
              margin-bottom: 25px;
              border-radius: 8px;
              font-style: italic;
              text-align: center;
              font-size: 1.1em;
              box-shadow: 0 2px 10px rgba(255, 210, 63, 0.2);
            }

            .personal-message strong {
              color: var(--barbalho-red);
              font-size: 1.2em;
            }

            /* Título da receita */
            h1 {
              font-size: 2rem;
              font-weight: 700;
              color: var(--barbalho-red);
              margin: 0 0 15px 0;
              line-height: 1.2;
              text-align: center;
            }

            .recipe-description {
              font-style: italic;
              color: var(--barbalho-gray-600);
              margin-bottom: 20px;
              text-align: center;
              font-size: 1.1em;
            }

            /* Meta informações da receita */
            .recipe-meta {
              display: flex;
              justify-content: space-around;
              flex-wrap: wrap;
              gap: 15px;
              font-size: 0.95rem;
              color: var(--barbalho-gray-600);
              margin-bottom: 25px;
              background: #f8f9fa;
              padding: 15px 20px;
              border-radius: 10px;
              border: 1px solid #e9ecef;
            }

            .recipe-meta span {
              display: flex;
              align-items: center;
              gap: 8px;
              font-weight: 500;
            }

            .recipe-meta strong {
              color: var(--barbalho-gray-800);
            }

            /* Conteúdo principal da receita */
            .recipe-content {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 25px;
            }

            .recipe-section h2 {
              font-size: 1.4rem;
              font-weight: 700;
              color: var(--barbalho-gray-800);
              border-bottom: 3px solid var(--barbalho-yellow);
              padding-bottom: 10px;
              margin-top: 0;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              gap: 10px;
            }

            /* Listas de ingredientes e instruções */
            ul, ol {
              padding-left: 25px;
              font-size: 0.95rem;
              line-height: 1.7;
            }

            ul li, ol li {
              margin-bottom: 10px;
            }

            ul li {
              list-style-type: none;
              position: relative;
            }

            ul li::before {
              content: '🔸';
              position: absolute;
              left: -20px;
              color: var(--barbalho-red);
            }

            ol li {
              font-weight: 500;
            }

            /* Seção de dicas */
            .tips-section {
              margin-top: 25px;
              padding: 20px;
              background: linear-gradient(135deg, #FFFBEB, #FEF7E0);
              border-left: 5px solid var(--barbalho-yellow);
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(255, 210, 63, 0.1);
            }

            .tips-section h2 {
              border-bottom: 2px solid var(--barbalho-yellow);
              padding-bottom: 8px;
              margin-bottom: 15px;
              font-size: 1.3rem;
            }

            .tips-section ul li::before {
              content: '💡';
            }

            /* Mensagem de despedida */
            .farewell-message {
              background: linear-gradient(135deg, #e8f5e8, #f0f9f0);
              border-left: 5px solid #3BB273;
              padding: 20px 25px;
              margin: 25px 0;
              border-radius: 10px;
              text-align: center;
              font-style: italic;
              font-size: 1.05em;
              box-shadow: 0 2px 10px rgba(59, 178, 115, 0.1);
            }

            .farewell-message strong {
              color: #2d8f47;
              font-size: 1.1em;
            }

            /* Seção de Dicas Aprimorada */
            .tips-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 15px;
              margin-top: 15px;
            }

            .tip-card {
              background: #f9f9f9;
              border-radius: 8px;
              padding: 15px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              transition: transform 0.2s ease;
            }

            .tip-card:hover {
              transform: translateY(-2px);
            }

            .tip-icon {
              font-size: 1.5em;
              margin-bottom: 8px;
              display: block;
            }

            .tip-text {
              font-size: 0.9em;
              line-height: 1.5;
              color: var(--barbalho-gray-800);
            }

            /* Rodapé */
            .pdf-footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #ddd;
              text-align: center;
              font-size: 0.85rem;
              color: var(--barbalho-gray-600);
              line-height: 1.6;
            }

            .pdf-footer p {
              margin-bottom: 8px;
            }

            .pdf-footer .generation-info {
              font-weight: 600;
              color: var(--barbalho-red);
              margin-bottom: 12px;
            }

            .pdf-footer .copyright {
              font-size: 0.8rem;
              color: var(--barbalho-gray-600);
            }

            /* Otimizações para impressão */
            @media print {
              body {
                background-color: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .page-container {
                box-shadow: none;
                margin: 0;
                padding: 15px;
                width: 100%;
                max-width: none;
              }
              
              .pdf-header {
                margin-bottom: 15px;
                padding-bottom: 15px;
              }
              
              .recipe-meta {
                margin-bottom: 15px;
              }
              
              .recipe-content {
                gap: 20px;
                margin-bottom: 15px;
              }
              
              h1, h2 {
                margin-bottom: 10px;
              }
              
              .tips-section, .farewell-message {
                margin: 15px 0;
                padding: 15px;
                page-break-inside: avoid;
              }
              
              .personal-message {
                margin-bottom: 15px;
                padding: 15px 20px;
                page-break-inside: avoid;
              }
            }

            /* Responsividade para telas menores */
            @media (max-width: 768px) {
              .recipe-content {
                grid-template-columns: 1fr;
                gap: 20px;
              }
              
              .recipe-meta {
                flex-direction: column;
                text-align: center;
              }
              
              .pdf-header {
                flex-direction: column;
                text-align: center;
                gap: 15px;
              }
            }
          </style>
        </head>
        
        <body>
          <div class="page-container">
            <!-- Cabeçalho com logo e título -->
            <header class="pdf-header">
              <img src="${this.logoDataUri}" alt="Logo Barbalho Alimentos">
              <div class="brand-title">Receita Exclusiva</div>
            </header>

            <!-- Mensagem personalizada -->
            <div class="personal-message">
              <p><strong>Olá, ${firstName}!</strong></p>
              <p>Esta receita foi criada especialmente para você pela nossa <strong>IA Culinária Barbalho</strong>.</p>
              <p>Esperamos que aproveite cada sabor e que esta receita traga momentos deliciosos para sua mesa! 🍽️</p>
            </div>

            <!-- Conteúdo principal -->
            <main>
              <h1>${recipe.titulo}</h1>
              
              ${recipe.descricao ? `<p class="recipe-description">${recipe.descricao}</p>` : ''}

              <!-- Meta informações -->
              <div class="recipe-meta">
                <span><strong>⏱️ Tempo de Preparo:</strong> ${recipe.tempoPreparo || '30 minutos'}</span>
                <span><strong>👥 Rendimento:</strong> ${recipe.porcoes || '4 porções'}</span>
                <span><strong>⭐ Dificuldade:</strong> ${recipe.dificuldade || 'Fácil'}</span>
                <span><strong>🍽️ Categoria:</strong> ${recipe.categoria || 'Prato Principal'}</span>
              </div>

              <!-- Ingredientes e Modo de Preparo -->
              <div class="recipe-content">
                <div class="recipe-section">
                  <h2>📋 Ingredientes</h2>
                  <ul>
                    ${recipe.ingredientes.map(ingrediente => `<li>${ingrediente}</li>`).join('')}
                  </ul>
                </div>
                
                <div class="recipe-section">
                  <h2>👩‍🍳 Modo de Preparo</h2>
                  <ol>
                    ${recipe.instrucoes.map(instrucao => `<li>${instrucao}</li>`).join('')}
                  </ol>
                </div>
              </div>

              <!-- Dicas especiais (se existirem) -->
              ${recipe.dicas && recipe.dicas.length > 0 ? `
              <div class="tips-section">
                <h2>💡 Dicas Especiais da IA</h2>
                <div class="tips-grid">
                  ${recipe.dicas.map((dica, index) => {
                    const icons = ['🎯', '✨', '🔥', '💎', '🌟', '⚡'];
                    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'];
                    return `
                    <div class="tip-card" style="border-left: 4px solid ${colors[index % colors.length]}">
                      <div class="tip-icon">${icons[index % icons.length]}</div>
                      <div class="tip-text">${dica}</div>
                    </div>
                    `;
                  }).join('')}
                </div>
              </div>` : ''}

              <!-- Mensagem de despedida -->
              <div class="farewell-message">
                <p><strong>Obrigado por experimentar nossa IA Culinária Barbalho, ${firstName}!</strong></p>
                <p>Desejamos uma excelente degustação e uma ótima feira!</p>
                <p>Que esta receita traga momentos deliciosos e muito sabor para sua mesa. 🍽️❤️</p>
              </div>
            </main>

            <!-- Rodapé -->
            <footer class="pdf-footer">
              <p class="generation-info"><strong>📅 Receita gerada em:</strong> ${currentDate}</p>
              <p class="copyright"><strong>© ${currentYear} Barbalho Alimentos</strong> - Qualidade que alimenta gerações</p>
              <p>🤖 <strong>Gerado por:</strong> Assistente de Receitas IA Barbalho Alimentos</p>
              <p>🌟 Inovação e tradição em cada ingrediente 🌟</p>
            </footer>
          </div>

          <!-- Script para impressão automática -->
          <script>
            window.onload = function() {
              // Aguarda o carregamento completo antes de imprimir
              setTimeout(function() {
                window.print();
                
                // Fecha a janela após a impressão (opcional)
                window.onafterprint = function() {
                  setTimeout(function() {
                    window.close();
                  }, 1000);
                };
              }, 1000);
            };
          </script>
        </body>
      </html>
    `;
  }

  /**
   * Gera PDF usando Puppeteer e retorna Buffer
   * @param {Object} recipe - Dados da receita gerada
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<Buffer>} Buffer do PDF gerado
   */
  async generatePDFBuffer(recipe, userData) {
    let browser = null;
    
    try {
      console.log('🔄 [PDF SERVICE] Iniciando geração de PDF com Puppeteer...');
      console.log(`📊 [PDF SERVICE] Receita: ${recipe.titulo}`);
      console.log(`👤 [PDF SERVICE] Usuário: ${userData?.name || 'Anônimo'}`);

      // Gera HTML da receita
      const htmlContent = this.generateRecipePDFContent(recipe, userData || {});
      console.log(`📄 [PDF SERVICE] HTML gerado com ${htmlContent.length} caracteres`);
      
      // Inicia o Puppeteer
      console.log('🌐 [PDF SERVICE] Lançando browser Puppeteer...');
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
        timeout: 30000 // 30 segundos timeout
      });

      const page = await browser.newPage();
      
      // Define timeout para a página
      page.setDefaultTimeout(30000);
      page.setDefaultNavigationTimeout(30000);
      
      console.log('📝 [PDF SERVICE] Definindo conteúdo HTML...');
      
      // Define o conteúdo HTML (sem aguardar recursos externos)
      await page.setContent(htmlContent, {
        waitUntil: 'domcontentloaded', // Mudado de 'networkidle0' para 'domcontentloaded'
        timeout: 30000
      });

      console.log('🖨️  [PDF SERVICE] Gerando PDF...');
      
      // Gera o PDF como Buffer
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm'
        },
        displayHeaderFooter: false,
        preferCSSPageSize: true,
        timeout: 30000
      });

      await browser.close();
      browser = null;

      console.log('✅ [PDF SERVICE] PDF gerado com sucesso via Puppeteer!');
      console.log(`📊 [PDF SERVICE] Tamanho do buffer: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);

      // Validação: PDF deve ter tamanho razoável (entre 10KB e 5MB)
      if (pdfBuffer.length < 10000) {
        throw new Error('PDF gerado é muito pequeno, provavelmente corrompido');
      }
      if (pdfBuffer.length > 5 * 1024 * 1024) {
        throw new Error('PDF gerado é muito grande, provavelmente contém dados inválidos');
      }

      return pdfBuffer;

    } catch (error) {
      console.error('❌ [PDF SERVICE] Erro ao gerar PDF com Puppeteer:', error);
      console.error('📊 [PDF SERVICE] Stack trace:', error.stack);
      
      // Fecha o browser se ainda estiver aberto
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('❌ [PDF SERVICE] Erro ao fechar browser:', closeError);
        }
      }
      
      throw new Error(`Erro na geração do PDF: ${error.message}`);
    }
  }

  /**
   * Gera e abre janela de impressão com PDF personalizado
   * @param {Object} recipe - Dados da receita
   * @param {Object} userData - Dados do usuário
   * @returns {Promise} Promise de geração do PDF
   */
  async generateAndPrintPDF(recipe, userData) {
    try {
      console.log('🔄 [PDF SERVICE] Iniciando geração de PDF personalizado...');
      console.log(`📊 [PDF SERVICE] Receita: ${recipe.titulo}`);
      console.log(`👤 [PDF SERVICE] Usuário: ${userData.name}`);

      const htmlContent = this.generateRecipePDFContent(recipe, userData);
      
      // Simula a criação do PDF (em produção poderia usar puppeteer, jsPDF, etc.)
      const pdfData = {
        html: htmlContent,
        title: `Receita: ${recipe.titulo} - Barbalho Alimentos`,
        fileName: `receita-${recipe.titulo.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`,
        metadata: {
          title: recipe.titulo,
          author: 'IA Culinária Barbalho',
          subject: 'Receita Personalizada',
          creator: 'Barbalho Alimentos',
          producer: 'Sistema IA Culinária',
          creationDate: new Date(),
          keywords: 'receita, barbalho, culinária, IA'
        }
      };

      console.log('📄 [PDF SERVICE] PDF gerado com sucesso!');
      console.log(`📁 [PDF SERVICE] Nome do arquivo: ${pdfData.fileName}`);
      
      return {
        success: true,
        message: 'PDF gerado com sucesso',
        data: pdfData
      };

    } catch (error) {
      console.error('❌ [PDF SERVICE] Erro ao gerar PDF:', error);
      throw new Error(`Erro na geração do PDF: ${error.message}`);
    }
  }

  /**
   * Salva PDF em arquivo (para uso futuro com bibliotecas como puppeteer)
   * @param {Object} recipe - Dados da receita
   * @param {Object} userData - Dados do usuário
   * @param {String} outputPath - Caminho para salvar o arquivo
   * @returns {Promise} Promise de salvamento
   */
  async savePDFToFile(recipe, userData, outputPath) {
    try {
      const pdfResult = await this.generateAndPrintPDF(recipe, userData);
      const htmlContent = pdfResult.data.html;
      
      // Salva o HTML (em produção seria o PDF binário)
      const filePath = path.join(outputPath, pdfResult.data.fileName.replace('.pdf', '.html'));
      fs.writeFileSync(filePath, htmlContent, 'utf8');
      
      console.log(`💾 [PDF SERVICE] Arquivo salvo em: ${filePath}`);
      
      return {
        success: true,
        filePath: filePath,
        fileName: pdfResult.data.fileName
      };
      
    } catch (error) {
      console.error('❌ [PDF SERVICE] Erro ao salvar PDF:', error);
      throw error;
    }
  }
}

module.exports = PDFService;