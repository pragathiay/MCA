import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { loginSchema } from "@/lib/validation";
import { error, handleError, ok } from "@/lib/api-response";
import { setSession } from "@/lib/auth";
export async function POST(req: Request) {
  try {
    const input = loginSchema.parse(await req.json());
    await connectDB();
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash)))
      return error("Invalid email or password", 401);
    const response = ok({
      user: { id: user.id, name: user.name, email: user.email },
    });
    setSession(response, user.id);
    return response;
  } catch (e) {
    return handleError(e);
  }
}
