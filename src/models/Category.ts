import mongoose, { Schema } from "mongoose";
import type { CategoryRecord } from "@/types/models";
const schema = new Schema<CategoryRecord>({ userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, name: { type: String, required: true }, type: { type: String, enum: ["income", "expense"], required: true } }, { timestamps: true });
export default (mongoose.models.Category as mongoose.Model<CategoryRecord> | undefined) || mongoose.model<CategoryRecord>("Category", schema);
