const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  flaskUrl: 'http://127.0.0.1:5000'
});

