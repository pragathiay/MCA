import Category from "@/models/Category";
import { categorySchema } from "@/lib/validation";
import { createRecord, listRecords } from "@/lib/crud";
import { error, handleError, ok } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
const defaults = [
  { name: "Food", type: "expense" },
  { name: "Transportation", type: "expense" },
  { name: "Shopping", type: "expense" },
  { name: "Entertainment", type: "expense" },
  { name: "Bills", type: "expense" },
  { name: "Healthcare", type: "expense" },
  { name: "Education", type: "expense" },
  { name: "Rent", type: "expense" },
  { name: "Other", type: "expense" },
  { name: "Salary", type: "income" },
  { name: "Freelance", type: "income" },
  { name: "Business", type: "income" },
  { name: "Interest", type: "income" },
  { name: "Investment", type: "income" },
  { name: "Gift", type: "income" },
];
export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    await connectDB();
    let categories = await Category.find({ userId: user._id }).lean();
    if (!categories.length) {
      await Category.insertMany(
        defaults.map((x) => ({ ...x, userId: user._id })),
      );
      categories = await Category.find({ userId: user._id }).lean();
    }
    return ok({ items: categories });
  } catch (e) {
    return e instanceof Error && e.message === "UNAUTHORIZED"
      ? error("Authentication required.", 401)
      : handleError(e);
  }
}
export async function POST(req: Request) {
  return createRecord(Category, categorySchema, req);
}
