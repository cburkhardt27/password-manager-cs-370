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
  const [openModals, setOpenModals] = useState({}); // Track open state for each modal using entry id

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
  }, []);

  // Open modal for a specific entry
  const openModal = (id) => {
    setOpenModals((prevState) => ({
      ...prevState,
      [id]: true,  // Set the modal for the specific entry id to open
    }));
  };

  // Close modal for a specific entry
  const closeModal = (id) => {
    setOpenModals((prevState) => ({
      ...prevState,
      [id]: false,  // Set the modal for the specific entry id to closed
    }));
  };

  // Modal for each entry
  const Modal = (entry) => (
    <PassModal>
      <Box>
        <Typography variant="body1">Username: {entry.username}</Typography>
        <Typography variant="body1">Password: {entry.password}</Typography>
      </Box>
      <Box>
        <ModalButton onClick={() => closeModal(entry.id)}>Edit</ModalButton>
        <ModalButton onClick={() => closeModal(entry.id)}>Delete</ModalButton>
        <ModalButton onClick={() => closeModal(entry.id)}>Close</ModalButton>
      </Box>
    </PassModal>
  );

  return (
    <Box sx={{ justifyContent: 'center' }}>
      {data.length > 0 ? (
        data.map((entry) => (
          <PassBox key={entry.id}>
            <Typography variant="subtitle1">{entry.url}</Typography>
            {/* Show the View button if the modal for this entry is not open */}
            {!openModals[entry.id] && (
              <ModalButton
                variant="contained"
                onClick={() => openModal(entry.id)}
              >
                View
              </ModalButton>
            )}
            {/* Show the modal only if openModals[entry.id] is true */}
            {openModals[entry.id] && Modal(entry)}
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