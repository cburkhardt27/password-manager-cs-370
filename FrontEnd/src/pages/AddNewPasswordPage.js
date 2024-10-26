import React, { useState } from 'react';
import { AppBar, TextField, InputAdornment, IconButton, Drawer, List, ListItem, ListItemText, Box, Button, Fab, Typography, Toolbar } from '@mui/material';
import { Search, ArrowBack, Lock, Security, Settings } from '@mui/icons-material';
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
  marginTop: '100px',  // Adding some margin to ensure space at the top
  height: 'auto',     
  minHeight: '260px', 
});

const BackButton = styled(Fab)({
  backgroundColor: '#36343A',
  color: '#fff',
  borderRadius: '50px',
  padding: '10px 50px',  // Wider padding for oval shape
  position: 'absolute',
  top: '100px',         // Lower the position of the back button
  left: '20px',
  '&:hover': {
    backgroundColor: '#333',
  },
});

const CancelButton = styled(Button)({
  backgroundColor: '#36343A',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
});

const SaveButton = styled(Button)({
  backgroundColor: '#5A83F2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#5A83F2',
  },
});

const AddNewPasswordPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    website: '',
    note: ''
  });

  const navigate = useNavigate();  // For navigating to OnePasswordPage

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    // Simulate saving the form data to localStorage or state
    localStorage.setItem('passwordData', JSON.stringify(formData));  // Save the data to localStorage

    // Navigate to OnePasswordPage and pass the saved data
    navigate('/OnePasswordPage', { state: { website: formData.website, username: formData.username, password: formData.password, note: formData.note } });
  };

  const handleCancel = () => {
    // Navigate back to HomePageNoPasswords
    navigate('/HomePageNoPasswords');  
  };

  const handleBack = () => {
    // Navigate back to HomePageNoPasswords if no data is saved
    navigate('/HomePageNoPasswords');
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

        {/* Back Button */}
        <BackButton onClick={handleBack}>
          <ArrowBack />
          Back
        </BackButton>

        {/* Form Section */}
        <FormBox mt={4}>
          <Typography variant="h5" sx={{ mb: 3, color: 'white' }} align="center">
            Add New Password
          </Typography>
          <Box display="flex" gap={3} mb={3}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: '#B39DDB', borderRadius: '15px' }}
            />
            <TextField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: '#B39DDB', borderRadius: '15px' }}
            />
          </Box>
          <Box display="flex" gap={3} mb={3}>
            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: '#B39DDB', borderRadius: '15px' }}
            />
            <TextField
              label="Note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: '#B39DDB', borderRadius: '15px' }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <CancelButton variant="contained" onClick={handleCancel}>
              Cancel
            </CancelButton>
            <SaveButton variant="contained" onClick={handleSave}>
              Save
            </SaveButton>
          </Box>
        </FormBox>
      </Box>
    </GradientBackground>
  );
};

export default AddNewPasswordPage;