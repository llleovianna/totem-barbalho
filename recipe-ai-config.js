// ARQUIVO: assets/js/recipe-ai-config.js (VERSÃO CORRETA)

const recipeAIConfig = {
    // 1. Ingredientes comuns para os checkboxes
    commonIngredients: [
        { name: 'Cebola', value: 'cebola', icon: 'fas fa-circle' },
        { name: 'Alho', value: 'alho', icon: 'fas fa-circle' },
        { name: 'Tomate', value: 'tomate', icon: 'fas fa-apple-alt' },
        { name: 'Azeite', value: 'azeite', icon: 'fas fa-oil-can' },
        { name: 'Sal', value: 'sal', icon: 'fas fa-circle' },
        { name: 'Pimenta', value: 'pimenta', icon: 'fas fa-pepper-hot' },
        { name: 'Ovos', value: 'ovos', icon: 'fas fa-egg' },
        { name: 'Leite', value: 'leite', icon: 'fas fa-glass-whiskey' },
    ],

    // 2. Restrições alimentares para os checkboxes
    dietaryRestrictions: [
        { name: 'Vegetariano', value: 'vegetariano', icon: 'fas fa-leaf' },
        { name: 'Vegano', value: 'vegano', icon: 'fas fa-seedling' },
        { name: 'Sem Glúten', value: 'sem-gluten', icon: 'fas fa-ban' },
        { name: 'Sem Lactose', value: 'sem-lactose', icon: 'fas fa-ban' },
    ],

    // 3. Lista gigante de ingredientes para o autocomplete
    getAllPossibleIngredients: () => {
        const carnesEProteinas = ['Frango', 'Peito de Frango', 'Coxa de Frango', 'Carne Bovina', 'Patinho Moído', 'Alcatra', 'Carne de Porco', 'Lombo', 'Bacon', 'Calabresa', 'Linguiça', 'Peixe', 'Tilápia', 'Salmão', 'Atum Enlatado', 'Camarão', 'Ovos', 'Tofu'];
        const laticiniosEDerivados = ['Leite', 'Leite de Coco', 'Leite Condensado', 'Creme de Leite', 'Iogurte Natural', 'Manteiga', 'Requeijão', 'Queijo Mussarela', 'Queijo Parmesão', 'Ricota', 'Cream Cheese'];
        const vegetaisEVerduras = ['Abóbora', 'Abobrinha', 'Alface', 'Alho', 'Alho-poró', 'Batata', 'Batata-doce', 'Berinjela', 'Beterraba', 'Brócolis', 'Cebola', 'Cenoura', 'Couve', 'Couve-flor', 'Espinafre', 'Mandioca', 'Mandioquinha', 'Milho', 'Palmito', 'Pepino', 'Pimentão', 'Repolho', 'Rúcula', 'Tomate'];
        const frutas = ['Abacate', 'Abacaxi', 'Banana', 'Laranja', 'Limão', 'Maçã', 'Mamão', 'Manga', 'Maracujá', 'Melancia', 'Morango', 'Uva'];
        const graosECereais = ['Arroz Branco', 'Arroz Integral', 'Aveia', 'Feijão Carioca', 'Feijão Preto', 'Grão de Bico', 'Lentilha', 'Quinoa'];
        const massasEPães = ['Macarrão Espaguete', 'Macarrão Parafuso', 'Lasanha', 'Pão de Forma'];
        const temperosEEspeciarias = ['Açafrão', 'Alecrim', 'Canela', 'Coentro', 'Cominho', 'Cravo', 'Curry', 'Gengibre', 'Hortelã', 'Louro', 'Manjericão', 'Orégano', 'Páprica', 'Pimenta do Reino', 'Sal', 'Salsa', 'Cebolinha', 'Tomilho'];
        const outros = ['Açúcar', 'Azeite de Oliva', 'Farinha de Trigo', 'Farinha de Mandioca', 'Fubá', 'Chocolate em Pó', 'Mel', 'Molho de Soja', 'Vinagre'];
        const todos = [...carnesEProteinas, ...laticiniosEDerivados, ...vegetaisEVerduras, ...frutas, ...graosECereais, ...massasEPães, ...temperosEEspeciarias, ...outros];
        return [...new Set(todos)].sort((a, b) => a.localeCompare(b));
    }
};