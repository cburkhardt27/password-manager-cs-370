import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import TestPage from './pages/TestPage.js'
import SetUpPage from './pages/SetUpPage.js'
import LoginPage from './pages/LoginPage.js'
import Dashboard from './components/Sidebar.js'
import AddPassword from './pages/AddPassword.js'
import Passwords from './pages/Passwords.js'
import Settings from './pages/Settings.js'
import CheckUp from './pages/CheckUp.js'

// TODO:
  // Dev mode only works for renderer.
  // BUT dashboard thing works!
    // Figure out minimum version.
      // Figure out posting to the db
    // Figure out components.
    // Figure out pages.
    // Figure out functions.
    // Build :)

    // Search needs to first go to passwords? or after query.

  // Sign in errror (at least for the terminal) 404, display all, might be related to rendering password.

export default function App() {
  const [isProfile, setProfile] = useState(null)

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await window.ipc.invoke('get-master-password')
        const username = response?.username

        if (username === 'undefined' || !username) {
          setProfile(false)
        } else {
          setProfile(true)
        }
      } catch (error) {
        console.error('Error checking profile:', error)
        setProfile(false)
      }
    }

    checkProfile()
  }, []) // Runs once.

  return (
    <Routes>
      <Route path="/" element={isProfile ? <LoginPage /> : <SetUpPage />} />
      <Route path="/SetUpPage" element={<SetUpPage />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/Dashboard" element={<Dashboard />}>
        <Route index element={<Passwords />} />
        <Route path="/Dashboard/Passwords" element={<Passwords />} />
        <Route path="/Dashboard/AddPassword" element={<AddPassword />} />
        <Route path="/Dashboard/Settings" element={<Settings />} />
        <Route path="/Dashboard/CheckUp" element={<CheckUp />} />
      </Route>
    </Routes>
  )
}