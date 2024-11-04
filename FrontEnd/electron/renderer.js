const { ipcRenderer } = require('electron');

// Define functions to handle specific IPC communications
const addPassword = async (username, url, password) => {
  try {
    const response = await window.electronAPI.addPasswordEntry({ username, url, password });
    console.log('Password added:', response);
    return response;
  } catch (error) {
    console.error('Failed to add password:', error);
    throw error;
  }
};

const getPassword = async (username, url) => {
  try {
    const response = await window.electronAPI.getPassword({ username, url });
    console.log('Password retrieved:', response);
    return response;
  } catch (error) {
    console.error('Failed to retrieve password:', error);
    throw error;
  }
};

const deletePassword = async (username, url) => {
  try {
    const response = await window.electronAPI.deletePassword({ username, url });
    console.log('Password deleted:', response);
    return response;
  } catch (error) {
    console.error('Failed to delete password:', error);
    throw error;
  }
};

// Export functions for use in React components
export {
  addPassword,
  getPassword,
  deletePassword,
};