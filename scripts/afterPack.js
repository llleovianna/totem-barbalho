/**
 * Script Pós-Build - Verificar empacotamento do backend
 * Este script é executado pelo electron-builder após empacotar os arquivos
 * 
 * IMPORTANTE: As dependências do backend devem ser instaladas ANTES do build
 * via `npm run build:production` que chama build-production.js
 */

const path = require('path');
const fs = require('fs');

exports.default = async function(context) {
  const appOutDir = context.appOutDir;
  
  console.log('\n📦 AfterPack Hook - Verificando empacotamento...');
  console.log('📂 App Output Dir:', appOutDir);
  
  // Procurar pelo backend em diferentes locais possíveis
  const possiblePaths = [
    path.join(appOutDir, 'resources', 'backend'),
    path.join(appOutDir, 'resources', 'app', 'backend'),
    path.join(appOutDir, 'backend'),
  ];
  
  let backendPath = null;
  
  for (const testPath of possiblePaths) {
    console.log('🔍 Testando:', testPath);
    if (fs.existsSync(testPath)) {
      backendPath = testPath;
      console.log('✅ Backend encontrado em:', backendPath);
      break;
    }
  }
  
  if (!backendPath) {
    console.error('❌ Backend não encontrado em nenhum dos caminhos testados');
    console.log('\n📂 Estrutura do appOutDir:');
    try {
      const listDir = (dir, indent = '') => {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          const stats = fs.statSync(fullPath);
          console.log(`${indent}${stats.isDirectory() ? '📁' : '📄'} ${item}`);
          if (stats.isDirectory() && indent.length < 8) {
            listDir(fullPath, indent + '  ');
          }
        });
      };
      listDir(appOutDir);
    } catch (err) {
      console.error('Erro ao listar diretório:', err.message);
    }
    throw new Error('Backend não encontrado no pacote!');
  }
  
  // Verificar arquivos críticos
  const criticalFiles = [
    { name: 'server.js', path: path.join(backendPath, 'server.js') },
    { name: 'package.json', path: path.join(backendPath, 'package.json') },
    { name: 'node_modules', path: path.join(backendPath, 'node_modules') },
    { name: '.env', path: path.join(backendPath, '.env') },
  ];
  
  console.log('\n📋 Verificando arquivos críticos:');
  let allFilesPresent = true;
  
  criticalFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      const stats = fs.statSync(file.path);
      if (stats.isDirectory()) {
        const itemCount = fs.readdirSync(file.path).length;
        console.log(`✅ ${file.name} (${itemCount} itens)`);
      } else {
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`✅ ${file.name} (${sizeKB} KB)`);
      }
    } else {
      if (file.name === '.env') {
        console.log(`⚠️  ${file.name} - NÃO INCLUÍDO (usuário deve configurar)`);
      } else {
        console.error(`❌ ${file.name} - AUSENTE!`);
        allFilesPresent = false;
      }
    }
  });
  
  if (!allFilesPresent) {
    throw new Error('Arquivos críticos ausentes no pacote!');
  }
  
  // Verificar dependências principais do backend
  const nodeModulesPath = path.join(backendPath, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    const criticalDeps = ['express', 'cors', '@google/generative-ai', 'dotenv'];
    console.log('\n📦 Verificando dependências críticas:');
    
    criticalDeps.forEach(dep => {
      const depPath = path.join(nodeModulesPath, dep);
      if (fs.existsSync(depPath)) {
        console.log(`✅ ${dep}`);
      } else {
        console.error(`❌ ${dep} - AUSENTE!`);
        allFilesPresent = false;
      }
    });
  }
  
  if (!allFilesPresent) {
    throw new Error('Dependências críticas ausentes! Execute: npm install no backend ANTES de rodar npm run dist:win');
  }
  
  console.log('\n✅ Empacotamento verificado com sucesso!\n');
};
