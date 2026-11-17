import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Income from "@/models/Income";
import Expense from "@/models/Expense";
import Budget from "@/models/Budget";
import SavingsGoal from "@/models/SavingsGoal";
import { error, handleError, ok } from "@/lib/api-response";
export async function GET() {
  try {
    const user = await requireAuth();
    await connectDB();
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const [income, expenses, budgets, goals, recentIncome, recentExpenses, prevIncome, prevExpenses] =
      await Promise.all([
        Income.find({ userId: user._id, date: { $gte: start } }).lean(),
        Expense.find({ userId: user._id, date: { $gte: start } }).lean(),
        Budget.find({
          userId: user._id,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        }).lean(),
        SavingsGoal.find({ userId: user._id }).lean(),
        Income.find({ userId: user._id }).sort({ date: -1 }).limit(5).lean(),
        Expense.find({ userId: user._id }).sort({ date: -1 }).limit(5).lean(),
        Income.find({ userId: user._id, date: { $gte: prevStart, $lt: start } }).lean(),
        Expense.find({ userId: user._id, date: { $gte: prevStart, $lt: start } }).lean(),
      ]);
    const sum = (list: { amount: number }[]) => list.reduce((s, x) => s + x.amount, 0);
    // Percent change vs last month; null when last month has nothing to compare against.
    const pct = (now: number, prev: number) =>
      prev ? Math.round(((now - prev) / Math.abs(prev)) * 100) : null;
    const totalIncome = income.reduce((s, x) => s + x.amount, 0),
      totalExpenses = expenses.reduce((s, x) => s + x.amount, 0),
      monthlyBudget = budgets.reduce((s, x) => s + (x.amount || 0), 0),
      budgetUsed = totalExpenses;
    const recentTransactions = [
      ...recentIncome.map((x) => ({
        ...x,
        type: "income",
        label: x.source,
      })),
      ...recentExpenses.map((x) => ({
        ...x,
        type: "expense",
        label: x.merchant,
      })),
    ]
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .slice(0, 10);
    return ok({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      changes: {
        income: pct(totalIncome, sum(prevIncome)),
        expenses: pct(totalExpenses, sum(prevExpenses)),
        balance: pct(totalIncome - totalExpenses, sum(prevIncome) - sum(prevExpenses)),
      },
      totalSavings: goals.reduce((s, x) => s + (x.currentAmount || 0), 0),
      monthlyBudget,
      budgetUsed,
      budgetRemaining: monthlyBudget - budgetUsed,
      budgetPercentage: monthlyBudget ? (budgetUsed / monthlyBudget) * 100 : 0,
      savingsGoals: goals.map((x) => ({
        ...x,
        progressPercentage: x.targetAmount ? Math.min(100, ((x.currentAmount || 0) / x.targetAmount) * 100) : 0,
      })),
      recentTransactions,
      cashFlow: { income: totalIncome, expenses: totalExpenses },
    });
  } catch (e) {
    return e instanceof Error && e.message === "UNAUTHORIZED"
      ? error("Authentication required.", 401)
      : handleError(e);
  }
}
