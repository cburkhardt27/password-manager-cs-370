import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Box, Typography, Button } from '@mui/material'

const PassBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  padding: '20px',
  borderRadius: '20px',
  maxWidth: '898px',
  height: 'auto',
  margin: 'auto',
  marginTop: '20px',
  marginBottom: '20px',
})

const ModalButton = styled(Button)({
  textTransform: 'none',
  backgroundColor: '#36343A',
  borderRadius: '50px',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
})

const FormBox = styled(Box)({
  display: 'flex',
  backgroundColor: '#564E5B',
  padding: '20px',
  borderRadius: '20px',
  maxWidth: '898px',
  margin: 'auto',
  marginTop: '20px',
  height: 'auto',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export default function CheckUpStrength() {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const checkPasswords = async () => {
      try {
        // Fetch the data
        const fetchedData = await window.ipc.invoke('display-all-passwords');
    
        // Debugging: Ensure fetchedData is valid
        if (!Array.isArray(fetchedData)) {
          console.error('Fetched data is not an array:', fetchedData);
          return;
        }
        
        // Filter weak passwords
        const weakPass = fetchedData.filter(entry => {
          // Ensure entry.password exists and is a string
          if (!entry.password || typeof entry.password !== 'string') {
            console.warn('Skipping entry due to invalid password:', entry);
            return false;
          }

          // Check password strength
          let s = 0;
          if (entry.password.length >= 8) s += 1; // Minimum length
          if (/[A-Z]/.test(entry.password)) s += 1; // Contains uppercase
          if (/[a-z]/.test(entry.password)) s += 1; // Contains lowercase
          if (/\d/.test(entry.password)) s += 1; // Contains number
          if (/[!@#$%^&*(),.?":{}|<>]/.test(entry.password)) s += 1; // Contains special character

          // Weak if strength <= 3
          return s <= 3;
        });
        
        // Update state with weak passwords
        setData(weakPass);
      } catch (error) {
        console.error('Error displaying all passwords:', error);
      }
    };
    

    checkPasswords();
  }, [refresh]);

  const handleDelete = async (entry) => {
    const data = {
      username: entry.username,
      url: entry.url
    };
    await window.ipc.invoke('delete-password', data);
    setRefresh((prev) => !prev);
  }

  return (
    <Box sx={{ justifyContent: 'center' }}>
      <FormBox>
        <Box>
          <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>
            Weak passwords
          </Typography>
          <Typography variant="body1" sx={{ mb: 0, color: '#DDDDDD' }}>
            Strong passwords are longer than 8 characters, include lower and upper case, numbers, and special characters.
          </Typography>
        </Box>
      </FormBox>

      {data.length > 0 ? (
        data.map((entry) => (
          <PassBox key={entry.id}>
            <Typography variant="subtitle1">Username: {entry.username}</Typography>
            <Typography variant="subtitle1">Website: {entry.url}</Typography>
            <Typography variant="subtitle1">Password: {entry.password}</Typography>
              <Button
                onClick={() => handleDelete(entry)}
                variant="contained"
                sx={{
                  textTransform: 'none',
                  borderRadius: '50px',
                  backgroundColor: '#36343A'
                }}    
              >Delete</Button>
          </PassBox>
        ))
      ) : (
        <PassBox>
          <Typography variant="subtitle1">No weak passwords!</Typography>
        </PassBox>
      )}
    </Box>
  );
}