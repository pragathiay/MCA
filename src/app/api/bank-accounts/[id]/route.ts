import BankAccount from "@/models/BankAccount";
import Income from "@/models/Income";
import Expense from "@/models/Expense";
import { bankAccountSchema } from "@/lib/validation";
import { deleteRecord, updateRecord } from "@/lib/crud";
import { error, handleError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return updateRecord(BankAccount, bankAccountSchema, req, (await params).id);
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    await connectDB();
    const id = (await params).id;
    const used = (await Income.countDocuments({ userId: user._id, bankAccountId: id })) + (await Expense.countDocuments({ userId: user._id, bankAccountId: id }));
    if (used) return error("This account has income or expenses linked to it, so it can't be deleted.", 409);
    return deleteRecord(BankAccount, req, id);
  } catch (e) {
    return e instanceof Error && e.message === "UNAUTHORIZED" ? error("Authentication required.", 401) : handleError(e);
  }
}
