const { contextBridge, ipcRenderer } = require('electron')

// Delete!
/*
contextBridge.exposeInMainWorld('api', {
  'set-title': () => ipcRenderer.send('set-title'),
  initDB: () => ipcRenderer.invoke('init-db'),
  addMasterPassword: () => ipcRenderer.invoke('add-master-password')
})
*/

// Works! send('test') button
const ipcHandler = {
    send(channel, ...args) {
        ipcRenderer.send(channel, ...args);
    },
    invoke(channel, ...args) {
        return ipcRenderer.invoke(channel, ...args);
    },
    once(channel, callback) {
        ipcRenderer.once(channel, (_event, ...args) => callback(...args));
    },
    on(channel, callback) {
        const subscription = (_event, ...args) => callback(...args)
        ipcRenderer.on(channel, subscription);
        return () => {
            ipcRenderer.removeListener(channel, subscription);
        };
    },
    clear(channel) {
        ipcRenderer.removeAllListeners(channel);
    }
};

contextBridge.exposeInMainWorld('ipc', ipcHandler);
