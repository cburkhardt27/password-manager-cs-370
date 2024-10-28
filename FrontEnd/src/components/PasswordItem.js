import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const PasswordItem = ({ password, onView, onEdit, onDelete }) => (
  <Box
    sx={{
      backgroundColor: '#CFC4FE',
      borderRadius: '15px',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 2,
    }}
  >
    <Typography variant="h6">{password.website}</Typography>
    <Box>
      <Button onClick={onView} sx={{ backgroundColor: '#5E35B1', color: '#FFFFFF', mr: 1 }}>
        View
      </Button>
      <Button onClick={onEdit} sx={{ backgroundColor: '#42A5F5', color: '#FFFFFF', mr: 1 }}>
        Edit
      </Button>
      <Button onClick={onDelete} sx={{ backgroundColor: '#E53935', color: '#FFFFFF' }}>
        Delete
      </Button>
    </Box>
  </Box>
);

export default PasswordItem;