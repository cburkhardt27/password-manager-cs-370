import { Avatar, Box, IconButton, TextField } from '@mui/material'
import styled from 'styled-components'

// Background
const GradientBackground = styled(Box)({
  width: '100%',
  height: '100vh',
  background: 'linear-gradient(210deg, #A472CB, #5883F2)',
})

// Sidebar

// Icons
const StyledAvatar = styled(Avatar)({
  width: '120px !important',
  height: '120px !important',
  backgroundColor: '#ffffff33',
  color: '#FFFFFF',
})

// Text
const StyledTextField = styled(TextField)({
  backgroundColor: '#FFFFFFCC',
  borderRadius: '50px',
  maxWidth: '500px',
  '& .MuiOutlinedInput-root': {
    paddingRight: '10px',
  },
})

// Buttons
const StyledIconButton = styled(IconButton)({
  backgroundColor: '#5E35B1',
  color: '#FFFFFF',
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: '#512DA8',
  },
})

export {
  GradientBackground,
  StyledAvatar,
  StyledIconButton,
  StyledTextField
}