const { app, BrowserWindow } = require('electron');
const path = require('path');

// Use dynamic import to load electron-is-dev
(async () => {
  const isDev = (await import('electron-is-dev')).default;

  let mainWindow;

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 1064,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    if (isDev) {
      // Load the React app from the development server
      mainWindow.loadURL('http://localhost:3000');
      mainWindow.webContents.openDevTools();  // Enable DevTools in dev mode
    } else {
      // Load the compiled production React app from dist/index.html
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

  app.whenReady().then(createWindow);

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
})();
