
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ee', 
    },
    secondary: {
      main: '#03dac6', 
    },
    background: {
      default: '#f5f5f5', 
    },
    error: {
      main: '#b00020',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 12, // Consistent border radius from your design
  },
});

export default theme;