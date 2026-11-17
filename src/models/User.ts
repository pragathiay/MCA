import mongoose, { Schema } from "mongoose";
import type { UserRecord } from "@/types/models";
const schema = new Schema<UserRecord>({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, index: true }, passwordHash: { type: String, required: true } }, { timestamps: true });
export default (mongoose.models.User as mongoose.Model<UserRecord> | undefined) || mongoose.model<UserRecord>("User", schema);
