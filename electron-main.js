const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const https = require('https');
const fs = require('fs');

let mainWindow;
let backendProcess;
let backendPort = null;
let frontendPort = null;

// Configurar logging
const isDev = process.env.NODE_ENV === 'development';
const logFile = isDev ? null : path.join(app.getPath('userData'), 'totem-barbalho.log');

function log(message, isError = false) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    
    console.log(logMessage);
    
    // Em produção, salvar em arquivo
    if (logFile) {
        try {
            fs.appendFileSync(logFile, logMessage + '\n');
        } catch (err) {
            console.error('Erro ao escrever log:', err);
        }
    }
}

// Função simples para parsear arquivo .env
function parseEnvFile(filePath) {
    try {
        const envContent = fs.readFileSync(filePath, 'utf8');
        const envVars = {};
        
        envContent.split('\n').forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#') && line.includes('=')) {
                const [key, ...valueParts] = line.split('=');
                const value = valueParts.join('=').trim();
                // Remove aspas se existirem
                envVars[key.trim()] = value.replace(/^["']|["']$/g, '');
            }
        });
        
        return envVars;
    } catch (error) {
        return {};
    }
}

function showError(title, message, detail = '') {
    log(`ERROR: ${title} - ${message}${detail ? '\n' + detail : ''}`, true);
    
    dialog.showErrorBox(title, `${message}\n\n${detail}\n\nLog: ${logFile || 'Console only'}`);
}

// Capturar erros não tratados
process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}\n${error.stack}`, true);
    showError('Erro Crítico', 'Ocorreu um erro inesperado', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection: ${reason}`, true);
    showError('Erro de Promise', 'Promise rejeitada não tratada', String(reason));
});

log('='.repeat(70));
log('🚀 Totem Barbalho - Iniciando aplicação');
log(`📂 App Path: ${app.getAppPath()}`);
log(`📂 User Data: ${app.getPath('userData')}`);
log(`📂 Resources: ${process.resourcesPath}`);
log(`🔧 Electron: ${process.versions.electron}`);
log(`🔧 Node: ${process.versions.node}`);
log(`🔧 Chrome: ${process.versions.chrome}`);
log(`🔧 Modo: ${isDev ? 'DESENVOLVIMENTO' : 'PRODUÇÃO'}`);
log('='.repeat(70));

// Função para encontrar porta livre
function findFreePort(startPort) {
    return new Promise((resolve, reject) => {
        const server = http.createServer();
        server.listen(startPort, () => {
            const port = server.address().port;
            server.close(() => {
                log(`✅ Porta livre encontrada: ${port}`);
                resolve(port);
            });
        });
        server.on('error', () => {
            // Se a porta está ocupada, tenta a próxima
            log(`⚠️  Porta ${startPort} ocupada, tentando ${startPort + 1}`);
            resolve(findFreePort(startPort + 1));
        });
    });
}

// Função para esperar o backend estar pronto
function waitForBackend(port, retries = 30) {
    return new Promise((resolve, reject) => {
        const checkBackend = (attempt) => {
            if (attempt > retries) {
                const error = new Error('Backend não iniciou a tempo');
                log(`❌ ${error.message}`, true);
                reject(error);
                return;
            }

            log(`🔍 Verificando backend (tentativa ${attempt}/${retries})...`);

            http.get(`http://localhost:${port}/health`, (res) => {
                if (res.statusCode === 200) {
                    log(`✅ Backend pronto na porta ${port}`);
                    resolve(port);
                } else {
                    setTimeout(() => checkBackend(attempt + 1), 1000);
                }
            }).on('error', () => {
                setTimeout(() => checkBackend(attempt + 1), 1000);
            });
        };

        checkBackend(1);
    });
}

function createWindow() {
    log('📱 Criando janela principal...');
    
    mainWindow = new BrowserWindow({
        width: 1080,
        height: 1920,
        resizable: false,
        fullscreen: true,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        backgroundColor: '#F59D28',
        show: false, // Não mostrar até estar carregado
    });

    // Determinar se está em desenvolvimento ou produção
    let frontendUrl;
    if (isDev) {
        // Em desenvolvimento, usa o dev server
        frontendUrl = `http://localhost:${frontendPort || 3001}`;
    } else {
        // Em produção, carrega os arquivos buildados
        frontendUrl = `file://${path.join(__dirname, 'frontend', 'build', 'index.html')}`;
    }

    log(`📱 Carregando frontend: ${frontendUrl}`);
    
    mainWindow.loadURL(frontendUrl).catch(err => {
        log(`❌ Erro ao carregar frontend: ${err.message}`, true);
        showError('Erro ao Carregar Interface', 'Não foi possível carregar a interface do totem', err.message);
    });

    // Mostrar janela quando pronta
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        log('🖥️  Janela principal pronta e visível');
    });

    // Abrir DevTools apenas em desenvolvimento
    if (isDev) {
        mainWindow.webContents.openDevTools();
        log('🔧 DevTools aberto (modo desenvolvimento)');
    }

    // Logs de eventos da janela
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        log(`❌ Falha ao carregar: ${errorCode} - ${errorDescription}`, true);
        showError('Erro ao Carregar', `Código: ${errorCode}`, errorDescription);
    });

    mainWindow.webContents.on('crashed', () => {
        log('❌ Renderer process crashed!', true);
        showError('Crash', 'O processo de renderização travou', 'Tentando reiniciar...');
        
        if (mainWindow) {
            mainWindow.reload();
        }
    });

    mainWindow.on('closed', () => {
        log('🚪 Janela principal fechada');
        mainWindow = null;
        if (backendProcess) {
            log('🛑 Encerrando processo backend...');
            backendProcess.kill();
            backendProcess = null;
        }
    });
}

async function startBackend() {
    try {
        log('🔧 Iniciando backend...');
        
        // Encontrar porta livre para o backend
        backendPort = await findFreePort(3000);
        log(`🔌 Backend usará porta ${backendPort}`);

        // Determinar caminho do backend
        const backendPath = path.join(__dirname, 'backend', 'server.js');

        log(`📂 Backend path: ${backendPath}`);
        log(`📂 __dirname: ${__dirname}`);
        
        // Verificar se o arquivo existe
        if (!fs.existsSync(backendPath)) {
            throw new Error(`Backend não encontrado em: ${backendPath}`);
        }
        
        // Verificar se node_modules existe
        const nodeModulesPath = path.join(__dirname, 'backend', 'node_modules');
        if (!fs.existsSync(nodeModulesPath)) {
            log(`⚠️  node_modules não encontrado em: ${nodeModulesPath}`, true);
            showError(
                'Dependências Ausentes',
                'As dependências do backend não estão instaladas',
                `Execute:\ncd "${path.join(__dirname, 'backend')}"\nnpm install --production`
            );
            throw new Error('Backend node_modules não encontrado');
        }

        log(`✅ Backend node_modules encontrado`);

        // Carregar variáveis de ambiente do backend
        const backendEnvPath = path.join(__dirname, 'backend', '.env');
        let backendEnvVars = {};
        
        if (fs.existsSync(backendEnvPath)) {
            try {
                backendEnvVars = parseEnvFile(backendEnvPath);
                log(`✅ Variáveis de ambiente carregadas: ${Object.keys(backendEnvVars).join(', ')}`);
            } catch (envError) {
                log(`⚠️ Erro ao carregar .env: ${envError.message}`, true);
            }
        } else {
            log(`⚠️ Arquivo .env não encontrado em: ${backendEnvPath}`, true);
        }

        // Preparar variáveis de ambiente
        const env = {
            ...process.env,
            ...backendEnvVars, // Adicionar variáveis do .env do backend
            NODE_ENV: isDev ? 'development' : 'production',
            PORT: backendPort.toString(),
            FRONTEND_URL: isDev 
                ? `http://localhost:${frontendPort || 3001}`
                : `file://${path.join(__dirname, 'frontend', 'build', 'index.html')}`
        };
        
        log(`🔑 GEMINI_API_KEY configurado: ${env.GEMINI_API_KEY ? 'SIM' : 'NÃO'}`);

        log('🚀 Spawning Node.js process para backend...');

        // Usar o Node.js embutido no Electron ao invés do Node.js do sistema
        // process.execPath aponta para o executável do Electron que contém Node.js
        const nodeExecutable = process.execPath;
        
        log(`📂 Node executable: ${nodeExecutable}`);

        backendProcess = spawn(nodeExecutable, [backendPath], {
            stdio: ['ignore', 'pipe', 'pipe'],
            env: env,
        });

        backendProcess.stdout.on('data', (data) => {
            const message = data.toString().trim();
            log(`[Backend] ${message}`);
        });

        backendProcess.stderr.on('data', (data) => {
            const message = data.toString().trim();
            log(`[Backend ERROR] ${message}`, true);
        });

        backendProcess.on('error', (err) => {
            log(`❌ Erro no processo backend: ${err.message}`, true);
            showError('Erro no Backend', 'O backend encontrou um erro', err.message);
        });

        backendProcess.on('close', (code) => {
            log(`Backend encerrado com código ${code}`);
            if (code !== 0 && code !== null) {
                log(`⚠️  Backend encerrou inesperadamente com código ${code}`, true);
                
                if (!isDev) {
                    showError(
                        'Backend Encerrou',
                        `O servidor backend parou inesperadamente (código: ${code})`,
                        'Verifique o log para mais detalhes'
                    );
                }
            }
        });

        log('⏳ Aguardando backend ficar pronto...');
        
        // Aguardar backend estar pronto
        await waitForBackend(backendPort);
        
        log(`✅ Backend iniciado com sucesso na porta ${backendPort}`);
        
        return backendPort;
    } catch (error) {
        log(`❌ Erro ao iniciar backend: ${error.message}`, true);
        log(error.stack, true);
        
        showError(
            'Falha ao Iniciar Backend',
            'Não foi possível iniciar o servidor backend',
            error.message
        );
        
        throw error;
    }
}

app.whenReady().then(async () => {
    try {
        log('📱 Electron app ready');
        
        // Encontrar porta para frontend (se em dev)
        if (isDev) {
            frontendPort = await findFreePort(3001);
            log(`🔌 Frontend dev server na porta ${frontendPort}`);
        }

        // Iniciar backend primeiro
        log('1️⃣  Passo 1: Iniciando backend...');
        await startBackend();
        
        // Criar janela depois que backend estiver pronto
        log('2️⃣  Passo 2: Criando janela...');
        createWindow();

        app.on('activate', () => {
            if (mainWindow === null) {
                log('🔄 Reativando janela...');
                createWindow();
            }
        });

        log('✅ Totem Barbalho iniciado com sucesso!');
    } catch (error) {
        log(`❌ Erro fatal ao iniciar aplicação: ${error.message}`, true);
        log(error.stack, true);
        
        showError(
            'Erro Fatal',
            'Não foi possível iniciar o Totem Barbalho',
            `${error.message}\n\nLog salvo em:\n${logFile || 'Console apenas'}`
        );
        
        app.quit();
    }
});

app.on('window-all-closed', () => {
    log('🚪 Todas as janelas fechadas');
    if (backendProcess) {
        log('🛑 Encerrando backend...');
        backendProcess.kill();
        backendProcess = null;
    }
    app.quit();
});

// Garantir limpeza ao sair
app.on('before-quit', () => {
    log('👋 Aplicação encerrando...');
    if (backendProcess) {
        log('🛑 Matando processo backend...');
        backendProcess.kill();
        backendProcess = null;
    }
    log('='.repeat(70));
    log('🏁 Aplicação encerrada');
    log('='.repeat(70));
});

// =====================================================================
// IPC Handlers - Comunicação segura entre Renderer e Main Process
// =====================================================================

/**
 * Handler para download de PDF via Main Process
 * Usa protocolo HTTPS nativo do Node.js para maior segurança
 */
ipcMain.handle('download-pdf', async (event, { recipeId, fileName }) => {
    log(`📥 [IPC] Recebida solicitação de download - Recipe ID: ${recipeId}`);
    
    try {
        // Detectar URL do backend baseado na porta configurada
        const backendUrl = `http://localhost:${backendPort || 3000}/api/download-recipe-pdf/${recipeId}`;
        log(`🌐 [IPC] Buscando PDF de: ${backendUrl}`);
        
        // Criar diretório temporário para salvar o PDF
        const tempDir = app.getPath('temp');
        const tempFilePath = path.join(tempDir, `totem-barbalho-${recipeId}.pdf`);
        
        // Fazer requisição HTTP para obter o PDF do backend
        const pdfBuffer = await new Promise((resolve, reject) => {
            http.get(backendUrl, (response) => {
                // Verificar status HTTP
                if (response.statusCode !== 200) {
                    log(`❌ [IPC] Erro HTTP ${response.statusCode}`, true);
                    reject(new Error(`Erro HTTP: ${response.statusCode}`));
                    return;
                }
                
                // Verificar Content-Type
                const contentType = response.headers['content-type'];
                if (!contentType || !contentType.includes('application/pdf')) {
                    log(`❌ [IPC] Content-Type inválido: ${contentType}`, true);
                    reject(new Error('Resposta não é um PDF válido'));
                    return;
                }
                
                // Acumular chunks do PDF
                const chunks = [];
                response.on('data', (chunk) => chunks.push(chunk));
                response.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    const sizeKB = (buffer.length / 1024).toFixed(2);
                    log(`✅ [IPC] PDF baixado: ${sizeKB} KB`);
                    
                    // Validar tamanho
                    if (buffer.length < 10000) {
                        reject(new Error('PDF muito pequeno - provavelmente corrompido'));
                        return;
                    }
                    
                    resolve(buffer);
                });
                response.on('error', (err) => {
                    log(`❌ [IPC] Erro ao baixar PDF: ${err.message}`, true);
                    reject(err);
                });
            }).on('error', (err) => {
                log(`❌ [IPC] Erro de conexão: ${err.message}`, true);
                reject(err);
            });
        });
        
        // Salvar PDF temporariamente
        fs.writeFileSync(tempFilePath, pdfBuffer);
        log(`💾 [IPC] PDF salvo temporariamente em: ${tempFilePath}`);
        
        // Abrir diálogo nativo "Salvar Como"
        const result = await dialog.showSaveDialog(mainWindow, {
            title: 'Salvar Receita Barbalho',
            defaultPath: path.join(app.getPath('downloads'), fileName || 'receita-barbalho.pdf'),
            filters: [
                { name: 'Documentos PDF', extensions: ['pdf'] },
                { name: 'Todos os Arquivos', extensions: ['*'] }
            ],
            properties: ['createDirectory', 'showOverwriteConfirmation']
        });
        
        // Se usuário cancelou, deletar arquivo temporário
        if (result.canceled) {
            fs.unlinkSync(tempFilePath);
            log('❌ [IPC] Download cancelado pelo usuário');
            return { success: false, canceled: true };
        }
        
        // Copiar do temp para o local escolhido
        const destinationPath = result.filePath;
        fs.copyFileSync(tempFilePath, destinationPath);
        fs.unlinkSync(tempFilePath); // Deletar temp
        
        log(`✅ [IPC] PDF salvo com sucesso em: ${destinationPath}`);
        
        return { 
            success: true, 
            filePath: destinationPath,
            message: 'PDF salvo com sucesso!' 
        };
        
    } catch (error) {
        log(`❌ [IPC] Erro ao processar download: ${error.message}`, true);
        log(error.stack, true);
        
        // Mostrar diálogo de erro ao usuário
        dialog.showErrorBox(
            'Erro ao Salvar PDF',
            `Não foi possível salvar a receita.\n\nDetalhes: ${error.message}`
        );
        
        return { 
            success: false, 
            error: error.message 
        };
    }
});