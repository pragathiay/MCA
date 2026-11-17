import mongoose, { Schema } from "mongoose";
import type { ExpenseRecord } from "@/types/models";
const schema = new Schema<ExpenseRecord>({ userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }, amount: { type: Number, required: true }, category: { type: String, required: true }, merchant: { type: String, required: true }, bankAccountId: { type: Schema.Types.ObjectId, ref: "BankAccount" }, description: String, date: { type: Date, required: true }, paymentMethod: String, receiptUrl: String }, { timestamps: true });
schema.index({ userId: 1, date: -1 }); export default (mongoose.models.Expense as mongoose.Model<ExpenseRecord> | undefined) || mongoose.model<ExpenseRecord>("Expense", schema);
