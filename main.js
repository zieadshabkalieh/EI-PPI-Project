const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs   = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

// Optional helper if you ever need the absolute assets folder in main:
const ASSETS_DIR = path.join(__dirname, 'assets'); // <── points to resources/app/assets when packaged

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  /* -------------------- Menu -------------------- */
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Save Calculation',
          click: () => mainWindow.webContents.send('menu-save-calculation'),
        },
        {
          label: 'Load Calculation',
          click: () => mainWindow.webContents.send('menu-load-calculation'),
        },
        {
          label: 'Export as PDF',
          click: () => mainWindow.webContents.send('menu-export-pdf'),
        },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label:
            'About Environmental, Practicality, and Performance Index (EPPI)(EI & PPI)',
          click: () => mainWindow.webContents.send('menu-about'),
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
};

/* -------------------- App lifecycle -------------------- */
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/* -------------------- IPC handlers -------------------- */
ipcMain.handle(
  'save-file',
  async (event, { content, defaultPath, filters }) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath,
      filters,
    });

    if (!canceled && filePath) {
      fs.writeFileSync(filePath, content);
      return filePath;
    }
    return null;
  },
);

ipcMain.handle('open-file', async (event, { filters }) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters,
  });

  if (!canceled && filePaths.length > 0) {
    const content = fs.readFileSync(filePaths[0], 'utf8');
    return { filePath: filePaths[0], content };
  }
  return null;
});



ipcMain.handle('save-pdf', async (_e, buffer, fileName) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: fileName,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  });
  if (!canceled && filePath) await fs.promises.writeFile(filePath, buffer);
});
