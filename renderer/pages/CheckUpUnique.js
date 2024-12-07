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

export default function CheckUpUnique() {
  const [nonUniquePasswords, setNonUniquePasswords] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNonUniquePasswords = async () => {
      try {
        const fetchedData = await window.ipc.invoke('get_repeated_passwords')
        setNonUniquePasswords(fetchedData || [])
      } catch (error) {
        console.error('Error fetching non-unique passwords:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNonUniquePasswords()
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
          Password Uniqueness Checkup
        </Typography>
      </PassBox>
      {isLoading ? (
        <PassBox>
          <Typography variant="subtitle1">Checking password uniqueness...</Typography>
        </PassBox>
      ) : nonUniquePasswords.length > 0 ? (
        nonUniquePasswords.map((entry) => (
          <PassBox key={entry.id}>
            <Typography variant="subtitle1">Username: {entry.username}</Typography>
            <Typography variant="subtitle1">Website: {entry.url}</Typography>
            <Typography variant="body1">
              This password is reused on multiple accounts.
            </Typography>
            <ModalButton onClick={() => handleDelete(entry)}>Delete</ModalButton>
          </PassBox>
        ))
      ) : (
        <PassBox>
          <Typography variant="subtitle1">
            All passwords are unique! No reused passwords found.
          </Typography>
        </PassBox>
      )}
    </Box>
  )
}
