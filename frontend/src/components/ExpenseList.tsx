import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../redux/store";
import {
  fetchExpenses,
  updateExpenseStatus,
} from "../redux/slices/expenseSlice";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomButton from "./common/CustomButton";

const categories = ["Food", "Travel", "Office"];

export default function ExpenseList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { expenses, loading, error } = useSelector(
    (s: RootState) => s.expenses
  );

  // Get role from Redux, not from localStorage
  const role = localStorage.getItem("role");

  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const normalize = (d: string) => new Date(d).toISOString().split("T")[0];

  const filtered = expenses
    .filter((e) => (categoryFilter ? e.category === categoryFilter : true))
    .filter((e) => (dateFilter ? normalize(e.date) === dateFilter : true))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleStatusChange = (id: string, status: "approved" | "rejected") => {
    dispatch(updateExpenseStatus({ id, status })).then(() => {
      dispatch(fetchExpenses());
    });
  };

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg,hsl(246, 79.90%, 48.80%),hsla(330, 71.20%, 42.20%, 0.53),hsl(310, 38.90%, 28.20%))",
        minHeight: "100vh",
        py: 6,
        px: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 2,
          borderRadius: 4,
          maxWidth: "100%",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.92)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
        }}
      >
        <Stack spacing={3}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight={600}>
              Your Expenses
            </Typography>
            {role !== "admin" && (
              <CustomButton
                label="Add Expense"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/add-expense")}
                sx={{
                  color: "white",
                  bgcolor: "#1e88e5",
                  "&:hover": { bgcolor: "#1565c0" },
                }}
              />
            )}
          </Box>

          {/* Filters */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              background: "rgba(245, 245, 245, 0.9)",
              borderRadius: 2,
            }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Category"
                select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
            </Stack>
          </Paper>

          {/* Table */}
          {loading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Category</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Amount</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Description</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>

                    {/* Admin-only Action column  */}

                    {role === "admin" && (
                      <TableCell>
                        <strong>Action</strong>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={role === "admin" ? 6 : 5}
                        align="center"
                      >
                        No expenses found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((exp, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{exp.category}</TableCell>
                        <TableCell>{exp.amount}</TableCell>
                        <TableCell>
                          {new Date(exp.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{exp.description || "—"}</TableCell>
                        <TableCell>{exp.status}</TableCell>

                       
                        {role === "admin" && (
                          <TableCell>
                            {exp.status === "pending" ? (
                              <Stack direction="row" spacing={1}>
                                <Button
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                  onClick={() =>
                                    handleStatusChange(exp._id, "approved")
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  onClick={() =>
                                    handleStatusChange(exp._id, "rejected")
                                  }
                                >
                                  Reject
                                </Button>
                              </Stack>
                            ) : (
                              "Completed"
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
