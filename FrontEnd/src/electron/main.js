const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Allows Node.js modules in the renderer
      contextIsolation: false, // Disable to allow full access to Node APIs
    },
  });

  mainWindow.loadFile(path.join(__dirname, './src/index.html'));

  //open DevTools for debugging
//   mainWindow.webContents.openDevTools();

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = new BrowserWindow();
      mainWindow.loadFile(path.join(__dirname, './src/index.html'));
    }
  });
});