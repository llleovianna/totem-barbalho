const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1080,
        height: 1920,
        resizable: false,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        backgroundColor: '#F59D28',
    });

    // Load the React frontend (assume dev server or built files)
    const frontendUrl =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, 'frontend', 'build', 'index.html')}`;

    mainWindow.loadURL(frontendUrl);

    mainWindow.on('closed', () => {
        mainWindow = null;
        if (backendProcess) backendProcess.kill();
    });
}

function startBackend() {
    const backendPath = path.join(__dirname, 'backend', 'server.js');
    backendProcess = spawn('node', [backendPath], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'production' },
    });

    backendProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Backend process exited with code ${code}`);
        }
    });
}

app.whenReady().then(() => {
    startBackend();
    createWindow();

    app.on('activate', () => {
        if (mainWindow === null) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (backendProcess) backendProcess.kill();
        app.quit();
    }
});