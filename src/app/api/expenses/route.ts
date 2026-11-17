import Expense from "@/models/Expense";
import { expenseSchema } from "@/lib/validation";
import { createRecord, listRecords } from "@/lib/crud";
import { error, handleError } from "@/lib/api-response";
export async function GET(req: Request) {
  try {
    return await listRecords(Expense, req);
  } catch (e) {
    return e instanceof Error && e.message === "UNAUTHORIZED"
      ? error("Authentication required.", 401)
      : handleError(e);
  }
}
export async function POST(req: Request) {
  return createRecord(Expense, expenseSchema, req);
}
