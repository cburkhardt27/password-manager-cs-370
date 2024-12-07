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

export default function CheckUpStrength() {
  const [passwordIssues, setPasswordIssues] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWeakPasswords = async () => {
      try {
        const fetchedData = await window.ipc.invoke('fetch_weak_passwords') // Not sure backend function exists??
        setPasswordIssues(fetchedData || [])
      } catch (error) {
        console.error('Error fetching weak passwords:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeakPasswords()
  }, [refresh])

  const handleDelete = async (entry) => {
    try {
      const data = {
        username: entry.username,
        url: entry.url,
      }
      await window.ipc.invoke('delete-password', data)
      setRefresh((prev) => !prev)
    } catch (error) {
      console.error('Error deleting password:', error)
    }
  }

  return (
    <Box sx={{ justifyContent: 'center' }}>
      <PassBox>
        <Typography variant="h5" sx={{ color: 'white', marginBottom: '20px' }}>
          Password Strength Checkup
        </Typography>
      </PassBox>
      {isLoading ? (
        <PassBox>
          <Typography variant="subtitle1">Loading weak passwords...</Typography>
        </PassBox>
      ) : passwordIssues.length > 0 ? (
        passwordIssues.map((entry) => (
          <PassBox key={entry.id}>
            <Typography variant="subtitle1">Username: {entry.username}</Typography>
            <Typography variant="subtitle1">Website: {entry.url}</Typography>
            <Typography variant="subtitle1">Password: {entry.password}</Typography>
            <ModalButton onClick={() => handleDelete(entry)}>Delete</ModalButton>
          </PassBox>
        ))
      ) : (
        <PassBox>
          <Typography variant="subtitle1">
            All passwords are strong! No weak passwords found.
          </Typography>
        </PassBox>
      )}
    </Box>
  )
}