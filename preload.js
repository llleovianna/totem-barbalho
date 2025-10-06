/**
 * Totem Barbalho - Preload Script
 * 
 * Este script roda em um contexto isolado entre o processo principal (main)
 * e o processo de renderização (renderer). Ele expõe APIs seguras para o frontend.
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Informações do sistema
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => process.platform,
  
  // Funções de utilitário
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // Logs e debug (apenas em desenvolvimento)
  log: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Renderer]:', message);
    }
  },
  
  // Informações de rede
  getNetworkInfo: () => ipcRenderer.invoke('get-network-info'),
  
  // Backend status
  getBackendPort: () => ipcRenderer.invoke('get-backend-port'),
  
  // Download de PDF via Main Process (seguro e nativo)
  downloadRecipePDF: (recipeId, fileName) => ipcRenderer.invoke('download-pdf', { recipeId, fileName }),
});

// Prevenir que o renderer acesse funcionalidades perigosas
window.eval = global.eval = function () {
  throw new Error('eval() is disabled for security');
};

console.log('🔐 Preload script loaded successfully');
