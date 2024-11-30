import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import { GradientBackground } from './components/Components.js'
import TestPage from './pages/TestPage.js'
import SetUpPage from './pages/SetUpPage.js'

export default function App() {
  return (
    // <GradientBackground/>
    <TestPage></TestPage>
  )
}