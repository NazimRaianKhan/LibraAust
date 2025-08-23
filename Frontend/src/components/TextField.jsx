// components/inputs/TextField.jsx
import { TextField as MuiTextField } from '@mui/material';
import { useField } from 'formik';

const TextField = ({ name, label, type = 'text', ...otherProps }) => {
  const [field, meta] = useField(name);

  const configTextField = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: 'outlined',
    label: label,
    type: type,
    error: !!(meta.touched && meta.error),
    helperText: meta.touched && meta.error ? meta.error : ' ',
  };

  return <MuiTextField {...configTextField} />;
};

export default TextField;