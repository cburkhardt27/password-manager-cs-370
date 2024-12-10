const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { spawn, execFile } = require('child_process');
const axios = require('axios');
const kill = require('tree-kill');

const SERVER_BASE_URL = 'http://127.0.0.1:5000';

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
  } else {
    if (app.isPackaged) {
      win.loadFile('./pack/index.html');
    } else {
      await win.loadURL(`file://${path.join(__dirname, '../pack', 'index.html')}`);
    }
  }
};

ipcMain.handle('add-master-password', async (_event, username, master_pass) => {
  const data = { master_pass, username };
  try {
    const response = await axios.post(`${SERVER_BASE_URL}/add_master_password`, data);
    console.log(response.data);
  } catch (error) {
    console.error('Error in add-master-password:', error.message);
    return { error: error.message };
  }
});

ipcMain.handle('validate-login', async (_event, username, master_pass) => {
  const data = { master_pass, username };
  try {
    const response = await axios.post(`${SERVER_BASE_URL}/validate_login`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error in validate-login:', error.message);
    return { error: error.message };
  }
});

ipcMain.handle('get-master-password', async () => {
  try {
    const response = await axios.get(`${SERVER_BASE_URL}/get_master_password`, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(response.data.username);
    return response.data;
  } catch (error) {
    console.error('Error in get-master-password:', error.message);
    return { error: error.message };
  }
});

ipcMain.handle('add-password', async (_event, data) => {
  try {
    const response = await axios.post(`${SERVER_BASE_URL}/add_password`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error in add-password:', error.message);
    return { error: error.message };
  }
});

ipcMain.handle('delete-password', async (_event, data) => {
  try {
    const response = await axios.delete(`${SERVER_BASE_URL}/delete_password`, {
      headers: {
        'Content-Type': 'application/json'
      }, 
      data
  });
    console.log(response.data);
  } catch (error) {
    console.error('Error in delete-password:', error.message);
  }
});

ipcMain.handle('display-all-passwords', async () => {
  try {
    const response = await axios.get(`${SERVER_BASE_URL}/display_all_passwords`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error in display-all-passwords:', error.message);
    return { error: error.message };
  }
});

ipcMain.handle('get-repeated-passwords', async () => {
  try {
    const response = await axios.get(`${SERVER_BASE_URL}/get_repeated_passwords`);
    console.log("repeated");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error in get-repeated-passwords:', error.message);
    return { error: error.message };
  }
});

ipcMain.handle('delete-database', async () => {
  try {
    const response = await axios.delete(`${SERVER_BASE_URL}/delete_database`);
    console.log(response.data)
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('init-db', async () => {
  try {
    await axios.post(`${SERVER_BASE_URL}/init_db`);
  } catch (error) {
    return { error: error.message };
  }
});

let flaskProcess;

const appDataPath = app.getPath('appData');

const exePath = path.join(appDataPath, 'password-manager', 'db_flask_server.exe'); // Hard code packaged path.

const startFlaskExe = () => {
  flaskProcess = execFile(exePath, {
    shell: true,
    stdio: 'inherit',
  });

  flaskProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`Flask (exe): ${output}`);
    if (output.includes('* Serving Flask app')) {
      console.log('Flask exe is ready. Initializing database.');
      initDB();
    }
  });

  flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask exe error: ${data.toString()}`);
  });
};

// Determines if the Flask API is up.
async function isFlaskUp() {
  try {
    const response = await axios.get(`${SERVER_BASE_URL}/api/test`);
    return response.status === 200;
  } catch (err) {
    return false;
  }
};

async function waitForFlask() {
  const timeout = 10000; // 10 seconds
  const interval = 500; // Check every 500ms
  let elapsed = 0;

  return new Promise((resolve, reject) => {
    const checkInterval = setInterval(async () => {
      if (await isFlaskUp()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (elapsed >= timeout) {
        clearInterval(checkInterval);
        reject(new Error('Flask server did not start within timeout'));
      }
      elapsed += interval;
    }, interval);
  });
};

app.whenReady().then(async () => {
  startFlaskExe();

  let flaskReady = false; // Track Flask's readiness

  do {
    try {
      await waitForFlask(); // Wait for Flask to start
      createWindow(); // Create the Electron window
      flaskReady = true; // If no error, Flask is ready
    } catch (err) {
      console.error(`Error waiting for Flask: ${err.message}`);
      console.log('Retrying...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
    }
  } while (!flaskReady); // Repeat until Flask is ready
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('before-quit', () => {
  console.log('App is quitting...');
  if (flaskProcess) {
    console.log(`Killing Flask process with PID: ${flaskProcess.pid}`);
    kill(flaskProcess.pid, 'SIGTERM');
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (flaskProcess) {
      console.log(`Killing Flask process with PID: ${flaskProcess.pid}`);
      kill(flaskProcess.pid, 'SIGTERM');
    }
    app.quit();
  }
});

const initDB = async () => {
  try {
    await axios.post(`${SERVER_BASE_URL}/init_db`);
    console.log('Database initialized!');
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
};