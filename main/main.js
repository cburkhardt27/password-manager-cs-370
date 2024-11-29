const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const { spawn } = require('child_process');
const axios = require('axios');

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('set-title', (event, title) => {
    win.setTitle(title)
  })

  // await win.loadFile('main/index.html')
  await win.loadURL(`file://${path.join(__dirname, '../renderer', 'index.html')}`)
}

let flaskProcess

function startFlaskPython() {
  // Virtual environment, Windows.
  const venvPath = path.join(__dirname, '../win_venv') // Windows.
  const pythonPath = path.join(venvPath, 'Scripts', 'python.exe') // Windows.
  const flaskPath = path.join(__dirname, '../db/db_flask_server.py')

  flaskProcess = spawn(pythonPath, ['-u', flaskPath])

  flaskProcess.stdout.on('data', (data) => {
    if (data.includes('* Serving Flask app \'db_flask_server\'')) {
      initDB()
    }
  })
}

let exePath
if (app.isPackaged) {
  exePath = path.join(process.resourcesPath, 'db_flask_server.exe');
} else {
  exePath = path.join(__dirname, '../db/dist/', 'db_flask_server.exe')
}

const startFlaskExe = () => {
  // Exe.
  flaskProcess = spawn(exePath)

  flaskProcess.stdout.on('data', (data) => {
    if (data.includes('* Serving Flask app \'db_flask_server\'')) {
      initDB()
    }
  })
}

app.whenReady().then(() => {
  // startFlask includes flask and initDB()
  if (app.isPackaged) {
    startFlaskExe()
  } else {
    startFlaskPython()
  }
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('before-quit', () => {
  if (flaskProcess) {
    flaskProcess.kill()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const initDB = () => {
  try {
    axios.post('http://localhost:5000/init_db')
  } catch (error) {
    console.error('Error in main init-db:', error)
    throw error
  }
}

// IPC.
// InitDB.
ipcMain.handle('init-db', async (event) => {
  try {
    const response = await axios.post('http://localhost:5000/init_db')
    return "Initialized!"
  } catch (error) {
    console.error('Error in main init-db:', error)
    throw error
  }
})

// Add_master_password.
// All the python print statements?
ipcMain.handle('add-master-password', async (event, { username, masterPassword }) => {
  try {
    const response = await axios.post('https://localhost:5000/add_master_password', {
      username,
      masterPassword
    })
  } catch (error) {
    console.error('Error in main add-master-password:', error)
    throw error
  }
})