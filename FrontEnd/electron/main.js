const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fetch = require('node-fetch');

let mainWindow;
let flaskProcess;

(async () => {
  const isDev = (await import('electron-is-dev')).default;

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
      mainWindow.loadURL('http://localhost:3000');
      mainWindow.webContents.openDevTools();
    } else {
      mainWindow.loadFile(path.join(__dirname, '../public/index.html')); // Unsure for build?
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

  function startFlaskProcess() {
    // Virtual environment.
    const venvPath = path.join(__dirname, '../../venv');
    let pythonPath;
    if (process.platform !== 'darwin') {
      pythonPath = path.join(venvPath, 'Scripts', 'python'); // Windows
    } else {
      pythonPath = path.join(venvPath, 'bin', 'python'); // Mac
    }
    const flaskAppPath = path.join(__dirname, '../../SQLiteDB/pyserver_flask.py');

    flaskProcess = spawn(pythonPath, ['-u', flaskAppPath]);

    flaskProcess.stdout.on('data', (data) => {
      console.log(`Flask: ${data}`);
    });

    flaskProcess.stderr.on('data', (data) => {
      console.error(`Flask error: ${data}`);
    });
  }

  app.whenReady().then(() => {
    startFlaskProcess();
    createWindow();
  });

  app.on('will-quit', () => {
    if (flaskProcess) flaskProcess.kill();
  });

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


