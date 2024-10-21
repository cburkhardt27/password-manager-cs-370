import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',  // A blue color for primary
    },
    secondary: {
      main: '#dc004e',  // A pinkish-red color for secondary
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',  // Default Material UI font
  },
});

export default theme;
