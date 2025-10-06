/**
 * Script Pós-Build - Instalar dependências do backend
 * Este script é executado pelo electron-builder após empacotar os arquivos
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.default = async function(context) {
  const appOutDir = context.appOutDir;
  
  console.log('\n📦 AfterPack Hook - Iniciando...');
  console.log('📂 App Output Dir:', appOutDir);
  
  // Procurar pelo backend em diferentes locais possíveis
  const possiblePaths = [
    path.join(appOutDir, 'resources', 'backend'),
    path.join(appOutDir, 'resources', 'app', 'backend'),
    path.join(appOutDir, 'backend'),
  ];
  
  let backendPath = null;
  
  for (const testPath of possiblePaths) {
    console.log('� Testando:', testPath);
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
          console.log(`${indent}${stats.isDirectory() ? '�' : '📄'} ${item}`);
          if (stats.isDirectory() && indent.length < 8) {
            listDir(fullPath, indent + '  ');
          }
        });
      };
      listDir(appOutDir);
    } catch (err) {
      console.error('Erro ao listar diretório:', err.message);
    }
    return; // Não falhar o build, apenas avisar
  }
  
  const packageJsonPath = path.join(backendPath, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json não encontrado em:', packageJsonPath);
    return;
  }
  
  console.log('📦 Instalando dependências do backend...');
  
  try {
    // Instalar dependências de produção apenas
    execSync('npm install --production --no-optional', {
      cwd: backendPath,
      stdio: 'inherit'
    });
    
    console.log('✅ Dependências do backend instaladas com sucesso\n');
  } catch (error) {
    console.error('❌ Erro ao instalar dependências do backend:', error.message);
    // Não lançar erro para não falhar o build
  }
};
