import React from 'react';
import { Box, Button, Typography, Modal, Backdrop } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';  // Import useNavigate to handle navigation

const DeleteModalBox = styled(Box)({
  backgroundColor: '#897F8F',
  padding: '20px',
  borderRadius: '20px',
  width: '500px',
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  zIndex: 1400,  // Ensure modal is above backdrop
});

const BackdropBlur = styled(Backdrop)({
  zIndex: 1300,  // Ensure it's below the modal content
  backdropFilter: 'blur(10px)',  // Apply blur effect to the background
  backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent dark background
});

const ModalContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',  // Full viewport height to vertically center the modal
});

const CancelButton = styled(Button)({
  backgroundColor: '#424242',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
});

const DeleteButton = styled(Button)({
  backgroundColor: '#E53935',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#D32F2F',
  },
});

const DeletePassword = ({ isOpen, onClose, onDelete, website }) => {
  const navigate = useNavigate();  // To handle navigation

  // Function to handle Cancel button click
  const handleCancel = () => {
    // Close the modal and navigate back to the ViewPassword page
    onClose();  // Call the onClose function to close the modal
    navigate('/ViewPassword');  // Navigate to the ViewPassword page
  };

  // Function to handle Delete button click
  const handleDelete = () => {
    // Simulate deletion of password (you can also delete from localStorage if required)
    localStorage.removeItem('passwordData');  // Remove the data from localStorage

    // Navigate back to the HomePageNoPasswords after deletion
    navigate('/HomePageNoPasswords');
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}  // Close modal on background click or ESC key
      closeAfterTransition
      BackdropComponent={BackdropBlur}
      BackdropProps={{ timeout: 500 }}
    >
      <ModalContainer>
        <DeleteModalBox>
          <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>
            Delete password?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'white' }}>
            Removing this password will not delete your account on {website}. Change your password or delete your account on{' '}
            <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" style={{ color: '#B39DDB' }}>
              {website}
            </a> to keep it safe from others.
          </Typography>

          <Box display="flex" justifyContent="space-between">
            <CancelButton variant="contained" onClick={handleCancel}>
              Cancel
            </CancelButton>
            <DeleteButton variant="contained" onClick={handleDelete}>
              Delete
            </DeleteButton>
          </Box>
        </DeleteModalBox>
      </ModalContainer>
    </Modal>
  );
};

export default DeletePassword;