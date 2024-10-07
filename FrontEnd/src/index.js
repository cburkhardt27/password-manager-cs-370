// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js'; // Make sure the path to App.js is correct

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Ensure your index.html has a div with id="root"
);
