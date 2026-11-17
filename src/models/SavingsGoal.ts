import mongoose, { Schema } from "mongoose";
import type { SavingsGoalRecord } from "@/types/models";
const schema = new Schema<SavingsGoalRecord>({ userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }, name: String, targetAmount: Number, currentAmount: Number, targetDate: Date, description: String }, { timestamps: true });
export default (mongoose.models.SavingsGoal as mongoose.Model<SavingsGoalRecord> | undefined) || mongoose.model<SavingsGoalRecord>("SavingsGoal", schema);
