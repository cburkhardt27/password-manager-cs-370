import React, { useState, useEffect } from 'react';
import { Avatar, TextField, Box, Container, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

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
  marginBottom: '20px',
});

const SetUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileExists, setProfileExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingProfile = async () => {
      try {
        console.log("Checking if profile exists...");
        const response = await fetch(`${window.electronAPI.flaskUrl}/get_master_password`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.username) {
            setProfileExists(true);
            console.log("Profile found:", result.username);
          } else {
            console.log("No profile found.");
          }
        } else {
          console.warn("Failed to check profile existence, server responded with:", response.status);
        }
      } catch (error) {
        console.error("Error checking existing profile:", error);
      }
    };

    checkExistingProfile();
  }, []);

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSetup = async () => {
    if (password.length <= 8 || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      alert("Password must be longer than 8 characters, include a number, and a special character.");
      return;
    }

    if (profileExists) {
      const confirmOverwrite = window.confirm("A profile already exists. Proceeding will overwrite the current profile. Continue?");
      if (!confirmOverwrite) return;
    }

    try {
      console.log("Attempting setup with data:", { username, password });
      const response = await fetch(`${window.electronAPI.flaskUrl}/add_master_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log("Server response status:", response.status);
      
      const result = await response.json();
      console.log("Server response data:", result);

      if (response.ok) {
        alert('Setup successful!');
        navigate('/LoginPage');
      } else {
        alert(result.message || 'Error during setup. Please try again.');
      }
    } catch (error) {
      console.error('Error during setup:', error.message || error);
      alert(`An error occurred: ${error.message || 'while setting up the account.'}`);
    }
  };

  return (
    <GradientBackground>
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" mb={4}>
          <StyledAvatar>
            <Typography variant="h1">🔐</Typography>
          </StyledAvatar>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
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
          <Button variant="contained" color="primary" onClick={handleSetup}>
            Set Up Account
          </Button>
        </Box>
      </Container>
    </GradientBackground>
  );
};

export default SetUpPage;


