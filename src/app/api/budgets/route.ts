import Budget from "@/models/Budget";
import Expense from "@/models/Expense";
import { budgetSchema } from "@/lib/validation";
import { createRecord, listRecords } from "@/lib/crud";
import { error, handleError, ok } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
export async function GET(req: Request) {
  try {
    const response = await listRecords(Budget, req);
    const body = await response.json();
    const user = await requireAuth();
    await connectDB();
    const month = Number(
      new URL(req.url).searchParams.get("month") || new Date().getMonth() + 1,
    );
    const year = Number(
      new URL(req.url).searchParams.get("year") || new Date().getFullYear(),
    );
    const budgets = await Budget.find({ userId: user._id, month, year }).lean();
    const start = new Date(year, month - 1, 1),
      end = new Date(year, month, 1);
    const expenses = await Expense.find({
      userId: user._id,
      date: { $gte: start, $lt: end },
    }).lean();
    const items = budgets.map((b) => {
      const actual = expenses
        .filter((e) => !b.category || e.category === b.category)
        .reduce((s, e) => s + e.amount, 0);
      return {
        ...b,
        allocatedAmount: b.amount,
        actualSpending: actual,
        remainingAmount: b.amount - actual,
        percentageUsed: b.amount ? (actual / b.amount) * 100 : 0,
      };
    });
    return ok({ ...body.data, items });
  } catch (e) {
    return e instanceof Error && e.message === "UNAUTHORIZED"
      ? error("Authentication required.", 401)
      : handleError(e);
  }
}
export async function POST(req: Request) {
  return createRecord(Budget, budgetSchema, req);
}
