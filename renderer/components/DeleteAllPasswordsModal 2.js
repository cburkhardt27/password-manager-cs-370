import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const ModalBox = styled(Box)({
  backgroundColor: '#564E5B',
  borderRadius: '20px',
  padding: '20px',
  width: '400px',
  textAlign: 'center',
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

const DeleteAllPasswordsModal = ({ isOpen, handleCancel, handleConfirm }) => {
  return (
    <Modal
      open={isOpen}
      onClose={handleCancel}
      aria-labelledby="delete-passwords-title"
      aria-describedby="delete-passwords-description"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ModalBox>
        <Typography variant="h6" id="delete-passwords-title" color="white" mb={2}>
          You're about to delete your Password Manager data
        </Typography>
        <Typography variant="body2" id="delete-passwords-description" color="#E57373" mb={4}>
          If you continue, your passwords and other data will be permanently deleted from the Password Manager. Any accounts you created won’t be deleted.
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          <DeleteButton onClick={handleConfirm}>Delete</DeleteButton>
        </Box>
      </ModalBox>
    </Modal>
  );
};

export default DeleteAllPasswordsModal;

