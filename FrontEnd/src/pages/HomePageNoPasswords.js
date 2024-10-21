import React, { useState } from 'react';
import { AppBar, TextField, InputAdornment, IconButton, Drawer, List, ListItem, ListItemText, Box, Fab, Typography, Toolbar } from '@mui/material';
import { Search, Add, Lock, Security, Settings } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

// Styled components
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

const AddButton = styled(Fab)({
  position: 'absolute',
  top: 20,
  right: 20,
  backgroundColor: '#36343A',
  color: '#fff',
  borderRadius: '50px',
  padding: '0px 50px',  // Wider padding for oval shape
  '&:hover': {
    backgroundColor: '#333',
  },
});

const HomePageNoPasswords = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();  // Hook for navigation

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddPassword = () => {
    // Navigate to the AddNewPasswordPage
    navigate('/AddNewPasswordPage');
  };

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
            {/* Highlight "Passwords" to indicate current page */}
            <ListItem button sx={{ backgroundColor: '#A472CB' }}>
              <Lock sx={{ mr: 2, color: '#FFFFFF' }} />  {/* White icon */}
              <ListItemText primary="Passwords" />
            </ListItem>
            <ListItem button>
              <Security sx={{ mr: 2, color: '#8B8B8B' }} />
              <ListItemText primary="Checkup" />
            </ListItem>
            <ListItem button>
              <Settings sx={{ mr: 2, color: '#8B8B8B' }} />
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>
      </Sidebar>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
        {/* Search Bar */}
        <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
          <Toolbar>
            <TextField
              variant="outlined"
              placeholder="Search passwords"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: '#FFFFFFCC',
                borderRadius: '50px',
                width: '50%',
              }}
            />
          </Toolbar>
        </AppBar>

        {/* Empty State */}
        <Box sx={{ textAlign: 'left', mt: 5 }}>
          <Typography variant="h6" sx={{ color: 'white' }}>
            Add your first password!
          </Typography>
        </Box>

        {/* Add Button */}
        <AddButton onClick={handleAddPassword}>
          <Add />
          &nbsp;Add
        </AddButton>
      </Box>
    </GradientBackground>
  );
};

export default HomePageNoPasswords;