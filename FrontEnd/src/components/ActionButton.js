import React from 'react';
import { Button } from '@mui/material';

const ActionButton = ({ label, onClick, color = '#36343A', hoverColor = '#333' }) => (
  <Button
    onClick={onClick}
    sx={{
      backgroundColor: color,
      color: '#fff',
      '&:hover': {
        backgroundColor: hoverColor,
      },
      borderRadius: '50px',
    }}
  >
    {label}
  </Button>
);

export default ActionButton;