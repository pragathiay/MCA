import mongoose, { Schema } from "mongoose";
import type { BudgetRecord } from "@/types/models";
const schema = new Schema<BudgetRecord>({ userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, name: String, amount: Number, category: String, month: Number, year: Number }, { timestamps: true });
schema.index({ userId: 1, month: 1, year: 1 }); export default (mongoose.models.Budget as mongoose.Model<BudgetRecord> | undefined) || mongoose.model<BudgetRecord>("Budget", schema);
