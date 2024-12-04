import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Box, Typography } from '@mui/material'

const FormBox = styled(Box)({
  display: 'flex',
  backgroundColor: '#564E5B',
  padding: '20px',
  borderRadius: '20px',
  maxWidth: '898px',
  margin: 'auto',
  marginTop: '20px',
  height: 'auto',  
})

const SettingsButton = styled(Button)({
  backgroundColor: '#36343A',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
})

export default function Settings() {
  const navigate = useNavigate()

  const handleDeleteDB = async () => {
    try {
      await window.ipc.invoke('delete-database').then(
        await window.ipc.invoke('init-db')
      )
      navigate("/SetUpPage")
    } catch (error) {
      console.error('Error adding password:', error)
      return
    }
  }  

  return (
    <FormBox mt={1}>
      <Box display="flex" alignItems="center">
        <Box>
          <Typography variant="h5" sx={{ mb: 3, color: 'white' }} align="left">
            Delete all Password Manager data
          </Typography>
          <Typography variant="h6" sx={{ mb: 0, color: '#DDDDDD' }} align="left">
            Passwords and other data will be permanently deleted
          </Typography>
        </Box>
        <NavLink to="/SetUpPage">
          <SettingsButton 
            variant="contained" 
            onClick={handleDeleteDB} 
            sx={{
              textTransform: 'none',
              borderRadius: '50px',
              backgroundColor: '#36343A'
            }}
          >
            Delete
          </SettingsButton>
        </NavLink>
      </Box>
    </FormBox>
  )
}