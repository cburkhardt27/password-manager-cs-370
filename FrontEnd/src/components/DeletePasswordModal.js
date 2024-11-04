import React from 'react';
import { Box, Button, Typography, Modal, Backdrop } from '@mui/material';
import { styled } from '@mui/system';

const ModalBox = styled(Box)({
  backgroundColor: '#897F8F',
  padding: '20px',
  borderRadius: '20px',
  width: '500px',
  textAlign: 'center',
});

const DeletePasswordModal = ({ isOpen, onClose, onDelete, website }) => (
  <Modal
    open={isOpen}
    onClose={onClose}
    BackdropComponent={() => <Backdrop open />}
    closeAfterTransition
  >
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <ModalBox>
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
          <Button onClick={onClose} sx={{ backgroundColor: '#424242', color: '#fff', mr: 2 }}>
            Cancel
          </Button>
          <Button onClick={onDelete} sx={{ backgroundColor: '#E53935', color: '#fff' }}>
            Delete
          </Button>
        </Box>
      </ModalBox>
    </Box>
  </Modal>
);

export default DeletePasswordModal;