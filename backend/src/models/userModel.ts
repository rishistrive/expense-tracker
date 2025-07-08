import mongoose, { Document, Schema } from "mongoose";

// Interface
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  confirmPassword: string;
  role: "employee" | "admin";
}

// Schema
const userSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  role: { type: String, enum: ["employee", "admin"], default: "employee" },
});

export const User = mongoose.model<IUser>("User", userSchema);
