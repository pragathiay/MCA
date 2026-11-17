import { getCurrentUser } from "@/lib/auth";
import { error, handleError, ok } from "@/lib/api-response";
export async function GET() {
  try {
    const user = await getCurrentUser();
    return user ? ok({ user }) : error("Authentication required.", 401);
  } catch (e) {
    return handleError(e);
  }
}
