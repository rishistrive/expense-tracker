import { Button, MenuItem, Box, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../redux/store";
import { addExpense } from "../redux/slices/expenseSlice";
import { useSnackbar } from "notistack";
import CustomButton from "./common/CustomButton";
import CustomTextField from "./common/CustomTextField";

const AddExpenseForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const [errors, setErrors] = useState({
    amount: false,
    category: false,
    date: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    
    if (e.target.name in errors) {
      setErrors((prev) => ({ ...prev, [e.target.name]: false }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {
      amount: !form.amount,
      category: !form.category,
      date: !form.date,
    };

    if (newErrors.amount || newErrors.category || newErrors.date) {
      setErrors(newErrors);
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
      return;
    }

    dispatch(
      addExpense({
        ...form,
        amount: Number(form.amount),
      })
    );

    enqueueSnackbar("Expense created successfully", { variant: "success" });

    setForm({ amount: "", category: "", description: "", date: "" });
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
          Add Expense
        </Typography>

        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <CustomTextField
            name="amount"
            label="Amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            error={!!errors.amount}
            helperText={errors.amount ? "Amount is required" : undefined}
            fullWidth
          />

          <CustomTextField
            name="category"
            label="Category"
            select
            value={form.category}
            onChange={handleChange}
            error={!!errors.category}
            helperText={errors.category ? "Category is required" : undefined}
            fullWidth
          >
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Travel">Travel</MenuItem>
            <MenuItem value="Office">Office</MenuItem>
          </CustomTextField>

          <CustomTextField
            name="description"
            label="Description"
            value={form.description}
            onChange={handleChange}
            fullWidth
          />

          <CustomTextField
            name="date"
            label="Date"
            type="date"
            value={form.date}
            onChange={handleChange}
            error={!!errors.date}
            helperText={errors.date ? "Date is required" : undefined}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <CustomButton
            label="submit"
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
          >
            Submit
          </CustomButton>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/dashboard")}
            sx={{
              color: "#1e88e5",
              borderColor: "#1e88e5",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#1565c0",
                color: "#1565c0",
              },
              borderRadius: "18px",
            }}
          >
            Go To Dashbord
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddExpenseForm;
