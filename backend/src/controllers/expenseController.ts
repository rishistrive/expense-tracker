import { Response, NextFunction, Request } from "express";
import { Expense } from "../models/expenseModel";
import { AuthenticatedRequest } from "../types";


//Add Expense
export const createExpense = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { amount, category, description, date } = req.body;

    if (!amount || !category || !date) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const expense = await Expense.create({
      amount,
      category,
      description,
      date,
      createdBy: req.user?._id,
    });

    res.status(201).json({ message: "Expense created", expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};



//Get Expenses (role-based)
export const getExpenses = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let filter = {};

    if (user.role === "employee") {
      filter = { createdBy: user._id };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    res.status(200).json({ expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};




//Approve/Reject Expense (admin only)
export const approveExpense = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ message: "Forbidden: Only admin can update status" });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedExpense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.status(200).json({ message: "Status updated", updatedExpense });
  } catch (error) {
    console.error("Error in approveExpense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



//Analytics by category
export const getAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics = await Expense.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({ message: "Analytics fetched", analytics });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Analytics error" });
  }
};
