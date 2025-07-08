import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import API from "../../services/api";
import axios from "axios";

// Separated form input type add expense
export interface NewExpenseInput {
  amount: number;
  category: string;
  description: string;
  date: string;
}


export interface Expense extends NewExpenseInput {
  _id: string;
  status: "pending" | "approved" | "rejected";
  createdBy: string;
}

//Response types
interface ExpenseResponse {
  message: string;
  expense: Expense;
}
interface FetchExpensesResponse {
  message: string;
  expenses: Expense[];
}

//State type
interface ExpenseState {
  loading: boolean;
  error: string | null;
  expenses: Expense[];
}

//Initial state
const initialState: ExpenseState = {
  loading: false,
  error: null,
  expenses: [],
};

//Add Expense Thunk — now expects only form input type
export const addExpense = createAsyncThunk<
  ExpenseResponse,
  NewExpenseInput,
  { rejectValue: string }
>("expenses/addExpense", async (expenseData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await API.post("/expenses/addExpense", expenseData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "API Error");
    }
    return rejectWithValue("Something went wrong");
  }
});

//Fetch Expenses
export const fetchExpenses = createAsyncThunk<
  FetchExpensesResponse,
  void,
  { rejectValue: string }
>("expenses/fetchExpenses", async (_, { rejectWithValue }) => { //action
  try {
    const token = localStorage.getItem("token");
    const response = await API.get("/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "API Error");
    }
    return rejectWithValue("Something went wrong");
  }
});

//Update Expense Status
export const updateExpenseStatus = createAsyncThunk<
  { message: string; updatedExpense: Expense },
  { id: string; status: "approved" | "rejected" },
  { rejectValue: string }
>("expenses/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await API.patch(
      `/expenses/update-status/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return {
      message: response.data.message,
      updatedExpense: response.data.updatedExpense,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "API Error");
    }
    return rejectWithValue("Something went wrong");
  }
});



//Slice
const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Add Expense
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(
        addExpense.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to add expense";
        }
      )
      

      // Fetch Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.expenses;
      })
      .addCase(
        fetchExpenses.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to fetch expenses";
        }
      )

      // Update Status
      .addCase(updateExpenseStatus.fulfilled, (state, action) => {
        const updated = action.payload.updatedExpense;
        const index = state.expenses.findIndex((e) => e._id === updated._id);
        if (index !== -1) {
          state.expenses[index] = updated;
        }
      });
  },
});

export default expenseSlice.reducer;
