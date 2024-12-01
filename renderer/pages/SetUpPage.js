import { Box, Button, Container, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { GradientBackground, StyledAvatar, StyledIconButton, StyledTextField } from '../components/Components.js'

export default function SetUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSetUp = async () => {
    if (/\s/.test(username)) {
      alert("Username cannot contain spaces")
      return
    }

    if (password.length <= 8 || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      alert("Password must be longer than 8 characters, include a number, and a special character.")
      return
    }

    window.ipc.invoke('test-master-pass', username, password)
  }

  return (
    <GradientBackground>
      <Container>
        <Box display="flex" justifyContent="center" mb={4}>
          <StyledAvatar>
            <Typography variant="h1">🔐</Typography>
          </StyledAvatar>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4">Account information is immutable!</Typography>
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
          <Button onClick={() => { window.ipc.invoke('test-master-pass', 'testUserFront', 'password123A!Front')}}>
            Set Up Account TEST
          </Button>
          </Box>
      </Container>
    </GradientBackground>
  )
    // Master password requires 6/6 strength. Check for all possible inputs.
    // Username and master password.
    // This page if None are returned on startup. Otherwise Login page. Validate against, check if this is set up.
    
    // TODO:
    // Figure out minimum version.
      // Figure out posting to the db
    // Figure out components.
    // Figure out pages.
    // Figure out functions.
    // Build :)
}