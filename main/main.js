const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const { spawn } = require('child_process');
const axios = require('axios');

/*
Notes
No print functions in servers. Messes with flask API.
Still an UnhandledPromiseRejectionWarning somewhere.
*/

ipcMain.handle('load-dependencies', async (_event) => {
  const dependencies = require('../package.json').devDependencies
  return Object.entries(dependencies).map(([key, value]) => {
    return {
      name: key,
      version: value
    }
  })
})

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

  ipcMain.handle('test-master-pass', async (event, username, master_pass) => {
    const data = {
      master_pass: master_pass,
      username: username
    }
    try {
      const response = await axios.post('http://localhost:5000/add_master_password', data)
      //const response = await axios.get('http://localhost:5000/api/test')
      console.log(response.data)
    } catch (error) {
      throw error
    }
  })

  ipcMain.handle('validate-login', async (event, username, master_pass) => {
    const data = {
      master_pass: master_pass,
      username: username
    }
    try {
      const response = await axios.post('http://localhost:5000/validate_login', data)
      console.log(response.data)
      return(response.data)
    } catch (error) {
      throw error
    }
  })

  ipcMain.handle('get-master-password', async (event) => {
    try {
      const response = await axios.get('http://localhost:5000/get_master_password')
      console.log(response.data.username) // Works!
      return response.data
    } catch (error) {
      throw error
    }
  })

  ipcMain.handle('add-password', async (event, data) => {
    try {
      const response = await axios.post('http://localhost:5000/add_password', data)
      console.log(response.data)
      return(response.data)
    } catch (error) {
      throw error
    }
  })

  // Deletion

  // Show all
  ipcMain.handle('display-all-passwords', async (event) => {
    try {
      const response = await axios.get('http://localhost:5000/display_all_passwords')
      console.log(response.data)
      return(response.data)
    } catch (error) {
      throw error
    }
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000') // Not working :( but can just localhost :).
  } else {
    // Might be redundant.
    if (app.isPackaged) {
      win.loadFile('./pack/index.html')
    } else {
      // Not packaged.
      await win.loadURL(`file://${path.join(__dirname, '../pack', 'index.html')}`)
    }
  }
}

let flaskProcess

const startFlaskPython = () => {
  // Virtual environment, Windows.
  const venvPath = path.join(__dirname, '../win_venv') // Windows.
  const pythonPath = path.join(venvPath, 'Scripts', 'python.exe') // Windows.
  const flaskPath = path.join(__dirname, '../db/db_flask_server.py')

  console.log(".py")
  // Py.
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
    return 'Initialized!'
  } catch (error) {
    console.error('Error in main init-db:', error)
    throw error
  }
})