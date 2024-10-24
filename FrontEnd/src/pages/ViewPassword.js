import React, { useState } from 'react';
import { AppBar, TextField, InputAdornment, IconButton, Drawer, List, ListItem, ListItemText, Box, Button, Fab, Typography, Toolbar } from '@mui/material';
import { Search, ArrowBack, Lock, Security, Settings } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate, useLocation } from 'react-router-dom';
import DeletePassword from './DeletePassword.js';  // Import the DeletePassword modal

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
  marginTop: '100px',
  height: 'auto',
  minHeight: '260px',
});

const BackButton = styled(Fab)({
  backgroundColor: '#36343A',
  color: '#fff',
  borderRadius: '50px',
  padding: '10px 50px',
  position: 'absolute',
  top: '100px',
  left: '20px',
  '&:hover': {
    backgroundColor: '#333',
  },
});

const DeleteButton = styled(Button)({
  backgroundColor: '#36343A',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#36343A',
  },
});

const EditButton = styled(Button)({
  backgroundColor: '#5A83F2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#5A83F2',
  },
});

const ViewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch the saved password data from location state or from localStorage
  const passwordEntry = location.state?.passwordEntry || JSON.parse(localStorage.getItem('passwordData'));

  const handleBack = () => {
    navigate('/OnePasswordPage');
  };

  const handleEdit = () => {
    // Navigate to the edit page with the current password details
    navigate('/EditPassword', { state: { passwordEntry } });
  };

  const handleDelete = () => {
    // Open the delete modal
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    // Logic to delete the password (can be done via localStorage or API)
    localStorage.removeItem('passwordData');  // For now, remove from localStorage
    setDeleteModalOpen(false);
    navigate('/OnePasswordPage');  // Navigate back after deletion
  };

  return (
    <GradientBackground>
      <Sidebar variant="permanent" anchor="left">
        <Box sx={{ padding: 2 }}>
          <Typography variant="h5" sx={{ flexGrow: 1, color: 'white', mb: 3 }}>
            Password Manager
          </Typography>
          <List>
            <ListItem button sx={{ backgroundColor: '#A472CB' }}>
              <Lock sx={{ mr: 2, color: '#FFFFFF' }} />
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

      <Box sx={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
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

        <BackButton onClick={handleBack}>
          <ArrowBack />
          Back
        </BackButton>

        <FormBox mt={4}>
          <Typography variant="h5" sx={{ mb: 3, color: 'white' }} align="center">
            {passwordEntry?.website || 'No Website'}
          </Typography>
          <Box display="flex" gap={3} mb={3}>
            <TextField
              label="Username"
              value={passwordEntry?.username || 'No username provided'}
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: '#B39DDB', borderRadius: '15px' }}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Website"
              value={passwordEntry?.website || 'No website provided'}
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: '#B39DDB', borderRadius: '15px' }}
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
          <Box display="flex" gap={3} mb={3}>
            <TextField
              label="Password"
              value={passwordEntry?.password ? '************' : 'No password provided'}
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: '#B39DDB', borderRadius: '15px' }}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Note"
              value={passwordEntry?.note || 'No note added'}
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: '#B39DDB', borderRadius: '15px' }}
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <DeleteButton variant="contained" onClick={handleDelete}>
              Delete
            </DeleteButton>
            <EditButton variant="contained" onClick={handleEdit}>
              Edit
            </EditButton>
          </Box>
        </FormBox>

        {/* Delete Modal */}
        <DeletePassword
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleConfirmDelete}
          website={passwordEntry?.website}
        />
      </Box>
    </GradientBackground>
  );
};

export default ViewPassword;