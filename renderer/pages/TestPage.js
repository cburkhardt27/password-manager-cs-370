import { Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

export default function TestPage() {
  return (
    <>
      <h1>Test Page</h1>
      <Button onClick={() => { window.ipc.send('set-title', 'test-page-var') }}>
        Test
      </Button>
      <Button onClick={() => { window.ipc.invoke('test-master-pass')}}>
        MasterPassword!
      </Button>
    </>
  )
}