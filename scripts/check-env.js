#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do ambiente...\n');

// Verificar se Node.js tem a versão correta
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
    console.log('❌ Node.js versão 18+ é necessária. Versão atual:', nodeVersion);
    process.exit(1);
}
console.log('✅ Node.js versão:', nodeVersion);

// Verificar se as pastas existem
const backendPath = path.join(__dirname, '..', 'backend');
const frontendPath = path.join(__dirname, '..', 'frontend');

if (!fs.existsSync(backendPath)) {
    console.log('❌ Pasta backend não encontrada');
    process.exit(1);
}
console.log('✅ Pasta backend encontrada');

if (!fs.existsSync(frontendPath)) {
    console.log('❌ Pasta frontend não encontrada');
    process.exit(1);
}
console.log('✅ Pasta frontend encontrada');

// Verificar package.json do backend
const backendPackage = path.join(backendPath, 'package.json');
if (!fs.existsSync(backendPackage)) {
    console.log('❌ package.json do backend não encontrado');
    process.exit(1);
}
console.log('✅ package.json do backend encontrado');

// Verificar package.json do frontend
const frontendPackage = path.join(frontendPath, 'package.json');
if (!fs.existsSync(frontendPackage)) {
    console.log('❌ package.json do frontend não encontrado');
    process.exit(1);
}
console.log('✅ package.json do frontend encontrado');

// Verificar .env do backend
const envPath = path.join(backendPath, '.env');
const envExamplePath = path.join(backendPath, '.env.example');

if (!fs.existsSync(envPath)) {
    console.log('⚠️  Arquivo .env não encontrado no backend');
    
    if (fs.existsSync(envExamplePath)) {
        console.log('📝 Copiando .env.example para .env...');
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ Arquivo .env criado');
        console.log('🔑 IMPORTANTE: Configure sua chave da API Gemini em backend/.env');
        console.log('   GEMINI_API_KEY=AIzaSyA3TW_hG5btEfXuw1pZucbRQGA94qo3-iU-iU');
    } else {
        console.log('❌ .env.example também não encontrado');
        process.exit(1);
    }
} else {
    console.log('✅ Arquivo .env encontrado');
    
    // Verificar se a chave da API está configurada
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('GEMINI_API_KEY=AIzaSyA3TW_hG5btEfXuw1pZucbRQGA94qo3-iU') || 
        !envContent.includes('GEMINI_API_KEY=')) {
        console.log('⚠️  Chave da API Gemini não configurada');
        console.log('🔑 Configure GEMINI_API_KEY no arquivo backend/.env');
    } else {
        console.log('✅ Chave da API Gemini configurada');
    }
}

// Verificar node_modules
const backendModules = path.join(backendPath, 'node_modules');
const frontendModules = path.join(frontendPath, 'node_modules');

if (!fs.existsSync(backendModules)) {
    console.log('⚠️  Dependências do backend não instaladas');
    console.log('💡 Execute: npm run install:backend');
} else {
    console.log('✅ Dependências do backend instaladas');
}

if (!fs.existsSync(frontendModules)) {
    console.log('⚠️  Dependências do frontend não instaladas');
    console.log('💡 Execute: npm run install:frontend');
} else {
    console.log('✅ Dependências do frontend instaladas');
}

console.log('\n🎉 Verificação concluída!');
console.log('\n📋 Próximos passos:');
console.log('1. Configure a chave da API Gemini em backend/.env');
console.log('2. Execute: npm run setup (para instalar dependências)');
console.log('3. Execute: npm start (para iniciar o sistema)');