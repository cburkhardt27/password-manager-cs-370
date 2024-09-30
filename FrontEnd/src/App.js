// src/App.js
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header />
      <div id="content">
        <h1>Password Manager</h1>
        {/* Static password list and folder components go here */}
      </div>
      <Footer />
    </div>
  );
}

export default App;
