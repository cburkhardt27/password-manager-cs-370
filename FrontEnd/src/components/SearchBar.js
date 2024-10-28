import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = ({ value, onChange }) => (
  <TextField
    variant="outlined"
    placeholder="Search passwords"
    value={value}
    onChange={onChange}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton>
            <Search />
          </IconButton>
        </InputAdornment>
      ),
    }}
    sx={{
      backgroundColor: '#FFFFFFCC',
      borderRadius: '50px',
      width: '50%',
    }}
  />
);

export default SearchBar;