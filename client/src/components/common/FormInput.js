import React from 'react';
import { TextField } from '@mui/material';

const FormInput = ({ name, label, type = 'text', value, onChange, error, ...props }) => {
  return (
    <TextField
      fullWidth
      margin="normal"
      variant="outlined"
      name={name}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
      {...props}
    />
  );
};

export default FormInput; 
