const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { spawn } = require('child_process');
const axios = require('axios');

const SERVER_BASE_URL = 'http://127.0.0.1:5000';
let flaskProcess;

// Wait for Flask server to respond
const waitForServer = async (maxRetries = 10, delay = 1000) => {
  while (maxRetries > 0) {
    try {
      // Check if Flask is ready by pinging an endpoint
      await axios.get(`${SERVER_BASE_URL}/ping`);
      console.log('Flask server is ready.');
      return true;
    } catch (error) {
      maxRetries--;
      console.log(`Waiting for Flask server... Retries left: ${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  console.error('Flask server did not start in time.');
  return false;
};


// Initialize the database when Flask is ready
const initDB = async () => {
  let retries = 5; // Number of retries
  const delay = 1000; // Delay in milliseconds

  while (retries > 0) {
    try {
      await axios.post(`${SERVER_BASE_URL}/init_db`);
      console.log('Database initialized successfully!');
      return;
    } catch (error) {
      retries--;
      console.error(`Database init failed, retries left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
    }
  }

  console.error('Failed to initialize the database after retries.');
};


// Start the Flask process
const startFlaskServer = () => {
  const pythonPath = path.join(__dirname, '../mac_venv/bin/python'); // Adjust for your environment
  const flaskPath = path.join(__dirname, '../db/db_flask_server.py');

  flaskProcess = spawn(pythonPath, ['-u', flaskPath]);

  flaskProcess.stdout.on('data', (data) => {
    console.log(`Flask: ${data.toString()}`);
  });

  flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask error: ${data.toString()}`);
  });

  flaskProcess.on('error', (error) => {
    console.error(`Failed to start Flask process: ${error.message}`);
  });
};


// Create the Electron window
const createWindow = async () => {
  // Wait for the Flask server to be ready
  const serverReady = await waitForServer();
  if (!serverReady) {
    app.quit();
    return;
  }

  // Initialize the database
  try {
    await initDB();
  } catch (error) {
    console.error('Database initialization failed. Exiting.');
    app.quit();
    return;
  }

  // Create the Electron BrowserWindow
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
  // IPC Handlers for communication with renderer process
  setupIPCHandlers(win);
};


// Handle IPC events for communication with Flask
const setupIPCHandlers = (win) => {
  ipcMain.handle('add-master-password', async (_event, username, master_pass) => {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/add_master_password`, { username, master_pass });
      return response.data;
    } catch (error) {
      console.error('Error in add-master-password:', error.message);
      return { error: error.message };
    }
  });

  ipcMain.handle('validate-login', async (_event, username, master_pass) => {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/validate_login`, { username, master_pass });
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

  ipcMain.handle('display-all-passwords', async () => {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/display_all_passwords`);
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


  ipcMain.handle('add-password', async (_event, data) => {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/add_password`, data);
      return response.data;
    } catch (error) {
      console.error('Error in add-password:', error.message);
      return { error: error.message };
    }
  });

  ipcMain.handle('delete-password', async (_event, data) => {
    try {
      const response = await axios.delete(`${SERVER_BASE_URL}/delete_password`, { data });
      return response.data;
    } catch (error) {
      console.error('Error in delete-password:', error.message);
      return { error: error.message };
    }
  });

  ipcMain.handle('delete-database', async () => {
    try {
      const response = await axios.delete(`${SERVER_BASE_URL}/delete_database`);
      return response.data;
    } catch (error) {
      console.error('Error in delete-database:', error.message);
      return { error: error.message };
    }
  });

  ipcMain.handle('init-db', async () => {
    try {
      await axios.post(`${SERVER_BASE_URL}/init_db`);
      console.log('Database initialized!');
    } catch (error) {
      console.error('Error in init-db:', error.message);
      return { error: error.message };
    }
  });
};

// Handle app lifecycle events
app.whenReady().then(() => {
  startFlaskServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  if (flaskProcess) flaskProcess.kill();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});