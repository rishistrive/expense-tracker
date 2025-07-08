import {
  Box,
  Button,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../services/api";
import CustomTextField from "../components/common/CustomTextField";
import CustomButton from "../components/common/CustomButton";


export default function SignupPage() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleRoleChange = (
    _: React.MouseEvent<HTMLElement>,
    newRole: string
  ) => {
    if (newRole !== null) {
      setForm((prev) => ({ ...prev, role: newRole }));
    }
  };

  const handleSubmit = async () => {
    let hasError = false;
    const newErrors = { email: "", password: "", confirmPassword: "" };

    if (!form.email) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
      hasError = true;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      hasError = true;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
    
      return;
    }

    try {
      await API.post("/auth/signup", form);
      enqueueSnackbar("Signup successfully!", { variant: "success" });

      //Reset form fields
      setForm({
        email: "",
        password: "",
        confirmPassword: "",
        role: "employee",
      });

      //Redirect to login after Signup
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message || "Signup failed. Please try again.";
        enqueueSnackbar(message, { variant: "error" });
      } else {
        enqueueSnackbar("An unexpected error occurred.", { variant: "error" });
      }
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background:
          "linear-gradient(135deg,hsl(246, 79.90%, 48.80%),hsla(330, 71.20%, 42.20%, 0.53),hsl(310, 38.90%, 28.20%))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          borderRadius: 4,
          width: "100%",
          maxWidth: 500,
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
          color: "#111",
          transition: "0.3s ease",
          "&:hover": {
            transform: "scale(1.01)",
            boxShadow: "0 16px 32px rgba(0,0,0,0.4)",
          },
        }}
      >
        <Typography variant="h5" fontWeight={600} align="center" gutterBottom>
          Signup
        </Typography>

        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <CustomTextField
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        error={Boolean(errors.email)}
        helperText={errors.email}
      />

      <CustomTextField
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        error={Boolean(errors.password)}
        helperText={errors.password}
        isPassword
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword((prev) => !prev)}
      />

      <CustomTextField
        label="Confirm Password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword}
        isPassword
        showPassword={showConfirmPassword}
        toggleShowPassword={() => setShowConfirmPassword((prev) => !prev)}
      />

          <ToggleButtonGroup
            value={form.role}
            exclusive
            onChange={handleRoleChange}
            fullWidth
          >
            <ToggleButton value="employee">Employee</ToggleButton>
            <ToggleButton value="admin">Admin</ToggleButton>
          </ToggleButtonGroup>

          <CustomButton
          label=" Signup"
            variant="contained"
            onClick={handleSubmit}
            size="large"
            sx={{
              bgcolor: "#1e88e5",
              color: "#fff",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#1565c0",
              },
            }}
          >
           
          </CustomButton>

          <Typography variant="body2" align="center" mt={2}>
            Already have an account?{" "}
            <Button
              onClick={() => navigate("/login")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#1e88e5",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Login Now
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
