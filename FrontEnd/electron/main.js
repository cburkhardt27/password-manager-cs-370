// electron/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;  // Declare mainWindow variable

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // Path to your preload file if you're using one
      nodeIntegration: true,  // Enable Node.js integration in the renderer process
      contextIsolation: false,  // Disable context isolation if nodeIntegration is true
    },
  });

  // Load the React app. In development, it's running on localhost:4001
  mainWindow.loadURL('http://localhost:4001');

  // Uncomment this if you want to open the DevTools automatically
  mainWindow.webContents.openDevTools();

  // Event when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Recreate a window in the app when the dock icon is clicked (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
