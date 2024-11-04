import React from 'react';
import { Box, Button, Typography, Modal, Backdrop } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const DeleteModalBox = styled(Box)({
  backgroundColor: '#897F8F',
  padding: '20px',
  borderRadius: '20px',
  width: '500px',
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  zIndex: 1400,
});

const BackdropBlur = styled(Backdrop)({
  zIndex: 1300,
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
});

const ModalContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
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

const DeletePassword = ({ isOpen, onClose, onDelete, username, website }) => {
  const navigate = useNavigate();

  // Function to handle Cancel button click
  const handleCancel = () => {
    onClose();
    navigate('/ViewPassword');
  };

  // Function to handle Delete button click
  const handleDelete = async () => {
    try {
      // Call the deletePassword API through Electron's IPC
      const response = await window.electronAPI.deletePassword(username, website);

      if (response.success) {
        onClose();  // Close the modal
        navigate('/HomePageNoPasswords');  // Navigate back after deletion
      } else {
        console.error('Failed to delete password:', response.error);
      }
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
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
