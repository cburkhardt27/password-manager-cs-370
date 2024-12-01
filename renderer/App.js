import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import TestPage from './pages/TestPage.js'
import SetUpPage from './pages/SetUpPage.js'
import LoginPage from './pages/LoginPage.js'

// To do:
    // Master password requires 6/6 strength. Check for all possible inputs.
    // Username and master password.
    // This page if None are returned on startup. Otherwise Login page. Validate against, check if this is set up.
    
    // Figure out minimum version.
      // Figure out posting to the db
    // Figure out components.
    // Figure out pages.
    // Figure out functions.
    // Build :)

export default function App() {
  const [isProfile, setProfile] = useState(false)

  useEffect(() => {
    // Limit renderer.
    const checkProfile = async () => {
      try {
        const response = await window.ipc.invoke('get-master-password')
        const username = response?.username

        if (username === "undefined" || !username) {
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

  // Works!
  const Default = (isProfile) ? LoginPage : SetUpPage

  return (
    <Router>
      <Default />
      <Routes>
        <Route path="/" element={<Default />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}