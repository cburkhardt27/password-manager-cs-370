const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs using contextBridge
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    // Only allow specific channels to be used
    let validChannels = ['save-data', 'load-data'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ['data-loaded'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});