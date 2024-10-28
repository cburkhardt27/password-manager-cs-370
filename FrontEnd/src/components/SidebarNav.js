import React from 'react';
import { Drawer, List, ListItem, ListItemText, Box, Typography } from '@mui/material';
import { Lock, Security, Settings } from '@mui/icons-material';

const SidebarNav = ({ activeItem, onNavigate }) => (
  <Drawer variant="permanent" anchor="left">
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ flexGrow: 1, color: 'white', mb: 3 }}>
        Password Manager
      </Typography>
      <List>
        <ListItem button selected={activeItem === 'Passwords'} onClick={() => onNavigate('/OnePasswordPage')}>
          <Lock sx={{ mr: 2, color: activeItem === 'Passwords' ? '#FFFFFF' : '#8B8B8B' }} />
          <ListItemText primary="Passwords" />
        </ListItem>
        <ListItem button selected={activeItem === 'Checkup'} onClick={() => onNavigate('/Checkup')}>
          <Security sx={{ mr: 2, color: activeItem === 'Checkup' ? '#FFFFFF' : '#8B8B8B' }} />
          <ListItemText primary="Checkup" />
        </ListItem>
        <ListItem button selected={activeItem === 'Settings'} onClick={() => onNavigate('/Settings')}>
          <Settings sx={{ mr: 2, color: activeItem === 'Settings' ? '#FFFFFF' : '#8B8B8B' }} />
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Box>
  </Drawer>
);

export default SidebarNav;