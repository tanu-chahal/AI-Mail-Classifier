import { styled } from '@mui/material/styles';
import TextFieldMUI from '@mui/material/TextField';

const TextField = styled(TextFieldMUI)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: theme.palette.primary.main, // Label color
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.main, // Border color
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main, // Border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main, // Border color on focus
    },
    '& .MuiOutlinedInput-input': {
      color: theme.palette.primary.main, // Input text color
    },
  },
}));

export default TextField;
