import { Box, Button, Container, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { GradientBackground, StyledAvatar, StyledTextField } from '../components/Components.js'

export default function SetUpPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleUsernameChange = (event) => setUsername(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)

  const handleSetUp = async () => {
    if (/\s/.test(username)) {
      alert("Username cannot contain spaces.")
      return
    }

    if (password.length <= 8 || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      alert("Password must be longer than 8 characters, include a number, and a special character.")
      return
    }

    window.ipc.invoke('test-master-pass', username, password)

    // NAVIGATE TO PASSWORD PAGE.
  }

  return (
    <GradientBackground display="flex" justifyContent="center" alignItems="center">
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" mb={4}>
          <StyledAvatar>
            <Typography variant="h1">🔐</Typography>
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
          <Button variant="contained" color="primary" onClick={handleSetUp}>
            Set Up Account
          </Button>
          </Box>
      </Container>
    </GradientBackground>
  )
}