import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AddNewPasswordPage from './pages/AddNewPasswordPage.js';
import DeletePassword from './pages/DeletePassword.js';
import EditPassword from './pages/EditPassword.js';
import HomePageNoPasswords from './pages/HomePageNoPasswords.js';
import LoginPage from './pages/LoginPage.js';
import OnePasswordPage from './pages/OnePasswordPage.js';
import ViewPassword from './pages/ViewPassword.js';

// WIP
import SetUpPage from './pages/SetUpPage.js';
import SettingsPage from './pages/SettingsPage.js';
import CheckupPage from './pages/CheckupPage.js';
import CheckupStrengthPage from './pages/CheckupStrengthPage.js';
import CheckupUniquePage from './pages/CheckupUniquePage.js';

function App() {
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if a profile already exists when the app starts
    const checkExistingProfile = async () => {
      try {
        const response = await fetch(`${window.api.flaskUrl}/get_master_password`);
        if (response.ok) {
          const result = await response.json();
          if (result.username) {
            setProfileExists(true); // Profile exists if username is returned
          }
        }
      } catch (error) {
        console.error("Error checking existing profile:", error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while checking
  }

  return (
    <Router>
      <Routes>
        {/* Conditionally render SetUpPage or LoginPage based on profile existence */}
        <Route path="/" element={profileExists ? <Navigate to="/LoginPage" /> : <SetUpPage />} />
        <Route path="/AddNewPasswordPage" element={<AddNewPasswordPage />} />
        <Route path="/CheckupPage" element={<CheckupPage />} />
        <Route path="/CheckupStrengthPage" element={<CheckupStrengthPage />} />
        <Route path="/CheckupUniquePage" element={<CheckupUniquePage />} />
        <Route path="/DeletePassword" element={<DeletePassword />} />
        <Route path="/EditPassword" element={<EditPassword />} />
        <Route path="/HomePageNoPasswords" element={<HomePageNoPasswords />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/OnePasswordPage" element={<OnePasswordPage />} />
        <Route path="/SettingsPage" element={<SettingsPage />} />
        <Route path="/ViewPassword" element={<ViewPassword />} />
        {/* Redirect any other route to the root */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
