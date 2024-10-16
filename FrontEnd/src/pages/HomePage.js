// src/pages/HomePage.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, TextField, Grid, Button, Paper, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled } from '@mui/system';

const PasswordItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

function HomePage({ onLogout }) {
  const [passwords, setPasswords] = useState([
    { id: 1, name: 'emory.edu' },
    { id: 2, name: 'github.com' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredPasswords = passwords.filter((password) =>
    password.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Password Manager
          </Typography>
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          {['Passwords', 'Checkup', 'Settings'].map((text) => (
            <ListItemButton key={text}>
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Grid container spacing={2} padding={2}>
        <Grid item xs={9}>
          <TextField
            label="Search Passwords"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={3}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            fullWidth
          >
            Add
          </Button>
        </Grid>

        <Grid item xs={12}>
          {filteredPasswords.map((password) => (
            <PasswordItem key={password.id}>
              <Typography>{password.name}</Typography>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </PasswordItem>
          ))}
        </Grid>
      </Grid>
    </>
  );
}

export default HomePage;
