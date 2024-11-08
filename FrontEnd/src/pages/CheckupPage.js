import React, { useState } from 'react';
import { AppBar, TextField, InputAdornment, IconButton, Drawer, List, ListItem, ListItemText, Box, Button, Fab, Typography, Toolbar } from '@mui/material';
import { Search, Lock, Security, Settings, Cached , OpenInFull } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const GradientBackground = styled(Box)({
  height: '100vh',
  display: 'flex',
  background: 'linear-gradient(210deg, #A472CB, #5883F2)',  // Blue to purple gradient
});

const Sidebar = styled(Drawer)({
  width: 240,
  '& .MuiDrawer-paper': {
    width: 240,
    backgroundColor: '#36343A',
    color: '#fff',
  },
});

const FormBox = styled(Box)({
  backgroundColor: '#564E5B',
  padding: '20px',
  borderRadius: '20px',
  maxWidth: '898px',
  margin: 'auto',
  marginTop: '20px', // Add some margin to ensure space at the top
  height: 'auto',     // Adjust height for flexibility
});

const CheckupButton = styled(Button)({
  backgroundColor: '#8B8B8B',
  color: '#fff',
  textTransform: 'none',
  borderRadius: '50px',
  padding: '10px 30px',  // Wider padding for oval shape
  minHeight: '60px',
  '&:hover': {
    backgroundColor: 'red',
  },
});

const CheckupPage = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handlePassword = () => {
    // Navigate to the ViewPasswordPage
    navigate('/ViewPassword');
  };

  const handleSettings = () => {
    // Navigate to the CheckupPage
    navigate('/SettingsPage');
  };

  const handleCheckupFunction = () => {
    // Logic for checking passwords or calling a function.
  }

  const handleCheckupUnique = () => {
    navigate('/CheckupUniquePage');
  }

  const handleCheckupStrength = () => {
    navigate('/CheckupStrengthPage');
  }

  return (
    <GradientBackground>
      {/* Sidebar Navigation */}
      <Sidebar variant="permanent" anchor="left">
        <Box sx={{ padding: 2 }}>
          {/* Sidebar Title */}
          <Typography variant="h5" sx={{ flexGrow: 1, color: 'white', mb: 3 }}>
            Password Manager
          </Typography>

          {/* Navigation Items */}
          <List>
            <ListItem button onClick={handlePassword}>
              <Lock sx={{ mr: 2, color: '#8B8B8B' }} />
              <ListItemText primary="Passwords" />
            </ListItem>
            <ListItem button sx={{ backgroundColor: '#A472CB' }}>
              <Security sx={{ mr: 2, color: '#FFFFFF' }} />
              <ListItemText primary="Checkup" />
            </ListItem>
            <ListItem button onClick={handleSettings}>
              <Settings sx={{ mr: 2, color: '#8B8B8B' }} />
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>
      </Sidebar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
        {/* Search Bar */}
        <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
          <Toolbar>
            <TextField
              variant="outlined"
              placeholder="Search passwords"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                backgroundColor: '#FFFFFFCC',
                borderRadius: '50px',
                width: '50%',
              }}
            />
          </Toolbar>
        </AppBar>

        {/* Checkup */}
        <div style={{ margin: '100px' }} />
        <FormBox mt={1}>
          <Box display="flex" alignItems="center">
            <Box>
              <Typography variant="h5" sx={{ mb: 3, color: 'white' }} align="left">
                Check passwords
              </Typography>
              <Typography variant="h6" sx={{ mb: 0, color: '#DDDDDD' }} align="left">
                Check your passwords for uniqueness and strength
              </Typography>
            </Box>
            <CheckupButton variant="contained" onClick={handleCheckupFunction} sx={{ marginLeft: 'auto' }}>
              <Cached sx={{ color: '#FFFFFF' }} />
            </CheckupButton>
          </Box>
        </FormBox>
        <FormBox mt={1}>
          <Box display="flex" alignItems="center">
            <Box>
              <Typography variant="h5" sx={{ mb: 3, color: 'white' }} align="left">
                Your passwords are unique
              </Typography>
              <Typography variant="h6" sx={{ mb: 0, color: '#DDDDDD' }} align="left">
                You're not reusing any passwords!
              </Typography>
            </Box>
            <CheckupButton variant="contained" onClick={handleCheckupUnique} sx={{ marginLeft: 'auto' }}>
              <OpenInFull sx={{ color: '#FFFFFF' }} />
            </CheckupButton>
          </Box>
        </FormBox>
        <FormBox mt={1}>
          <Box display="flex" alignItems="center">
            <Box>
              <Typography variant="h5" sx={{ mb: 3, color: 'white' }} align="left">
                Your passwords are strong
              </Typography>
              <Typography variant="h6" sx={{ mb: 0, color: '#DDDDDD' }} align="left">
                Your passwords are hard to guess!
              </Typography>
            </Box>
            <CheckupButton variant="contained" onClick={handleCheckupStrength} sx={{ marginLeft: 'auto' }}>
              <OpenInFull sx={{ color: '#FFFFFF' }} />
            </CheckupButton>
          </Box>
        </FormBox>
      </Box>
    </GradientBackground>
  )
};

export default CheckupPage;