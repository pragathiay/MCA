import Budget from "@/models/Budget";
import { budgetSchema } from "@/lib/validation";
import { deleteRecord, getRecord, updateRecord } from "@/lib/crud";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return getRecord(Budget, (await params).id);
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return updateRecord(Budget, budgetSchema, req, (await params).id);
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return deleteRecord(Budget, req, (await params).id);
}
