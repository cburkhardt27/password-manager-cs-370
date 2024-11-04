const { ipcRenderer } = require('electron');

// Define functions to handle specific IPC communications
const addPassword = (username, url, password) => {
  ipcRenderer.send('add-password-entry', { username, url, password });
};

const getPassword = (username, url) => {
  ipcRenderer.send('get-password', { username, url });
};

const deletePassword = (username, url) => {
  ipcRenderer.send('delete-password', { username, url });
};

// Define listeners to handle responses from main process
ipcRenderer.on('add-password-entry-reply', (event, response) => {
  console.log('Password added:', response);
});

ipcRenderer.on('get-password-reply', (event, response) => {
  console.log('Password retrieved:', response);
});

// Export functions for use in React components
module.exports = {
  addPassword,
  getPassword,
  deletePassword,
};
