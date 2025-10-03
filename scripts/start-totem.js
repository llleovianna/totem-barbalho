const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando Totem Barbalho...\n');

// Função para executar comandos
function runCommand(command, args, cwd, label) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      cwd: cwd,
      shell: true,
      stdio: 'pipe'
    });

    process.stdout.on('data', (data) => {
      console.log(`[${label}] ${data.toString().trim()}`);
    });

    process.stderr.on('data', (data) => {
      console.log(`[${label}] ${data.toString().trim()}`);
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${label} exited with code ${code}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

async function startServices() {
  try {
    console.log('🔧 Verificando dependências...');
    
    // Iniciar backend
    console.log('🚀 Iniciando Backend (porta 3000)...');
    const backendProcess = spawn('npm', ['start'], {
      cwd: path.join(__dirname, '..', 'backend'),
      shell: true,
      stdio: 'pipe',
      env: { ...process.env }
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`[BACKEND] ${data.toString().trim()}`);
    });

    backendProcess.stderr.on('data', (data) => {
      console.log(`[BACKEND] ${data.toString().trim()}`);
    });

    // Aguardar um pouco antes de iniciar o frontend
    setTimeout(() => {
      console.log('🎨 Iniciando Frontend (porta 3001)...');
      
      const frontendProcess = spawn('npm', ['start'], {
        cwd: path.join(__dirname, '..', 'frontend'),
        shell: true,
        stdio: 'pipe',
        env: { ...process.env, PORT: '3001', BROWSER: 'none' }
      });

      frontendProcess.stdout.on('data', (data) => {
        console.log(`[FRONTEND] ${data.toString().trim()}`);
      });

      frontendProcess.stderr.on('data', (data) => {
        console.log(`[FRONTEND] ${data.toString().trim()}`);
      });

      // Lidar com encerramento
      process.on('SIGINT', () => {
        console.log('\n⏹️ Encerrando serviços...');
        backendProcess.kill();
        frontendProcess.kill();
        process.exit(0);
      });

    }, 3000); // Aguarda 3 segundos

  } catch (error) {
    console.error('❌ Erro ao iniciar os serviços:', error.message);
    process.exit(1);
  }
}

startServices();