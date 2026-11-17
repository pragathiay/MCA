import type { Model } from "mongoose";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { error, handleError, ok } from "@/lib/api-response";
type QueryFilter = Record<string, unknown> & { $or?: Array<Record<string, unknown>> };
type ParsedSchema<T extends object> = { parse(value: unknown): T; partial(): ParsedSchema<Partial<T>> };

export async function listRecords<T extends object>(Model: Model<T>, request: Request, extra: QueryFilter = {}) {
  const user = await requireAuth(); await connectDB();
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 20)));
  const q = url.searchParams.get("search")?.trim();
  const filter: QueryFilter = { userId: user._id, ...extra };
  if (q) filter.$or = [{ name: { $regex: q, $options: "i" } }, { category: { $regex: q, $options: "i" } }, { merchant: { $regex: q, $options: "i" } }, { source: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }];
  const [items, total] = await Promise.all([Model.find(filter as never).sort({ date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Model.countDocuments(filter as never)]);
  return ok({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function createRecord<T extends object, I extends object>(Model: Model<T>, schema: ParsedSchema<I>, request: Request) {
  try { const user = await requireAuth(); const input = schema.parse(await request.json()); await connectDB(); return ok({ item: await Model.create({ ...input, userId: user._id }) }, 201); }
  catch (e) { return e instanceof Error && e.message === "UNAUTHORIZED" ? error("Authentication required.", 401) : handleError(e); }
}
export async function updateRecord<T extends object, I extends object>(Model: Model<T>, schema: ParsedSchema<I>, request: Request, id: string) {
  try { const user = await requireAuth(); const input = schema.partial().parse(await request.json()); await connectDB(); const item = await Model.findOneAndUpdate({ _id: id, userId: user._id } as never, input as never, { new: true, runValidators: true }).lean(); return item ? ok({ item }) : error("Record not found.", 404); }
  catch (e) { return e instanceof Error && e.message === "UNAUTHORIZED" ? error("Authentication required.", 401) : handleError(e); }
}
export async function deleteRecord<T extends object>(Model: Model<T>, _request: Request, id: string) {
  try { const user = await requireAuth(); await connectDB(); const item = await Model.findOneAndDelete({ _id: id, userId: user._id } as never); return item ? ok(null) : error("Record not found.", 404); }
  catch (e) { return e instanceof Error && e.message === "UNAUTHORIZED" ? error("Authentication required.", 401) : handleError(e); }
}
export async function getRecord<T extends object>(Model: Model<T>, id: string) {
  try { const user = await requireAuth(); await connectDB(); const item = await Model.findOne({ _id: id, userId: user._id } as never).lean(); return item ? ok({ item }) : error("Record not found.", 404); }
  catch (e) { return e instanceof Error && e.message === "UNAUTHORIZED" ? error("Authentication required.", 401) : handleError(e); }
}
