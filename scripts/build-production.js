/**
 * Script de Build para Produção - Totem Barbalho
 * 
 * Este script automatiza todo o processo de build do aplicativo Electron,
 * preparando-o para distribuição em modo produção.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function step(stepNumber, message) {
  log(`\n${'='.repeat(70)}`, 'cyan');
  log(`📋 ETAPA ${stepNumber}: ${message}`, 'bright');
  log('='.repeat(70), 'cyan');
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function exec(command, cwd = process.cwd()) {
  try {
    log(`   Executando: ${command}`, 'blue');
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      shell: true 
    });
    return true;
  } catch (err) {
    error(`Erro ao executar: ${command}`);
    error(err.message);
    return false;
  }
}

// Verificar se Node.js está instalado
function checkNodeVersion() {
  step(1, 'Verificando ambiente Node.js');
  
  try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
    
    log(`   Node.js versão: ${nodeVersion}`, 'blue');
    
    if (majorVersion < 18) {
      error(`Node.js versão 18 ou superior é necessária. Versão atual: ${nodeVersion}`);
      process.exit(1);
    }
    
    success('Versão do Node.js compatível');
  } catch (err) {
    error('Erro ao verificar versão do Node.js');
    process.exit(1);
  }
}

// Verificar se todas as dependências estão instaladas
function checkDependencies() {
  step(2, 'Verificando dependências do projeto');
  
  const rootPackage = path.join(__dirname, '..', 'package.json');
  const backendPackage = path.join(__dirname, '..', 'backend', 'package.json');
  const frontendPackage = path.join(__dirname, '..', 'frontend', 'package.json');
  
  const checks = [
    { name: 'Root', path: rootPackage, nodeModules: path.join(__dirname, '..', 'node_modules') },
    { name: 'Backend', path: backendPackage, nodeModules: path.join(__dirname, '..', 'backend', 'node_modules') },
    { name: 'Frontend', path: frontendPackage, nodeModules: path.join(__dirname, '..', 'frontend', 'node_modules') },
  ];
  
  let needsInstall = false;
  
  checks.forEach(check => {
    if (fs.existsSync(check.nodeModules)) {
      success(`${check.name}: dependências instaladas`);
    } else {
      warning(`${check.name}: dependências NÃO instaladas`);
      needsInstall = true;
    }
  });
  
  if (needsInstall) {
    log('\n📦 Instalando dependências...', 'yellow');
    
    log('   Instalando dependências raiz...', 'blue');
    exec('npm install', path.join(__dirname, '..'));
    
    log('   Instalando dependências do backend...', 'blue');
    exec('npm install', path.join(__dirname, '..', 'backend'));
    
    log('   Instalando dependências do frontend...', 'blue');
    exec('npm install', path.join(__dirname, '..', 'frontend'));
    
    success('Todas as dependências instaladas');
  } else {
    success('Todas as dependências já estão instaladas');
  }
}

// Verificar arquivo .env do backend
function checkEnvFile() {
  step(3, 'Verificando arquivo de configuração .env');
  
  const envPath = path.join(__dirname, '..', 'backend', '.env');
  const envExamplePath = path.join(__dirname, '..', 'backend', '.env.example');
  
  if (!fs.existsSync(envPath)) {
    error('Arquivo .env não encontrado no backend!');
    
    if (fs.existsSync(envExamplePath)) {
      log('   Copiando .env.example para .env...', 'yellow');
      fs.copyFileSync(envExamplePath, envPath);
      warning('Arquivo .env criado a partir do .env.example');
      warning('IMPORTANTE: Configure a GEMINI_API_KEY no arquivo backend/.env antes de continuar!');
      process.exit(1);
    } else {
      error('Arquivo .env.example também não encontrado!');
      process.exit(1);
    }
  }
  
  // Verificar se a GEMINI_API_KEY está configurada
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (!envContent.includes('GEMINI_API_KEY=') || envContent.includes('sua_chave_api_gemini_aqui')) {
    warning('GEMINI_API_KEY não parece estar configurada corretamente!');
    warning('Verifique o arquivo backend/.env antes de fazer o build de produção.');
  } else {
    success('Arquivo .env encontrado e configurado');
  }
}

// Limpar builds anteriores
function cleanPreviousBuilds() {
  step(4, 'Limpando builds anteriores');
  
  const dirsToClean = [
    path.join(__dirname, '..', 'frontend', 'build'),
    path.join(__dirname, '..', 'dist'),
  ];
  
  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      log(`   Removendo: ${path.basename(dir)}`, 'blue');
      fs.rmSync(dir, { recursive: true, force: true });
      success(`${path.basename(dir)} removido`);
    } else {
      log(`   ${path.basename(dir)} não existe (ok)`, 'blue');
    }
  });
  
  success('Limpeza concluída');
}

// Build do frontend React
function buildFrontend() {
  step(5, 'Compilando frontend React');
  
  const frontendPath = path.join(__dirname, '..', 'frontend');
  const buildPath = path.join(frontendPath, 'build');
  
  log('   Isso pode levar alguns minutos...', 'yellow');
  
  if (!exec('npm run build', frontendPath)) {
    error('Falha ao compilar frontend');
    process.exit(1);
  }
  
  if (!fs.existsSync(buildPath)) {
    error('Pasta build não foi criada!');
    process.exit(1);
  }
  
  success('Frontend compilado com sucesso');
  
  // Verificar tamanho do build
  const stats = getDirSize(buildPath);
  log(`   Tamanho do build: ${(stats / 1024 / 1024).toFixed(2)} MB`, 'blue');
}

// Função auxiliar para calcular tamanho de diretório
function getDirSize(dirPath) {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      size += getDirSize(filePath);
    } else {
      size += stat.size;
    }
  });
  
  return size;
}

// Criar arquivo de licença
function createLicenseFile() {
  step(6, 'Criando arquivo de licença');
  
  const licensePath = path.join(__dirname, '..', 'LICENSE.txt');
  
  if (!fs.existsSync(licensePath)) {
    const licenseContent = `MIT License

Copyright (c) ${new Date().getFullYear()} Barbalho Alimentos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
    
    fs.writeFileSync(licensePath, licenseContent);
    success('Arquivo LICENSE.txt criado');
  } else {
    success('Arquivo LICENSE.txt já existe');
  }
}

// Verificar assets (ícones)
function checkAssets() {
  step(7, 'Verificando assets e ícones');
  
  const assetsDir = path.join(__dirname, '..', 'assets');
  const iconPath = path.join(assetsDir, 'icon.ico');
  
  if (!fs.existsSync(assetsDir)) {
    log('   Criando pasta assets...', 'yellow');
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  if (!fs.existsSync(iconPath)) {
    warning('Ícone da aplicação (icon.ico) não encontrado em assets/');
    warning('O build continuará, mas o instalador usará ícone padrão.');
    warning('Adicione um arquivo icon.ico em assets/ para um instalador profissional.');
  } else {
    success('Ícone da aplicação encontrado');
  }
}

// Executar o build do Electron
function buildElectron() {
  step(8, 'Compilando aplicação Electron');
  
  log('   Isso pode levar vários minutos...', 'yellow');
  log('   O electron-builder irá baixar dependências se necessário.', 'yellow');
  
  const rootPath = path.join(__dirname, '..');
  
  if (!exec('npx electron-builder --win --x64', rootPath)) {
    error('Falha ao compilar aplicação Electron');
    process.exit(1);
  }
  
  success('Aplicação Electron compilada com sucesso');
}

// Verificar resultado final
function verifyBuild() {
  step(9, 'Verificando resultado do build');
  
  const distPath = path.join(__dirname, '..', 'dist');
  
  if (!fs.existsSync(distPath)) {
    error('Pasta dist não foi criada!');
    process.exit(1);
  }
  
  const files = fs.readdirSync(distPath);
  const installers = files.filter(f => f.endsWith('.exe'));
  
  if (installers.length === 0) {
    error('Nenhum instalador .exe foi criado!');
    process.exit(1);
  }
  
  success('Build concluído com sucesso!');
  log('\n📦 Arquivos gerados:', 'bright');
  
  installers.forEach(installer => {
    const installerPath = path.join(distPath, installer);
    const stats = fs.statSync(installerPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    
    log(`   ✓ ${installer} (${sizeMB} MB)`, 'green');
    log(`     Caminho: ${installerPath}`, 'blue');
  });
}

// Função principal
function main() {
  log('\n' + '='.repeat(70), 'cyan');
  log('🚀 BUILD DE PRODUÇÃO - TOTEM BARBALHO', 'bright');
  log('='.repeat(70) + '\n', 'cyan');
  
  try {
    checkNodeVersion();
    checkDependencies();
    checkEnvFile();
    cleanPreviousBuilds();
    buildFrontend();
    createLicenseFile();
    checkAssets();
    buildElectron();
    verifyBuild();
    
    log('\n' + '='.repeat(70), 'green');
    log('✅ BUILD CONCLUÍDO COM SUCESSO!', 'bright');
    log('='.repeat(70), 'green');
    
    log('\n📋 Próximos passos:', 'yellow');
    log('   1. Teste o instalador em uma máquina limpa', 'yellow');
    log('   2. Verifique se todas as funcionalidades estão operando', 'yellow');
    log('   3. Teste em diferentes resoluções de tela', 'yellow');
    log('   4. Distribua o instalador para os totems\n', 'yellow');
    
  } catch (err) {
    error('\n❌ Erro durante o build:');
    error(err.message);
    process.exit(1);
  }
}

// Executar script
main();
