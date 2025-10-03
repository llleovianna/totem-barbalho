/**
 * Assistente de Receitas IA - Home Page
 * Sistema de geração de receitas usando IA com produtos Barbalho
 * VERSÃO CORRIGIDA
 */

class RecipeAIHome {
    constructor() {
        this.isModalOpen = false;
        // Centralizando o estado do formulário
        this.state = {
            selectedBarbalhoProducts: [],
            selectedCommonIngredients: [],
            customIngredients: [],
            dietaryRestrictions: [],
            difficulty: 'Fácil',
            servings: 4,
            cookingTime: 30,
            mealType: 'almoco',
            generatedRecipe: null
        };
        this.init();
    }
    
    init() {
        this.bindEvents();
    }

    // Usa a configuração do recipe-ai-config.js
    getCommonIngredients() { return recipeAIConfig.commonIngredients; }
    getDietaryRestrictions() { return recipeAIConfig.dietaryRestrictions; }
    getAllPossibleIngredients() { return recipeAIConfig.getAllPossibleIngredients(); }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#open-recipe-ai')) this.openModal();
            if (e.target.id === 'add-product-btn') this.addBarbalhoProduct();
            if (e.target.closest('.remove-product-btn')) this.removeBarbalhoProduct(e.target.closest('.remove-product-btn').dataset.productId);
            if (e.target.id === 'add-custom-ingredient-btn') this.addCustomIngredient();
            if (e.target.closest('.remove-custom-ingredient')) this.removeCustomIngredient(e.target.closest('.remove-custom-ingredient').dataset.ingredient);
            if (e.target.id === 'recipe-ai-modal') this.closeModal();
            if (e.target.closest('.remove-common-ingredient')) this.removeCommonIngredient(e.target.closest('.remove-common-ingredient').dataset.ingredientValue);
            if (e.target.id === 'recipe-ai-modal') this.closeModal();

            // Botões de navegação e ação do modal
            const action = e.target.dataset.action;
            if (action) {
                switch (action) {
                    case 'next-step': this.nextStep(); break;
                    case 'previous-step': this.previousStep(); break;
                    case 'generate-recipe': this.generateRecipe(); break;
                    case 'reset-steps': this.resetSteps(); break;
                    case 'generate-pdf': this.generatePDF(); break;
                    case 'close-modal': this.closeModal(); break;
                }
            }
        });
        
        // Listeners de input/change
        document.addEventListener('input', e => {
            if (e.target.id === 'custom-ingredient-input') this.handleIngredientAutocomplete();
        });
        
        document.addEventListener('change', e => {
            if (e.target.closest('.ingredient-option')) this.handleIngredientSelection(e);
            if (e.target.closest('.dietary-option')) this.handleDietarySelection(e);
        });
        
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.isModalOpen) this.closeModal();
        });
    }
    
    openModal() {
        const modal = document.getElementById('recipe-ai-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.isModalOpen = true;
            document.body.style.overflow = 'hidden';
            this.resetSteps();
            this.loadBarbalhoProducts();
            this.renderStep1Options(); // <-- ADICIONE ESTA LINHA
        }
    }
    
    closeModal() {
        // Parar as mensagens criativas ao fechar o modal
        this.stopCreativeLoadingMessages();
        
        const modal = document.getElementById('recipe-ai-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.isModalOpen = false;
            document.body.style.overflow = '';
        }
    }
    
    loadBarbalhoProducts() {
        console.log('🔄 [RECIPE AI] Tentando carregar produtos...');
        const select = document.getElementById('barbalho-products-select');
        if (!select) {
            console.warn('⚠️ [RECIPE AI] Select de produtos não encontrado');
            return;
        }
        
        try {
            if (typeof getAllProducts === 'function') {
                const products = getAllProducts();
                this.populateProductsDropdown(select, products);
                console.log(`📦 [RECIPE AI] ${products.length} produtos carregados`);
                return;
            }
            
            console.warn('⚠️ [RECIPE AI] Dados de produtos não disponíveis, usando produtos padrão');
            this.loadDefaultProducts(select);
            
        } catch (error) {
            console.error('❌ [RECIPE AI] Erro ao carregar produtos:', error);
            this.loadDefaultProducts(select);
        }
    }

    populateProductsDropdown(select, products) {
        select.innerHTML = '<option value="">Selecione um produto para adicionar</option>';
        
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.produto || product.name} - ${product.tipo || ''}`;
            option.dataset.name = product.produto || product.name;
            select.appendChild(option);
        });
        
        // Adicionar um event listener para o dropdown para adicionar produto ao mudar seleção
        select.addEventListener('change', () => {
            if (select.value) {
                this.addBarbalhoProduct();
            }
        });
        
        console.log('✅ [RECIPE AI] Dropdown de produtos populado com sucesso');
    }

    loadDefaultProducts(select) {
        const defaultProducts = [
            { id: 'arroz-agulhinha-tipo1-1kg', name: 'Arroz Agulhinha Tipo 1'},
            { id: 'feijao-carioca-goval-1kg', name: 'Feijão Carioca'},
            { id: 'macarrao-espaguete-semola-500g', name: 'Espaguete Sêmola'},
            { id: 'farinha-mandioca-1kg', name: 'Farinha de Mandioca'}
        ];
        
        this.populateProductsDropdown(select, defaultProducts);
        console.log(`📦 [RECIPE AI] ${defaultProducts.length} produtos padrão carregados`);
    }

    handleIngredientAutocomplete() {
        const input = document.getElementById('custom-ingredient-input');
        const dropdown = document.getElementById('autocomplete-dropdown');
        if (!input || !dropdown) return;
        
        const query = input.value.toLowerCase().trim();
        if (query.length < 2) {
            dropdown.classList.add('hidden');
            return;
        }
        
        const ingredients = this.getAllPossibleIngredients();
        const filteredIngredients = ingredients
            .filter(ing => ing.toLowerCase().includes(query))
            .slice(0, 8);
        
        if (filteredIngredients.length === 0) {
            dropdown.classList.add('hidden');
            return;
        }
        
        dropdown.innerHTML = '';
        filteredIngredients.forEach(ing => {
            const item = document.createElement('div');
            item.className = 'p-3 hover:bg-gray-100 cursor-pointer';
            item.textContent = ing;
            // Ao clicar, adiciona automaticamente o ingrediente
            item.addEventListener('click', () => {
                input.value = ing;
                dropdown.classList.add('hidden');
                // Adiciona automaticamente o ingrediente
                this.addCustomIngredient();
            });
            dropdown.appendChild(item);
        });
        
        dropdown.classList.remove('hidden');
    }
    
    getAllPossibleIngredients() { 
        return recipeAIConfig.getAllPossibleIngredients(); 
    }
    
    addCustomIngredient() {
        const input = document.getElementById('custom-ingredient-input');
        if (!input) return;
        
        const ingredient = input.value.trim();
        if (!ingredient) {
            alert('Por favor, digite um ingrediente antes de adicionar.');
            return;
        }
        
        if (this.state.customIngredients.includes(ingredient)) {
            alert('Este ingrediente já foi adicionado.');
            return;
        }
        
        this.state.customIngredients.push(ingredient);
        this.renderCustomIngredients();
        
        input.value = '';
        document.getElementById('autocomplete-dropdown').classList.add('hidden');
        
        console.log('➕ [RECIPE AI] Ingrediente personalizado adicionado:', ingredient);
    }
    
    removeCustomIngredient(ingredient) {
        this.state.customIngredients = this.state.customIngredients.filter(item => item !== ingredient);
        this.renderCustomIngredients();
        console.log('➖ [RECIPE AI] Ingrediente personalizado removido:', ingredient);
    }
    
    renderCustomIngredients() {
        const container = document.getElementById('custom-ingredients-container');
        if (!container) return;
        
        container.innerHTML = this.state.customIngredients.map(ingredient => `
            <div class="p-3 border-2 border-green-500 bg-green-50 rounded-lg flex items-center justify-between">
                <span class="text-sm font-semibold">${ingredient}</span>
                <button type="button" class="remove-custom-ingredient text-red-500 hover:text-red-700" data-ingredient="${ingredient}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    addBarbalhoProduct() {
        const select = document.getElementById('barbalho-products-select');
        const productId = select.value;
        if (!productId) {
            alert('Por favor, selecione um produto.');
            return;
        }
        if (this.state.selectedBarbalhoProducts.some(p => p.id === productId)) {
            alert('Este produto já foi adicionado.');
            return;
        }
        const productName = select.options[select.selectedIndex].dataset.name;
        this.state.selectedBarbalhoProducts.push({ id: productId, name: productName });
        this.renderSelectedProducts();
        select.value = '';
    }

    removeBarbalhoProduct(productId) {
        this.state.selectedBarbalhoProducts = this.state.selectedBarbalhoProducts.filter(p => p.id !== productId);
        this.renderSelectedProducts();
    }

    renderSelectedProducts() {
        const container = document.getElementById('selected-products');
        container.innerHTML = this.state.selectedBarbalhoProducts.map(p => `
            <div class="p-3 border-2 border-blue-500 bg-blue-50 rounded-lg flex items-center justify-between">
                <span class="text-sm font-semibold">${p.name}</span>
                <button type="button" class="remove-product-btn text-red-500 hover:text-red-700" data-product-id="${p.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    renderSelectedCommonIngredients() {
        const container = document.getElementById('selected-common-ingredients-container');
        if (!container) return;

        // Gera o HTML para cada ingrediente comum selecionado no estado
        container.innerHTML = this.state.selectedCommonIngredients.map(ingredient => `
            <div class="p-2 border-2 border-green-500 bg-green-50 rounded-lg flex items-center justify-between text-sm animate-fadeInUp">
                <span class="font-semibold text-green-800">${ingredient.name}</span>
                <button type="button" class="remove-common-ingredient ml-2 text-red-500 hover:text-red-700" data-ingredient-value="${ingredient.value}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }
    
    handleIngredientSelection(event) {
        const checkbox = event.target;
        const container = checkbox.closest('.ingredient-option').querySelector('div');
        
        // 1. Busca o objeto completo do ingrediente na nossa configuração
        const commonIngredient = this.getCommonIngredients().find(i => i.value === checkbox.value);
        
        // Se, por algum motivo, o ingrediente não for encontrado, interrompe a função
        if (!commonIngredient) return;

        // 2. Procura pelo ingrediente no estado atual
        const index = this.state.selectedCommonIngredients.findIndex(item => item.value === checkbox.value);

        if (checkbox.checked) {
            if (index === -1) {
                // 3. Adiciona o objeto com 'value' e 'name' ao estado
                this.state.selectedCommonIngredients.push({ 
                    value: commonIngredient.value, 
                    name: commonIngredient.name 
                });
            }
            container.classList.add('border-green-500', 'bg-green-50');
        } else {
            if (index > -1) {
                this.state.selectedCommonIngredients.splice(index, 1);
            }
            container.classList.remove('border-green-500', 'bg-green-50');
        }
        
        // Para depuração: veja o estado sendo atualizado no console
        console.log('Ingredientes Comuns Selecionados:', this.state.selectedCommonIngredients);
        this.renderSelectedCommonIngredients();
    }

    removeCommonIngredient(ingredientValue) {
        // Remove o ingrediente do estado
        this.state.selectedCommonIngredients = this.state.selectedCommonIngredients.filter(
            item => item.value !== ingredientValue
        );

        // Encontra o checkbox correspondente na lista para desmarcá-lo
        const checkbox = document.querySelector(`.ingredient-option input[value="${ingredientValue}"]`);
        if (checkbox) {
            checkbox.checked = false;
            
            // Remove também o estilo de destaque do checkbox
            const container = checkbox.closest('.ingredient-option').querySelector('div');
            container.classList.remove('border-green-500', 'bg-green-50');
        }

        // Renderiza novamente as tags para atualizar a exibição
        this.renderSelectedCommonIngredients();
    }

    handleDietarySelection(event) {
        const checkbox = event.target;
        const container = checkbox.closest('.dietary-option').querySelector('div');
        const restriction = checkbox.value;
        const index = this.state.dietaryRestrictions.indexOf(restriction);
    
        if (checkbox.checked) {
            if (index === -1) this.state.dietaryRestrictions.push(restriction);
            container.classList.add('border-red-500', 'bg-red-50');
        } else {
            if (index > -1) this.state.dietaryRestrictions.splice(index, 1);
            container.classList.remove('border-red-500', 'bg-red-50');
        }
    }

    nextStep() {
        document.getElementById('ai-step-1').classList.add('hidden');
        document.getElementById('ai-step-2').classList.remove('hidden');
    }

    previousStep() {
        document.getElementById('ai-step-2').classList.add('hidden');
        document.getElementById('ai-step-1').classList.remove('hidden');
    }

    renderStep1Options() {
        const commonIngredientsContainer = document.getElementById('common-ingredients-container');
        const dietaryRestrictionsContainer = document.getElementById('dietary-restrictions-container');

        // Gera o HTML para ingredientes comuns
        commonIngredientsContainer.innerHTML = this.getCommonIngredients().map(ing => `
            <label class="ingredient-option">
                <input type="checkbox" value="${ing.value}" class="hidden">
                <div class="p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                    <i class="${ing.icon} text-gray-600 mr-2"></i>
                    <span class="text-sm">${ing.name}</span>
                </div>
            </label>
        `).join('');

        // Gera o HTML para restrições alimentares
        dietaryRestrictionsContainer.innerHTML = this.getDietaryRestrictions().map(restriction => `
            <label class="dietary-option">
                <input type="checkbox" value="${restriction.value}" class="hidden">
                <div class="p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-500 transition-colors">
                    <i class="${restriction.icon} text-red-600 mr-2"></i>
                    <span class="text-sm">${restriction.name}</span>
                </div>
            </label>
        `).join('');
    }

    async generateRecipe() {
        this.state.difficulty = document.getElementById('ai-difficulty').value;
        this.state.cookingTime = parseInt(document.getElementById('ai-time').value);
        this.state.servings = parseInt(document.getElementById('ai-servings').value);
        this.state.mealType = document.getElementById('ai-meal-type').value;

        if (this.state.selectedBarbalhoProducts.length === 0) {
            this.showError('Por favor, selecione pelo menos um produto Barbalho para começar!');
            return;
        }

        this.showLoadingStep();

        try {
            console.log('🔄 [RECIPE AI] Iniciando geração de receita...');
            
            const requestData = {
                barbalhoProducts: this.state.selectedBarbalhoProducts,
                customIngredients: this.state.customIngredients,
                commonIngredients: this.state.selectedCommonIngredients,
                dietaryRestrictions: this.state.dietaryRestrictions,
                difficulty: this.state.difficulty,
                servings: this.state.servings,
                cookingTime: this.state.cookingTime,
                mealType: this.state.mealType
            };

            // Retry com múltiplas tentativas e URLs
            const recipe = await this.retryRequest(requestData);
            this.state.generatedRecipe = recipe;
            this.displayGeneratedRecipe(recipe);

        } catch (error) {
            console.error('❌ [RECIPE AI] Erro ao gerar receita:', error);
            this.showError(error.message);
        }
    }

    // Função para retry inteligente com múltiplas URLs
    async retryRequest(requestData, maxRetries = 3) {
        const urls = [
            'http://localhost:3000/generate-recipe',
            'http://127.0.0.1:3000/generate-recipe'
        ];

        let lastError;

        for (let urlIndex = 0; urlIndex < urls.length; urlIndex++) {
            const url = urls[urlIndex];
            
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    console.log(`🔄 Tentativa ${attempt} na URL ${url}`);
                    
                    // Mensagens específicas para tentativas de retry
                    const retryMessages = [
                        '🔄 Primeira tentativa... Preparando os ingredientes...',
                        '⚡ Segunda tentativa... Esquentando os motores...',
                        '🎯 Terceira tentativa... Concentrando na receita perfeita...'
                    ];
                    
                    if (attempt <= retryMessages.length) {
                        // Para tentativas de retry, usar mensagem específica
                        this.updateLoadingMessage(retryMessages[attempt - 1]);
                    }

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestData),
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({ error: 'Erro no servidor' }));
                        throw new Error(errorData.error || `Erro ${response.status}`);
                    }
                    
                    const recipe = await response.json();
                    
                    // Validar estrutura da receita
                    if (!recipe.titulo || !recipe.ingredientes || !recipe.instrucoes) {
                        throw new Error('Receita incompleta recebida');
                    }

                    console.log('✅ [RECIPE AI] Receita gerada com sucesso:', recipe.titulo);
                    
                    // Parar as mensagens criativas quando a receita for gerada com sucesso
                    this.stopCreativeLoadingMessages();
                    this.updateLoadingMessage('🎉 Receita pronta! Servindo quentinha para você...');
                    
                    return recipe;

                } catch (error) {
                    lastError = error;
                    console.log(`❌ Tentativa ${attempt} falhou:`, error.message);
                    
                    if (error.name === 'AbortError') {
                        lastError = new Error('Tempo limite excedido. Tente novamente.');
                    }
                    
                    // Se não é a última tentativa, aguardar antes de tentar novamente
                    if (attempt < maxRetries) {
                        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                        console.log(`⏱️ Aguardando ${delay}ms antes da próxima tentativa...`);
                        
                        // Mensagem durante a espera
                        this.updateLoadingMessage('⏰ Aguardando um pouquinho... A receita perfeita vale a espera!');
                        
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }
        }

        // Se chegou aqui, todas as tentativas falharam
        // Parar as mensagens criativas em caso de erro
        this.stopCreativeLoadingMessages();
        throw lastError || new Error('Não foi possível conectar com o servidor');
    }

    // Mostrar step de loading com mensagem dinâmica
    showLoadingStep() {
        document.getElementById('ai-step-2').classList.add('hidden');
        document.getElementById('ai-step-3').classList.remove('hidden');
        document.getElementById('ai-loading').classList.remove('hidden');
        document.getElementById('ai-result').classList.add('hidden');
        
        this.startCreativeLoadingMessages();
    }

    // Iniciar ciclo de mensagens criativas
    startCreativeLoadingMessages() {
        // Array expandido de mensagens criativas para o processo de geração
        const creativeMessages = [
            '🍳 Cozinhando ideias para você...',
            '👨‍🍳 Refogando uma receita inédita para você...',
            '🥘 Temperando os ingredientes perfeitos...',
            '🔥 Aquecendo os sabores da Barbalho...',
            '✨ Misturando tradição e inovação...',
            '🌿 Colhendo os melhores temperos...',
            '🥄 Mexendo a panela da criatividade...',
            '👩‍🍳 Nossa chef IA está inspirada hoje...',
            '🍲 Preparando algo delicioso com carinho...',
            '🎯 Calibrando o ponto perfeito...',
            '🧂 Ajustando o sal da vida...',
            '🔥 Deixando no fogo baixo para apurar...',
            '🌟 Criando uma receita digna da Barbalho...',
            '🍽️ Preparando a mesa para você...',
            '💡 Tendo uma ideia brilhante...',
            '🎨 Pintando sabores únicos...',
            '🏆 Criando uma receita premiada...',
            '❤️ Colocando amor em cada ingrediente...',
            '🥗 Selecionando os melhores ingredientes...',
            '🍯 Adoçando o processo com carinho...',
            '🌶️ Dando aquela pitada especial...',
            '🥄 Provando e ajustando os sabores...',
            '📖 Consultando receitas da vovó...',
            '🎭 Criando uma obra-prima culinária...',
            '🌺 Florindo sabores incríveis...',
            '⭐ Polvilhando uma pitada de magia...',
            '🎪 Fazendo malabarismos com os sabores...',
            '🎵 Harmonizando os ingredientes...',
            '🎯 Acertando na combinação perfeita...',
            '🥇 Buscando a receita de ouro...'
        ];

        let currentMessageIndex = 0;
        this.messageInterval = null;

        // Função para atualizar a mensagem
        const updateMessage = () => {
            const message = creativeMessages[currentMessageIndex];
            this.updateLoadingMessage(message);
            currentMessageIndex = (currentMessageIndex + 1) % creativeMessages.length;
        };

        // Mostra a primeira mensagem imediatamente
        updateMessage();

        // Configura o intervalo para trocar mensagens a cada 5 segundos
        this.messageInterval = setInterval(updateMessage, 5000);
    }

    // Parar o ciclo de mensagens quando necessário
    stopCreativeLoadingMessages() {
        if (this.messageInterval) {
            clearInterval(this.messageInterval);
            this.messageInterval = null;
        }
    }

    // Atualizar mensagem de loading
    updateLoadingMessage(message) {
        const loadingElement = document.getElementById('ai-loading');
        if (loadingElement) {
            const messageElement = loadingElement.querySelector('.loading-message') || 
                                 loadingElement.querySelector('p');
            if (messageElement) {
                messageElement.textContent = message;
                
                // Adicionar um efeito de fade suave para a troca de mensagens
                messageElement.style.opacity = '0';
                setTimeout(() => {
                    messageElement.style.opacity = '1';
                }, 100);
            }
        }
    }

    // Mostrar erro de forma mais elegante
    showError(errorMessage) {
        // Parar as mensagens criativas em caso de erro
        this.stopCreativeLoadingMessages();
        
        document.getElementById('ai-loading').classList.add('hidden');
        const resultDiv = document.getElementById('ai-result');
        resultDiv.classList.remove('hidden');
        
        // Classificar tipo de erro para melhor UX
        let iconClass = 'fas fa-exclamation-triangle';
        let title = 'Ops! Algo deu errado.';
        let bgClass = 'bg-red-50 border-red-200';
        let textClass = 'text-red-600';
        let titleClass = 'text-red-800';
        
        if (errorMessage.includes('tempo') || errorMessage.includes('timeout')) {
            iconClass = 'fas fa-clock';
            title = 'Tempo limite excedido';
            bgClass = 'bg-yellow-50 border-yellow-200';
            textClass = 'text-yellow-600';
            titleClass = 'text-yellow-800';
        } else if (errorMessage.includes('conectar') || errorMessage.includes('servidor')) {
            iconClass = 'fas fa-wifi';
            title = 'Problema de conexão';
            bgClass = 'bg-blue-50 border-blue-200';
            textClass = 'text-blue-600';
            titleClass = 'text-blue-800';
        }
        
        resultDiv.innerHTML = `
            <div class="text-center p-8 ${bgClass} border rounded-lg">
                <i class="${iconClass} ${textClass} text-4xl mb-4"></i>
                <h3 class="text-xl font-bold ${titleClass}">${title}</h3>
                <p class="${textClass} mt-2">${errorMessage}</p>
                <div class="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                    <button onclick="window.recipeAI.generateRecipe()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold">
                        <i class="fas fa-redo mr-2"></i>Tentar Novamente
                    </button>
                    <button onclick="window.recipeAI.previousStep()" class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition font-semibold">
                        <i class="fas fa-arrow-left mr-2"></i>Voltar
                    </button>
                </div>
            </div>
        `;
    }
    
    displayGeneratedRecipe(recipe) {
        // Parar as mensagens criativas quando a receita for exibida
        this.stopCreativeLoadingMessages();
        
        document.getElementById('ai-loading').classList.add('hidden');
        document.getElementById('ai-result').classList.remove('hidden');
        document.getElementById('generated-title').textContent = recipe.titulo;

        const content = document.getElementById('generated-content');
        // Usamos as chaves que definimos no nosso prompt
        content.innerHTML = `
            <p class="mb-4 italic text-gray-700">${recipe.descricao}</p>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 class="text-lg font-bold text-gray-800 mb-3"><i class="fas fa-list-ul mr-2 text-green-600"></i>Ingredientes</h4>
                    <ul class="space-y-2">${recipe.ingredientes.map(ing => `<li><i class="fas fa-check text-green-600 mr-2 text-sm"></i>${ing}</li>`).join('')}</ul>
                </div>
                <div>
                    <h4 class="text-lg font-bold text-gray-800 mb-3"><i class="fas fa-utensils mr-2 text-green-600"></i>Modo de Preparo</h4>
                    <ol class="space-y-3">${recipe.instrucoes.map((inst, i) => `<li class="flex items-start"><span class="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">${i + 1}</span><span>${inst}</span></li>`).join('')}</ol>
                </div>
            </div>
            ${recipe.dicas && recipe.dicas.length > 0 ? `
            <div class="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 class="text-lg font-bold text-gray-800 mb-3"><i class="fas fa-lightbulb mr-2 text-yellow-500"></i>Dicas da IA</h4>
                <ul class="space-y-2">${recipe.dicas.map(tip => `<li><i class="fas fa-star text-yellow-500 mr-2 text-sm"></i>${tip}</li>`).join('')}</ul>
            </div>
            ` : ''}
            <div class="mt-6 flex items-center justify-between text-sm text-gray-600 border-t pt-4">
                <span><i class="fas fa-clock mr-1"></i> ${this.cookingTime} min</span>
                <span><i class="fas fa-users mr-1"></i> ${this.servings} porções</span>
                <span><i class="fas fa-signal mr-1"></i> ${this.difficulty}</span>
            </div>`;
    }
    
    generatePDF() {
        const recipe = this.state.generatedRecipe;
        if (!recipe) {
            alert('Erro: Nenhuma receita foi gerada ainda.');
            return;
        }

        // URL pública do logo/favicon
        const logoUrl = 'https://barbalhoalimentos.com.br/wp-content/uploads/2022/09/cropped-favicon-192x192.png';

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Receita: ${recipe.titulo} - Barbalho Alimentos</title>
                    <link rel="icon" href="${logoUrl}" type="image/png">
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Italianno&display=swap" rel="stylesheet">

                    <style>
                        /* Definindo as variáveis de cor da Barbalho para o PDF */
                        :root {
                            --barbalho-red: #C8102E;
                            --barbalho-red-dark: #A00E26;
                            --barbalho-yellow: #FBB343;
                            --barbalho-brown: #A0522D;
                            --barbalho-gray-800: #262626;
                            --barbalho-gray-600: #525252;
                            --barbalho-gradient-primary: linear-gradient(135deg, var(--barbalho-red), var(--barbalho-red-dark));
                        }

                        /* Estilos Gerais Otimizados para Uma Página */
                        body {
                            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                            margin: 10px; /* Reduzindo margens */
                            color: var(--barbalho-gray-800);
                            background-color: #f9f9f9;
                            font-size: 0.9em; /* Reduzindo a fonte base */
                        }

                        .page-container {
                            max-width: 95%; /* Aumentando a largura disponível */
                            margin: 10px auto; /* Reduzindo margens */
                            padding: 15px 25px; /* Reduzindo padding */
                            background: white;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }

                        /* Cabeçalho do PDF Otimizado */
                        .pdf-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding-bottom: 10px; /* Reduzindo padding */
                            border-bottom: 2px solid var(--barbalho-red); /* Reduzindo a espessura da borda */
                            margin-bottom: 10px; /* Reduzindo margem */
                        }
                        .pdf-header img {
                            max-height: 50px; /* Reduzindo a altura do logo */
                        }
                        .pdf-header .brand-title {
                            font-family: 'Italianno', cursive;
                            font-size: 1.8rem; /* Reduzindo o tamanho da fonte */
                            color: var(--barbalho-red);
                            text-align: right;
                        }

                        /* Título e Meta Informações Otimizados */
                        h1 {
                            font-size: 1.6rem; /* Reduzindo o tamanho da fonte */
                            font-weight: 700;
                            color: var(--barbalho-red);
                            margin: 0 0 5px 0; /* Reduzindo margens */
                            line-height: 1.1;
                        }
                        .recipe-meta {
                            display: flex;
                            gap: 10px; /* Reduzindo o gap */
                            font-size: 0.8rem; /* Reduzindo o tamanho da fonte */
                            color: var(--barbalho-gray-600);
                            margin-bottom: 10px; /* Reduzindo margem */
                        }

                        /* Seções de Conteúdo Otimizadas */
                        .recipe-content {
                            display: grid;
                            grid-template-columns: 1fr 1fr; /* Tentando colocar mais conteúdo lado a lado */
                            gap: 15px; /* Reduzindo o gap */
                        }
                        h2 {
                            font-size: 1.2rem; /* Reduzindo o tamanho da fonte */
                            font-weight: 700;
                            color: var(--barbalho-gray-800);
                            border-bottom: 1px solid var(--barbalho-yellow); /* Reduzindo a espessura da borda */
                            padding-bottom: 5px; /* Reduzindo padding */
                            margin-top: 0;
                            margin-bottom: 8px; /* Reduzindo margem */
                        }

                        /* Listas Otimizadas */
                        ul, ol {
                            padding-left: 15px; /* Reduzindo o padding */
                            list-style-position: outside; /* Melhor para espaços menores */
                            font-size: 0.85rem; /* Reduzindo o tamanho da fonte */
                            line-height: 1.5; /* Reduzindo a altura da linha */
                        }
                        ul li, ol li {
                            margin-bottom: 5px; /* Reduzindo a margem */
                        }

                        /* Estilo para a lista de ingredientes */
                        ul {
                            list-style-type: disc; /* Usando o padrão para economizar espaço */
                        }
                        ul li::before {
                            content: ''; /* Removendo o marcador personalizado para economizar espaço */
                            color: var(--barbalho-red);
                            font-weight: bold;
                            display: inline-block;
                            width: 0;
                            margin-left: 0;
                        }
                        ul li {
                            padding-left: 1em;
                            text-indent: -1em;
                        }

                        /* Estilo para a lista de preparo */
                        ol {
                            list-style-type: decimal; /* Usando o padrão para economizar espaço */
                        }
                        ol li::before {
                            content: ''; /* Removendo o marcador personalizado para economizar espaço */
                            background: none;
                            color: black;
                            font-size: inherit;
                            font-weight: normal;
                            border-radius: 0;
                            width: auto;
                            height: auto;
                            flex-shrink: 0;
                            display: inline-block;
                            align-items: center;
                            justify-content: flex-start;
                            margin-right: 0;
                            margin-top: 0;
                        }
                        ol li {
                            padding-left: 1em;
                            text-indent: -1em;
                            display: list-item; /* Forçando a renderização como item de lista numerado */
                        }

                        /* Seção de Dicas Otimizada */
                        .tips-section {
                            margin-top: 15px; /* Reduzindo a margem */
                            padding: 10px; /* Reduzindo o padding */
                            background-color: #FFFBEB;
                            border-left: 3px solid var(--barbalho-yellow); /* Reduzindo a espessura da borda */
                            font-size: 0.85em; /* Reduzindo o tamanho da fonte */
                        }
                        .tips-section h2 {
                            border-bottom: none;
                            padding-bottom: 0;
                            margin-bottom: 5px; /* Reduzindo a margem */
                            font-size: 1em; /* Reduzindo o tamanho da fonte */
                        }
                        .tips-section ul li::before {
                            content: '💡';
                            margin-right: 5px; /* Reduzindo a margem */
                        }
                        .tips-section ul, .tips-section ol {
                            padding-left: 15px;
                        }

                        /* Rodapé do PDF Otimizado */
                        .pdf-footer {
                            margin-top: 15px; /* Reduzindo a margem */
                            padding-top: 10px; /* Reduzindo o padding */
                            border-top: 1px solid #ddd;
                            text-align: center;
                            font-size: 0.7rem; /* Reduzindo o tamanho da fonte */
                            color: var(--barbalho-gray-600);
                        }

                        /* Otimizações para Impressão Forçada em Uma Página */
                        @media print {
                            body {
                                background-color: white;
                                -webkit-print-color-adjust: exact; /* Garante que as cores sejam impressas */
                                print-color-adjust: exact;
                            }
                            .page-container {
                                box-shadow: none;
                                margin: 0;
                                padding: 0;
                                width: 100%;
                            }
                            .pdf-header {
                                margin-bottom: 5px;
                                padding-bottom: 5px;
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
                            /* Evita quebras de página dentro das seções, tenta manter tudo junto */
                            .recipe-section, .tips-section, .pdf-header, .pdf-footer, h1, .recipe-meta {
                                page-break-inside: avoid;
                                margin-bottom: 5px; /* Adicionando uma pequena margem entre as seções */
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="page-container">
                        <header class="pdf-header">
                            <img src="${logoUrl}" alt="Logo Barbalho Alimentos">
                            <div class="brand-title">Receita Exclusiva</div>
                        </header>
                        <main>

                            <h1>${recipe.titulo}</h1>
                            <p>${recipe.descricao || ''}</p>

                            <div class="recipe-meta">
                                <span><strong>Tempo:</strong> ${this.state.cookingTime} min</span>
                                <span><strong>Serve:</strong> ${this.state.servings} pessoas</span>
                                <span><strong>Dificuldade:</strong> ${this.state.difficulty}</span>
                            </div>

                            <div class="recipe-content">
                                <div class="recipe-section">
                                    <h2>Ingredientes</h2>
                                    <ul>${recipe.ingredientes.map(ing => `<li>${ing}</li>`).join('')}</ul>
                                </div>
                                <div class="recipe-section">
                                    <h2>Modo de Preparo</h2>
                                    <ol>${recipe.instrucoes.map(inst => `<li>${inst}</li>`).join('')}</ol>
                                </div>
                            </div>

                            ${recipe.dicas && recipe.dicas.length > 0 ? `
                            <div class="tips-section">
                                <h2>Dicas Especiais da IA</h2>
                                <ul>${recipe.dicas.map(tip => `<li>${tip}</li>`).join('')}</ul>
                            </div>` : ''}
                        </main>

                        <footer class="pdf-footer">
                            <p>Gerado por Assistente de Receitas IA Barbalho Alimentos</p>
                            <p>&copy; ${new Date().getFullYear()} Barbalho Alimentos. Qualidade que alimenta gerações.</p>
                        </footer>
                    </div>

                    <script>
                        window.onload = () => {
                            setTimeout(() => {
                                window.print();
                            }, 500);
                        };
                    <\/script>
                </body>
            </html>
        `);
        printWindow.document.close();
    }

    resetSteps() {
        // Reseta o estado para o valor inicial
        this.state.selectedBarbalhoProducts = [];
        this.state.selectedCommonIngredients = [];
        this.state.customIngredients = [];
        this.state.dietaryRestrictions = [];
        this.state.generatedRecipe = null;
        
        // Limpa a interface
        document.getElementById('selected-products').innerHTML = '';
        document.getElementById('custom-ingredients-container').innerHTML = '';
        this.renderSelectedCommonIngredients();
        document.getElementById('barbalho-products-select').value = '';
        
        document.querySelectorAll('.ingredient-option input:checked, .dietary-option input:checked').forEach(input => {
            input.checked = false;
            const container = input.closest('label').querySelector('div');
            container.classList.remove('border-green-500', 'bg-green-50', 'border-red-500', 'bg-red-50');
            container.classList.add('border-gray-200');
        });
        
        document.querySelectorAll('.ai-step').forEach(step => step.classList.add('hidden'));
        document.getElementById('ai-step-1').classList.remove('hidden');
        console.log('🔄 [RECIPE AI] Modal resetado.');
    }
    
    getCommonIngredients() { 
        return recipeAIConfig.commonIngredients; 
    }
    
    getDietaryRestrictions() { 
        return recipeAIConfig.dietaryRestrictions; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o elemento que abre o modal existe na página
    if (document.getElementById('open-recipe-ai')) {
        console.log('✅ [RECIPE AI] Página carregada, criando instância...');
        window.recipeAI = new RecipeAIHome();
    } else {
        console.log('ℹ️ [RECIPE AI] Botão de IA não encontrado nesta página. Assistente não inicializado.');
    }
});