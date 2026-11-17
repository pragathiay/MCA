import Income from "@/models/Income";
import { incomeSchema } from "@/lib/validation";
import { deleteRecord, getRecord, updateRecord } from "@/lib/crud";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return getRecord(Income, (await params).id);
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return updateRecord(Income, incomeSchema, req, (await params).id);
}
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return deleteRecord(Income, _, (await params).id);
}
