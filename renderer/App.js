import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import TestPage from './pages/TestPage.js'
import SetUpPage from './pages/SetUpPage.js'

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
  const Default = (isProfile) ? TestPage : SetUpPage

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