import express from "express";
import {
  createExpense,
  getExpenses,
  approveExpense,
  getAnalytics,
} from "../controllers/expenseController";
import { isAuth } from "../middlewares/isAuth";

const router = express.Router();

//Add expense (POST)
router.post("/addExpense", isAuth, createExpense);

//Get expenses (GET)
router.get("/", isAuth, getExpenses);

router.patch("/update-status/:id", isAuth, approveExpense); 


// — Analytics endpoint —
router.get("/analytics", isAuth, getAnalytics);

export default router;
