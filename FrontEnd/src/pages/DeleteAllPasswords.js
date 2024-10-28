import React, { useState } from 'react';
// Delete unused
import {Divider, AppBar, TextField, InputAdornment, IconButton, Drawer, List, ListItem, ListItemText, Box, Button, Fab, Typography, Toolbar } from '@mui/material';
import { Search, ArrowBack, Lock, Security, Settings } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const Overlay = styled(Divider)({
  position: 'fixed',
  inset: '0',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: '1000'
})

const DeletePopup = styled(Box)({
  backgroundColor: '#897F8F',
  padding: '20px',
  borderRadius: '20px',
  maxWidth: '898px',
  margin: 'auto',
  marginTop: '100px',  // Add some margin to ensure space at the top
  height: 'auto',     // Adjust height for flexibility
  // minHeight: '260px', // Increase the height of the form box
});

const CancelButton = styled(Button)({
  backgroundColor: '#36343A',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
});

const DeleteButton = styled(Button)({
  backgroundColor: '#5A83F2',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'red',
  },
});

const DeleteAllPasswordsPage = () => {
  return (
    <Overlay>
      <DeletePopup>
        <Box>
          <Typography variant="h6" sx={{ mb: 0, color: 'white' }} align="left">
            You're about to delete your Password Manager data
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
            <CancelButton variant="contained">
              Cancel
            </CancelButton>
            <DeleteButton variant="contained">
              Delete
            </DeleteButton>
          </Box>
      </DeletePopup>
    </Overlay>
  )
}

export default DeleteAllPasswordsPage // Rename pop-up?