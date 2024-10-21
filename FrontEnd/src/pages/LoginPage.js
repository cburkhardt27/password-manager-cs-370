import React, { useState } from 'react';
import { Avatar, TextField, IconButton, Box, Container, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

// Styled components using Material UI's styled API
const GradientBackground = styled(Box)({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(210deg, #A472CB, #5883F2)',  // Blue to purple gradient
});

const StyledAvatar = styled(Avatar)({
  width: '100px',
  height: '100px',
  backgroundColor: '#ffffff33',  // Semi-transparent white
  color: '#FFFFFF',  // White icon
});

const StyledTextField = styled(TextField)({
  backgroundColor: '#FFFFFFCC',  // Semi-transparent white background
  borderRadius: '50px',  // Fully rounded corners
  maxWidth: '500px',  // Restrict the width
  '& .MuiOutlinedInput-root': {
    paddingRight: '10px',  // Ensure there's room for the end adornment (the arrow button)
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
  const navigate = useNavigate();  // React Router's useNavigate hook

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    const masterPassword = 'password';  // Replace with your actual password validation logic
    if (password === masterPassword) {
      // Navigate to homepage with no passwords
      navigate('/HomePageNoPasswords');  // Change '/homepage' to the actual route you use for the homepage
    } else {
      alert('Invalid password!');
    }
  };

  return (
    <GradientBackground>
      <Container maxWidth="sm">
        {/* Avatar */}
        <Box display="flex" justifyContent="center" mb={4}>
          <StyledAvatar>
            <Typography variant="h1">👤</Typography>  {/* Placeholder for avatar */}
          </StyledAvatar>
        </Box>

        {/* Password Input */}
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


