import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddNewPasswordPage from './pages/AddNewPasswordPage.js';
import DeletePassword from './pages/DeletePassword.js';
import EditPassword from './pages/EditPassword.js';
import HomePageNoPasswords from './pages/HomePageNoPasswords.js';
import LoginPage from './pages/LoginPage.js';
import OnePasswordPage from './pages/OnePasswordPage.js';
import ViewPassword from './pages/ViewPassword.js';

// WIP
import SettingsPage from './pages/SettingsPage.js';
import CheckupPage from './pages/CheckupPage.js';
import CheckupStrengthPage from './pages/CheckupStrengthPage.js';
import CheckupUniquePage from './pages/CheckupUniquePage.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/AddNewPasswordPage" element={<AddNewPasswordPage />} />
        <Route path="/CheckupPage" element={<CheckupPage />} />
        <Route path="/CheckupStrengthPage" element={<CheckupStrengthPage />} />
        <Route path="/CheckupUniquePage" element={<CheckupUniquePage />} />
        <Route path="/DeletePassword" element={<DeletePassword />} />
        <Route path="/EditPassword" element={<EditPassword />} />
        <Route path="/HomePageNoPasswords" element={<HomePageNoPasswords />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/OnePasswordPage" element={<OnePasswordPage />} />
        <Route path="/OnePasswordPage" element={<OnePasswordPage />} />
        <Route path="/SettingsPage" element={<SettingsPage />} />
        <Route path="/ViewPassword" element={<ViewPassword />} />
        <Route path="/" element={<LoginPage />} />  {/* Default route */}
      </Routes>
    </Router>
  );
}

export default App;