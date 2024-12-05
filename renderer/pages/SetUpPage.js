import { Box, Button, Container, InputAdornment, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { GradientBackground, StyledAvatar, StyledTextField } from '../components/Components.js'

// Need to figure out edge cases, no username after first check.

export default function SetUpPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const [strength, setStrength] = useState(0)
  const [recommend, setRecommend] = useState('')

  const handleUsernameChange = (event) => setUsername(event.target.value)
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    checkStrength(event.target.value)
    checkRecommend(event.target.value)
  }

  const checkLength = (password) => password.length >= 8
  const checkUppercase = (password) => /[A-Z]/.test(password)
  const checkLowercase = (password) => /[a-z]/.test(password)
  const checkNumbers = (password) => /\d/.test(password)
  const checkSpecialChars = (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const checkStrength = (password) => {
    let s = 0
    if (checkLength(password)) s += 1
    if (checkUppercase(password)) s += 1
    if (checkLowercase(password)) s += 1
    if (checkNumbers(password)) s += 1
    if (checkSpecialChars(password)) s += 1
    setStrength(s / 5)
  };

  const checkRecommend = (password) => {
    if (!checkLength(password)) setRecommend('At least 8 characters')
    else if (!checkUppercase(password)) setRecommend('Add uppercase')
    else if (!checkLowercase(password)) setRecommend('Add lowercase')
    else if (!checkNumbers(password)) setRecommend('Add numbers')
    else if (!checkSpecialChars(password)) setRecommend('Add special characters')
    else setRecommend('Secure!')
  }

  const handleSetUp = async () => {
    console.log("strength: " + strength)
    if (strength === 1) {
      window.ipc.invoke('init-db')
      window.ipc.invoke('add-master-password', username, password)
  
      navigate("/Dashboard")
    }
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
            sx={{ 
              background: (strength == 0) ? 
                  '#B39DDB':
                  `linear-gradient(to right, #5883F2 ${strength * 100 - 20}%, #B39DDB ${strength * 100 + 20}%)`,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                    <span>{(strength == 0) ? '' : recommend}</span>
                </InputAdornment>
              )
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSetUp}
            sx={{
              textTransform: 'none',
              height: '50px',
              borderRadius: '50px',
              backgroundColor: '#36343A'
            }}
          >
            Set Up Account
          </Button>
          </Box>
      </Container>
    </GradientBackground>
  )
}