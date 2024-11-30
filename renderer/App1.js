import { Button } from '@mui/material' // Test, delete.
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Import pages.
/*
    <Button onClick={() => {window.api.send('set-title', 'test')}}>
      Test
    </Button>
*/

export default function App1() {
  // const [isTest, setTest] = useState(false) // Irrelevant?
  const handleTest = () => {
    window.api.send('set-title', 'test')    
  }

  return (
    <>
      <h1>Test App1</h1>
      <Button onClick={() => { window.ipc.send('set-title', 'test') }}>
        Test
      </Button>
    </>
  )
}