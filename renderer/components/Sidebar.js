import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { AppBar, Box, Button, Drawer, InputAdornment, IconButton, List, ListItem, ListItemText, TextField, Typography} from '@mui/material';
import { Add, Lock, Security, Settings, Search } from '@mui/icons-material';
import { GradientBackground } from './Components';

export default function Dashboard() {
  return (
    <GradientBackground minHeight="100vh">
      <Drawer 
      variant='permanent' 
      anchor='left'
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          backgroundColor: '#36343A',
          color: '#fff'      
        }
      }}>
        <Box sx={{ padding: 2 }}>
          <Typography variant="h5" sx={{ flexGrow: 1, color: 'white', mb: 3 }}>
            Password Manager
          </Typography>
          <List>
            <NavLink to="/Dashboard/Passwords" style={{ textDecoration: 'none' }}>
              <ListItem button>
                <Lock sx={{ mr: 2, color: '#8B8B8B' }} />
                <ListItemText primary="Passwords" sx={{ color: 'white' }}/>
              </ListItem>
            </NavLink>
            <NavLink to="/Dashboard/CheckUpStrength" style={{ textDecoration: 'none' }}>
              <ListItem button>
                <Security sx={{ mr: 2, color: '#8B8B8B' }} />
                <ListItemText primary="Check Strength" sx={{ color: 'white' }}/>
              </ListItem>
            </NavLink>
            <NavLink to="/Dashboard/CheckUpUnique" style={{ textDecoration: 'none' }}>
              <ListItem button>
                <Security sx={{ mr: 2, color: '#8B8B8B' }} />
                <ListItemText primary="Check Repeated" sx={{ color: 'white' }}/>
              </ListItem>
            </NavLink>
            <NavLink to="/Dashboard/Settings" style={{ textDecoration: 'none' }}>
              <ListItem button>
                <Settings sx={{ mr: 2, color: '#8B8B8B' }} />
                <ListItemText primary="Settings" sx={{ color: 'white' }}/>
              </ListItem>
            </NavLink>
          </List>
        </Box>
      </Drawer>
      <Box sx={{ 
        flexGrow: 1,
        padding: '10px',
        position: 'relative',
        marginLeft: '240px',
      }}>
        {/* search bar AND add password here*/}
        <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'right' }}>
            <NavLink to="/Dashboard/AddPassword">
              <Button
                startIcon={<Add />}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  height: '50px', // Set the same height as the search bar
                  width: '100px',
                  borderRadius: '50px',
                  backgroundColor: '#36343A'
                }}
              >
                Add
              </Button>
            </NavLink>
          </Box>
        </AppBar>
        <Outlet />
      </Box>
    </GradientBackground>
  )
}