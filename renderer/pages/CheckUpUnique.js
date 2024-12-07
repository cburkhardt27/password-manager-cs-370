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
        const response = await window.ipc.invoke('get-repeated-passwords'); // API endpoint
        setData(response.repeated_passwords); // Update state with repeated passwords
      } catch (error) {
        console.error('Error fetching repeated passwords:', error);
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
            Repeated passwords
          </Typography>
          <Typography variant="body1" sx={{ mb: 0, color: '#DDDDDD' }}>
            Repeated passwords present a security risk.
          </Typography>
        </Box>
      </FormBox>
      {data.length > 0 ? (
        data.map((entry, entryIndex) => (
          <PassBox key={entryIndex}>
            <Typography variant="subtitle1">Password: {entry.password}</Typography>
            {entry.details.map((detail, detailIndex) => (
              <Box key={detailIndex} sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Username: {detail.username}</Typography>
                <Typography variant="subtitle1">Website: {detail.url}</Typography>
                <Button
                  onClick={() => handleDelete(detail)} // Pass each individual detail for deletion
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    borderRadius: '50px',
                    backgroundColor: '#36343A',
                  }}
                >
                  Delete
                </Button>
              </Box>
            ))}
          </PassBox>
        ))
      ) : (
        <PassBox>
          <Typography variant="subtitle1">No repeated passwords!</Typography>
        </PassBox>
      )}
    </Box>
  );
}