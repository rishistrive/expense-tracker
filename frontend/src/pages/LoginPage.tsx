import { Box, Button, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "../redux/slices/authSlice";
import { useSnackbar } from "notistack";
import API from "../services/api";
import CustomTextField from "../components/common/CustomTextField";
import CustomButton from "../components/common/CustomButton";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async () => {
    let hasError = false;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      

      dispatch(login(res.data.user));
      enqueueSnackbar("Login successful", { variant: "success" });
      navigate("/dashboard");
    } catch (error) {
      enqueueSnackbar("Login failed. Check credentials", { variant: "error" });
      console.error(error);
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
          Login
        </Typography>

        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <CustomTextField
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(emailError)}
            helperText={emailError}
          />

          <CustomTextField
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(passwordError)}
            helperText={passwordError}
            isPassword
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword((prev) => !prev)}
          />

          <CustomButton
            label="  Login"
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              bgcolor: "#1e88e5",
              color: "#fff",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#1565c0",
              },
            }}
          ></CustomButton>

          <Typography variant="body2" align="center" mt={2}>
            Don't have an account?{" "}
            <Button
              onClick={() => navigate("/")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#1e88e5",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Signup Now
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
