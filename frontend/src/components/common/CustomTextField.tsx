
import React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  TextFieldProps,
  styled,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface CustomTextFieldProps extends Omit<TextFieldProps, 'type'> {
   type?: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  isPassword?: boolean;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  isPassword = false,
  showPassword,
  toggleShowPassword,
  ...rest
}) => {
  return (
    <StyledTextField
      className="rounded-lg"
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      fullWidth
      error={error}
      helperText={helperText}
      type={isPassword && showPassword !== undefined ? (showPassword ? "text" : "password") : "text"}
      InputProps={{
        endAdornment: isPassword ? (
          <InputAdornment position="end">
            <IconButton onClick={toggleShowPassword} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
      {...rest}
    />
  );
};

export default CustomTextField;

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "18px",
  },
});
