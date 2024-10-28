import React from 'react';
import PasswordItem from './PasswordItem';
import { Box, Typography } from '@mui/material';

const PasswordList = ({ passwords, onView, onEdit, onDelete }) => (
  <Box>
    {passwords.length > 0 ? (
      passwords.map((password) => (
        <PasswordItem
          key={password.id}
          password={password}
          onView={() => onView(password)}
          onEdit={() => onEdit(password)}
          onDelete={() => onDelete(password.id)}
        />
      ))
    ) : (
      <Typography variant="h6" sx={{ mt: 4 }}>
        No passwords found.
      </Typography>
    )}
  </Box>
);

export default PasswordList;