
import React, { useState } from 'react'; 
import LoginPage from './pages/LoginPage.js';
import HomePage from './pages/HomePage.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <Header />
      {/* Conditionally render LoginPage or HomePage based on login status */}
      {!isLoggedIn ? (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <HomePage /> 
      )}
      <Footer />
    </div>
  );
}

export default App;
