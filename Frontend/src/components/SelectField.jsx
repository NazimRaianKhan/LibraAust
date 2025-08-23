// components/inputs/SelectField.jsx
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useField } from 'formik';

const SelectField = ({ name, label, options, ...otherProps }) => {
  const [field, meta] = useField(name);

  const configSelect = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: 'outlined',
    error: !!(meta.touched && meta.error),
  };

  return (
    <FormControl fullWidth error={!!(meta.touched && meta.error)}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        id={name}
        label={label}
        {...configSelect}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{meta.touched && meta.error ? meta.error : ' '}</FormHelperText>
    </FormControl>
  );
};

export default SelectField;