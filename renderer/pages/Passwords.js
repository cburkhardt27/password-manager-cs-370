import { Box, Button, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PassModal = styled(Box)({
  display: 'flex',
  height: 'auto',
  width: 'auto',
  padding: '20px',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  borderRadius: '20px'
});

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
});

const ModalButton = styled(Button)({
  textTransform: 'none',
  backgroundColor: '#36343A',
  borderRadius: '50px',
  color: '#36343A',
});

export default function Passwords() {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // Fetch passwords
  useEffect(() => {
    const checkPasswords = async () => {
      try {
        const fetchedData = await window.ipc.invoke('display-all-passwords');
        setData(fetchedData);
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
          <Typography variant="subtitle1">No passwords saved</Typography>
        </PassBox>
      )}
    </Box>
  );
}