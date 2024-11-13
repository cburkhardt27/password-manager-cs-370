const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  flaskUrl: 'http://127.0.0.1:5000',

  addPasswordEntry: (username, url, password, note) => ipcRenderer.invoke('add-password-entry', username, url, password, note)
});

