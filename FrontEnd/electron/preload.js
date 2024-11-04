const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs using contextBridge
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Sends data to the main process via IPC.
   * Only allows specific channels to be used for security.
   * @param {string} channel - The name of the IPC channel
   * @param {any} data - The data to send
   */
  send: (channel, data) => {
    // Define a whitelist of allowed IPC channels
    const validChannels = [
      'save-data',
      'load-data',
      'add-password-entry',
      'get-password',
      'delete-password',
      'update-password-entry',
      'update-username',
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    } else {
      console.warn(`Blocked attempt to send message via invalid channel: ${channel}`);
    }
  },

  /**
   * Receives data from the main process via IPC.
   * Only allows specific channels to be listened to for security.
   * @param {string} channel - The name of the IPC channel
   * @param {function} func - The callback function to handle the data
   */
  receive: (channel, func) => {
    // Define a whitelist of allowed IPC channels for receiving messages
    const validChannels = [
      'data-loaded',
      'add-password-entry-reply',
      'get-password-reply',
      'delete-password-reply',
      'update-password-entry-reply',
      'update-username-reply',
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    } else {
      console.warn(`Blocked attempt to listen on invalid channel: ${channel}`);
    }
  },
});
