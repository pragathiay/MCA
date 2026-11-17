import BankAccount from "@/models/BankAccount";
import Income from "@/models/Income";
import Expense from "@/models/Expense";
import { bankAccountSchema } from "@/lib/validation";
import { createRecord } from "@/lib/crud";
import { error, handleError, ok } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
export async function GET() {
  try {
    const user = await requireAuth();
    await connectDB();
    const [accounts, inc, exp] = await Promise.all([
      BankAccount.find({ userId: user._id }).sort({ createdAt: 1 }).lean(),
      Income.aggregate([{ $match: { userId: user._id, bankAccountId: { $ne: null } } }, { $group: { _id: "$bankAccountId", total: { $sum: "$amount" } } }]),
      Expense.aggregate([{ $match: { userId: user._id, bankAccountId: { $ne: null } } }, { $group: { _id: "$bankAccountId", total: { $sum: "$amount" } } }]),
    ]);
    const totals = (rows: { _id: unknown; total: number }[]) => new Map(rows.map((r) => [String(r._id), r.total]));
    const i = totals(inc), x = totals(exp);
    return ok({ items: accounts.map((a) => ({ ...a, balance: (a.openingBalance || 0) + (i.get(String(a._id)) || 0) - (x.get(String(a._id)) || 0) })) });
  } catch (e) {
    return e instanceof Error && e.message === "UNAUTHORIZED" ? error("Authentication required.", 401) : handleError(e);
  }
}
export async function POST(req: Request) {
  return createRecord(BankAccount, bankAccountSchema, req);
}
