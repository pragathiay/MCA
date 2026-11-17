import Expense from "@/models/Expense";
import { expenseSchema } from "@/lib/validation";
import { deleteRecord, getRecord, updateRecord } from "@/lib/crud";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return getRecord(Expense, (await params).id);
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return updateRecord(Expense, expenseSchema, req, (await params).id);
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return deleteRecord(Expense, req, (await params).id);
}
