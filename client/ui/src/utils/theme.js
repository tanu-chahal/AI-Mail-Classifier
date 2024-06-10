import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#c1dcdc',
    },
    secondary: {
      main: '#8f8f8f',
    },
    tertiary:{
      main: '#484c4c',
    },
    general:{
      first: "white",
      second: "#1f1f1f",
    }
  },
  typography: {
    fontFamily: '"Montserrat", Arial, sans-serif',
    h6: {
      fontSize: '19px',
      fontWeight: 500
    },
    subtitle1: {
      fontSize: '17px',
      fontWeight: 800
    },
    subtitle2: {
      fontSize: '17px',
    },
    subtitle3: {
      fontSize: '13px',
      fontFamily: '"Montserrat", Arial, sans-serif',
      fontWeight: 500,
    }
  },
  
});

export default theme;