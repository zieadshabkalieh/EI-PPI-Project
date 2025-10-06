const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');

/* ---------- NEW: helper that builds an absolute path to anything in /assets ---------- */
contextBridge.exposeInMainWorld('paths', {
  /**
   * Returns an absolute path you can feed to <img>, <link>, fetch(), …
   * Usage in the renderer:
   *    const src = `file://${window.paths.asset('logo.png')}`;
   */
  asset: (file) => path.join(__dirname, 'assets', file),
});
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  /* …your existing exports (exportAsPDF, exportAsExcel, saveCalculation, etc.) */

  /** Receive raw PDF bytes from renderer and ask the main process to store them */
  savePdf: (arrayBuffer, fileName) =>
    ipcRenderer.invoke('save-pdf', Buffer.from(arrayBuffer), fileName),
  
});

/* ---------- EXISTING IPC API (unchanged) ---------- */
contextBridge.exposeInMainWorld('api', {
  saveFile:  (options) => ipcRenderer.invoke('save-file', options),
  saveExcel: (arrayBuffer, fileName) =>
  ipcRenderer.invoke('save-file', {
    content: Buffer.from(arrayBuffer),
    defaultPath: fileName,
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
  }),
  openFile:  (options) => ipcRenderer.invoke('open-file', options),

  onMenuSaveCalculation: (cb) => {
    ipcRenderer.on('menu-save-calculation', () => cb());
    return () => ipcRenderer.removeAllListeners('menu-save-calculation');
  },
  onMenuLoadCalculation: (cb) => {
    ipcRenderer.on('menu-load-calculation', () => cb());
    return () => ipcRenderer.removeAllListeners('menu-load-calculation');
  },
  onMenuExportPDF: (cb) => {
    ipcRenderer.on('menu-export-pdf', () => cb());
    return () => ipcRenderer.removeAllListeners('menu-export-pdf');
  },
  onMenuAbout: (cb) => {
    ipcRenderer.on('menu-about', () => cb());
    return () => ipcRenderer.removeAllListeners('menu-about');
  },
});
