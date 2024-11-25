import React, { useState } from 'react';
import { Avatar, TextField, IconButton, Box, Container, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

// BEAUTTAH ADDED THIS FOR DEBUGGING
window.api = {
  flaskUrl: 'http://localhost:5000'
};


const GradientBackground = styled(Box)({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(210deg, #A472CB, #5883F2)',
});

const StyledAvatar = styled(Avatar)({
  width: '100px',
  height: '100px',
  backgroundColor: '#ffffff33',
  color: '#FFFFFF',
});

const StyledTextField = styled(TextField)({
  backgroundColor: '#FFFFFFCC',
  borderRadius: '50px',
  maxWidth: '500px',
  '& .MuiOutlinedInput-root': {
    paddingRight: '10px',
  },
});

const StyledIconButton = styled(IconButton)({
  backgroundColor: '#5E35B1',
  color: '#FFFFFF',
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: '#512DA8',
  },
});

const LoginPage = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  
const handleLogin = async (username, password) => {
  try {
    console.log("Attempting login with data:", { username, password });

    const response = await fetch(`${window.api.flaskUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Login successful:", data);
      // Proceed to the next part of your app after successful login
      navigate('/HomePageNoPasswords');
    } else {
      console.error("Error during login:", data.message);
      // Handle login failure (e.g., show error message to user)
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};

  return (
    <GradientBackground>
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" mb={4}>
          <StyledAvatar>
            <Typography variant="h1">👤</Typography>
          </StyledAvatar>
        </Box>
        <Box display="flex" justifyContent="center">
          <StyledTextField
            variant="outlined"
            type="password"
            placeholder="Input Master Password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <StyledIconButton onClick={handleLogin}>
                  <ArrowForward />
                </StyledIconButton>
              ),
            }}
          />
        </Box>
      </Container>
    </GradientBackground>
  );
};

export default LoginPage;


