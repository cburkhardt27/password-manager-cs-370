const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const { spawn } = require('child_process');
const axios = require('axios')

let flaskProcess // flaskprocess as a variable.

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

function startFlask() {
  // Virtual environment, Windows.
  const venvPath = path.join(__dirname, 'win_venv') // Windows.
  const pythonPath = path.join(venvPath, 'Scripts', 'python.exe') // Windows
  const flaskPath = path.join(__dirname, 'db/db_flask_server.py')

  flaskProcess = spawn(pythonPath, ['-u', flaskPath])

  flaskProcess.stdout.on('data', (data) => {
    console.log(`Python stdout: ${data}`);
  });
}

app.whenReady().then(() => {
  startFlask()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('will-quit', () => {
  if (flaskProcess) flaskProcess.kill();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC.
// Initializes the database, creates the master password and password table.
ipcMain.handle('init-db', async (event) => {
  try {
    const response = await axios.post('http://localhost:5000/init_db')
    return "Initialized!"
  } catch (error) {
    console.error('Error in main init-db:', error)
    throw error
  }
})