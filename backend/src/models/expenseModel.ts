import mongoose, { Document } from "mongoose";

export interface IExpense extends Document {
  amount: number;
  category: string;
  description?: string;
  date: Date;
  status: "pending" | "approved" | "rejected";
  createdBy: mongoose.Types.ObjectId;
}

const expenseSchema = new mongoose.Schema<IExpense>(
  {
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpense>("Expense", expenseSchema);
