import mongoose, { Schema } from "mongoose";
import type { BankAccountRecord } from "@/types/models";
const schema = new Schema<BankAccountRecord>({ userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }, name: { type: String, required: true }, accountType: { type: String, default: "Savings" }, lastDigits: String, openingBalance: { type: Number, default: 0 } }, { timestamps: true });
export default (mongoose.models.BankAccount as mongoose.Model<BankAccountRecord> | undefined) || mongoose.model<BankAccountRecord>("BankAccount", schema);
