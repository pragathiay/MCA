import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Income from "@/models/Income";
import Expense from "@/models/Expense";
import Budget from "@/models/Budget";
import { error, handleError, ok } from "@/lib/api-response";
export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    await connectDB();
    const url = new URL(req.url);
    const year = new Date().getFullYear();
    const fromParam = url.searchParams.get("from");
    const toParam = url.searchParams.get("to");
    const from = fromParam ? new Date(fromParam) : new Date(Date.UTC(year, 0, 1));
    // End of the chosen day (or year), so records dated on the last day are included.
    const to = toParam
      ? new Date(new Date(toParam).getTime() + 24 * 60 * 60 * 1000 - 1)
      : new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
    const [income, expenses, budgets] = await Promise.all([
      Income.find({ userId: user._id, date: { $gte: from, $lte: to } }).lean(),
      Expense.find({ userId: user._id, date: { $gte: from, $lte: to } }).lean(),
      Budget.find({ userId: user._id }).lean(),
    ]);
    const month = (date: Date) => date.toISOString().slice(0, 7);
    const months = Array.from(
      new Set(
        [...income, ...expenses].map((x) => month(new Date(x.date))),
      ),
    ).sort();
    const monthly = months.map((m) => ({
      month: m,
      income: income
        .filter((x) => month(new Date(x.date)) === m)
        .reduce((s, x) => s + x.amount, 0),
      expenses: expenses
        .filter((x) => month(new Date(x.date)) === m)
        .reduce((s, x) => s + x.amount, 0),
    }));
    const byCategory = Array.from(
      new Set(expenses.map((x) => x.category)),
    ).map((category) => ({
      category,
      amount: expenses
        .filter((x) => x.category === category)
        .reduce((s, x) => s + x.amount, 0),
    }));
    // Chart series: income/expenses, the budget set for each month, and savings,
    // which is calculated (income - expenses for that month, never below zero) rather than entered.
    const key = (y: number, m: number) => `${y}-${String(m).padStart(2, "0")}`;
    const fromKey = from.toISOString().slice(0, 7);
    const toKey = to.toISOString().slice(0, 7);
    const budgetByMonth = new Map<string, number>();
    for (const b of budgets) {
      const k = key(b.year, b.month);
      if (k >= fromKey && k <= toKey) budgetByMonth.set(k, (budgetByMonth.get(k) || 0) + (b.amount || 0));
    }
    const chartMonths = Array.from(new Set([...months, ...budgetByMonth.keys()])).sort();
    const chart = chartMonths.map((m) => {
      const row = monthly.find((x) => x.month === m);
      const inc = row?.income || 0, exp = row?.expenses || 0;
      return { month: m, income: inc, expenses: exp, budget: budgetByMonth.get(m) || 0, savings: Math.max(0, inc - exp) };
    });
    return ok({
      chart,
      monthly,
      incomeVsExpenses: monthly,
      categoryWiseExpenses: byCategory,
      spendingTrends: monthly,
    });
  } catch (e) {
    return e instanceof Error && e.message === "UNAUTHORIZED"
      ? error("Authentication required.", 401)
      : handleError(e);
  }
}
