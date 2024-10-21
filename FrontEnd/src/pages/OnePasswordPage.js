import React, { useState } from 'react';
import { AppBar, TextField, InputAdornment, IconButton, Drawer, List, ListItem, ListItemText, Box, Fab, Button, Typography, Toolbar } from '@mui/material';
import { Search, Add, Lock, Security, Settings } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

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

const ViewButton = styled(Button)({
    backgroundColor: '#36343A',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#333',
    },
});

const OnePasswordPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [passwords, setPasswords] = useState([
        { id: 1, website: 'emory.edu', username: 'user1', password: 'password123', note: 'No note added' },
    ]);

    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleAddPassword = () => {
        console.log('Add button clicked');
        // Add logic here for adding a new password
    };

    const handleViewPassword = (password) => {
        navigate('/ViewPassword', { state: { passwordEntry: password } });
    };

    const filteredPasswords = passwords.filter((password) =>
        password.website.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

                {/* Password List */}
                {filteredPasswords.length > 0 ? (
                    <Box sx={{ mt: 4 }}>
                        {filteredPasswords.map((password) => (
                            <Box
                                key={password.id}
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
                                <ViewButton onClick={() => handleViewPassword(password)}>
                                    View
                                </ViewButton>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="h6" sx={{ mt: 4 }}>
                        No passwords found.
                    </Typography>
                )}

                {/* Add Button */}
                <AddButton onClick={handleAddPassword}>
                    <Add />
                    &nbsp;Add
                </AddButton>
            </Box>
        </GradientBackground>
    );
};

export default OnePasswordPage;

