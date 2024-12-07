import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Box, Typography, Button, IconButton } from '@mui/material'
import { Cached, CheckCircle } from '@mui/icons-material'

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

const CheckupButton = styled(Button)({
  backgroundColor: '#36343A',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
})

const NavigationButton = styled(Button)({
  backgroundColor: '#A472CB',
  color: '#fff',
  textTransform: 'none',
  margin: '10px',
  '&:hover': {
    backgroundColor: '#8B72CB',
  },
})

export default function CheckUp() {
  const [passwordData, setPasswordData] = useState({
    total: 0,
    reused: 0,
    weak: 0,
  })
  const [lastChecked, setLastChecked] = useState('Never')

  const fetchCheckupData = async () => {
    try {
      const result = await window.ipc.invoke('check-passwords') // Not sure backend logic exists??
       setLastChecked(new Date().toLocaleString())
    } catch (error) {
      console.error('Error fetching password checkup data:', error)
    }
  }
a
  useEffect(() => {
    fetchCheckupData()
  }, [])

  return (
    <Box>
      {/* Password Checkup Summary */}
      <FormBox>
        <Box>
          <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>
            Password Checkup
          </Typography>
          <Typography variant="body1" sx={{ mb: 0, color: '#DDDDDD' }}>
            Checked passwords for {passwordData.total} sites
          </Typography>
          <Typography variant="body2" sx={{ color: '#DDDDDD' }}>
            Last checked: {lastChecked}
          </Typography>
        </Box>
        <IconButton onClick={fetchCheckupData}>
          <Cached sx={{ color: '#FFFFFF' }} />
        </IconButton>
      </FormBox>

      {/* Reused Passwords Section */}
      <FormBox>
        <Box>
          <Typography variant="h6" sx={{ color: 'white' }}>
            {passwordData.reused > 0
              ? `${passwordData.reused} reused passwords`
              : 'Your passwords are unique'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#DDDDDD' }}>
            {passwordData.reused > 0
              ? 'Create unique passwords to enhance security'
              : "You're not reusing any passwords"}
          </Typography>
        </Box>
        <CheckCircle sx={{ color: passwordData.reused > 0 ? '#F39C12' : '#27AE60' }} />
      </FormBox>

      {/* Weak Passwords Section */}
      <FormBox>
        <Box>
          <Typography variant="h6" sx={{ color: 'white' }}>
            {passwordData.weak > 0
              ? `${passwordData.weak} weak passwords`
              : 'Your passwords look strong'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#DDDDDD' }}>
            {passwordData.weak > 0
              ? 'Consider updating weak passwords'
              : "You're using passwords that are hard to guess"}
          </Typography>
        </Box>
        <CheckCircle sx={{ color: passwordData.weak > 0 ? '#F39C12' : '#27AE60' }} />
      </FormBox>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <NavLink to="/Dashboard/CheckUpUnique" style={{ textDecoration: 'none' }}>
          <NavigationButton variant="contained">View Reused Passwords</NavigationButton>
        </NavLink>
        <NavLink to="/Dashboard/CheckUpStrength" style={{ textDecoration: 'none' }}>
          <NavigationButton variant="contained">View Weak Passwords</NavigationButton>
        </NavLink>
      </Box>
    </Box>
  )
}
