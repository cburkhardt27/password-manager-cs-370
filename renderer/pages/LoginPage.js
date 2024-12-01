import { Box, Button, Container, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { GradientBackground, StyledAvatar, StyledTextField } from '../components/Components.js'

export default function LoginPage() {
  const [login, setLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLoginChange = () => {
    console.log('set true')
    setLogin(true)
  }
  const handleUsernameChange = (event) => setUsername(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)

  // Probably need useEffect and login/setLogin
  const handleLogin = async () => {
    try {      
      const response = await window.ipc.invoke('test-login', username, password)
      const login = response?.login

      if (login) {
        // NAVIGATE
        alert("In")
      } else {
        alert("Incorrect username or password.")
        setUsername("")
        setPassword()
        return
      }
    } catch (error) {
      console.error('Error logging in:', error)
      return
    }
  }

  return (
    <GradientBackground display="flex" justifyContent="center" alignItems="center">
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" mb={4}>
          <StyledAvatar>
            <Typography variant="h1">👤</Typography>
          </StyledAvatar>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" gap="20px">
          <StyledTextField
            variant="outlined"
            label="Username"
            value={username}
            onChange={handleUsernameChange}
            fullWidth
          />
          <StyledTextField
            variant="outlined"
            label="Master Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Container>
    </GradientBackground>
  )
}