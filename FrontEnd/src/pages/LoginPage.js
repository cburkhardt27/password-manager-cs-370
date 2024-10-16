
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled } from '@mui/system';

// Styled Container for the Login Box
const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
}));

function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'password') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box 
        height="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <LoginPaper elevation={6}>
          <LockOutlinedIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <TextField
              label="Master Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              helperText={error ? 'Incorrect password. Try again.' : ''}
              autoFocus
              required
            />
            <Button 
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
        </LoginPaper>
      </Box>
    </Container>
  );
}

export default LoginPage;
