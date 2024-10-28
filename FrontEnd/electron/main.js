const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { PythonShell } = require('python-shell');  // Import python-shell

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
      mainWindow.loadURL('http://localhost:3000');
      mainWindow.webContents.openDevTools();
    } else {
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

  // Define a function to call the Python script
  function callPythonFunction(functionName, args) {
    return new Promise((resolve, reject) => {
      PythonShell.run('/Users/lizzz/Desktop/password-manager-cs-370/Docker-DB/databasefunctions.py', {
        args: [functionName, ...args]
      }, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // IPC handlers
  ipcMain.handle('add-password-entry', async (event, username, url, password) => {
    try {
      const result = await callPythonFunction('add_password_entry', [username, url, password]);
      return { success: true, result };
    } catch (error) {
      console.error('Error adding password:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('get-password', async (event, username, url) => {
    try {
      const result = await callPythonFunction('get_password', [username, url]);
      return { success: true, result };
    } catch (error) {
      console.error('Error retrieving password:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('delete-password', async (event, username, url) => {
    try {
      const result = await callPythonFunction('delete_password', [username, url]);
      return { success: true, result };
    } catch (error) {
      console.error('Error deleting password:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('update-password-entry', async (event, username, url, newPassword) => {
    try {
      const result = await callPythonFunction('update_password_entry', [username, url, newPassword]);
      return { success: true, result };
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('update-username', async (event, currentUsername, newUsername, url) => {
    try {
      const result = await callPythonFunction('update_username', [currentUsername, newUsername, url]);
      return { success: true, result };
    } catch (error) {
      console.error('Error updating username:', error);
      return { success: false, error: error.message };
    }
  });
})();

