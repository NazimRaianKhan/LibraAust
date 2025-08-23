// components/inputs/PasswordField.jsx
import { useState } from 'react';
import { IconButton, InputAdornment, TextField as MuiTextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useField } from 'formik';

const PasswordField = ({ name, label, ...otherProps }) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const configTextField = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: 'outlined',
    label: label,
    type: showPassword ? 'text' : 'password',
    error: !!(meta.touched && meta.error),
    helperText: meta.touched && meta.error ? meta.error : ' ',
    InputProps: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    },
  };

  return <MuiTextField {...configTextField} />;
};

export default PasswordField;