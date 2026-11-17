import Income from "@/models/Income";
import { incomeSchema } from "@/lib/validation";
import { createRecord, listRecords } from "@/lib/crud";
import { error, handleError } from "@/lib/api-response";
export async function GET(req: Request) {
  try {
    return await listRecords(Income, req);
  } catch (e) {
    return e instanceof Error && e.message === "UNAUTHORIZED"
      ? error("Authentication required.", 401)
      : handleError(e);
  }
}
export async function POST(req: Request) {
  return createRecord(Income, incomeSchema, req);
}
