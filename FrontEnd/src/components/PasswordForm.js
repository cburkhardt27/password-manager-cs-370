import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';

const PasswordForm = ({ initialData = {}, onSave }) => {
  const [formData, setFormData] = useState({
    id: initialData.id || uuidv4(), // Generate unique ID for new entries
    website: initialData.website || '',
    username: initialData.username || '',
    password: initialData.password || '',
    note: initialData.note || '',
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, borderRadius: '15px', backgroundColor: '#EEE' }}>
      <TextField
        label="Website"
        name="website"
        value={formData.website}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        type="password"
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Note"
        name="note"
        value={formData.note}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" sx={{ backgroundColor: '#5A83F2', color: '#FFFFFF' }}>
        Save
      </Button>
    </Box>
  );
};

export default PasswordForm;