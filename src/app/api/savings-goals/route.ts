import SavingsGoal from "@/models/SavingsGoal";
import { goalSchema } from "@/lib/validation";
import { createRecord, listRecords } from "@/lib/crud";
import { error, handleError } from "@/lib/api-response";
export async function GET(req: Request) {
  try {
    const response = await listRecords(SavingsGoal, req);
    const body = await response.json();
    body.data.items = body.data.items.map((x: { targetAmount: number; currentAmount: number }) => ({
      ...x,
      progressPercentage: x.targetAmount
        ? (x.currentAmount / x.targetAmount) * 100
        : 0,
    }));
    return Response.json(body);
  } catch (e) {
    return e instanceof Error && e.message === "UNAUTHORIZED"
      ? error("Authentication required.", 401)
      : handleError(e);
  }
}
export async function POST(req: Request) {
  return createRecord(SavingsGoal, goalSchema, req);
}
