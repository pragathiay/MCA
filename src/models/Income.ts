import mongoose, { Schema } from "mongoose";
import type { IncomeRecord } from "@/types/models";
const schema = new Schema<IncomeRecord>({ userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }, amount: { type: Number, required: true }, source: { type: String, required: true }, bankAccountId: { type: Schema.Types.ObjectId, ref: "BankAccount" }, category: { type: String, required: true }, description: String, date: { type: Date, required: true }, paymentMethod: String }, { timestamps: true });
schema.index({ userId: 1, date: -1 }); export default (mongoose.models.Income as mongoose.Model<IncomeRecord> | undefined) || mongoose.model<IncomeRecord>("Income", schema);
