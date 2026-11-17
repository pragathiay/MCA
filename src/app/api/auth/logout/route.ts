import { clearSession } from "@/lib/auth";
import { ok } from "@/lib/api-response";
export async function POST() {
  const response = ok(null);
  clearSession(response);
  return response;
}
