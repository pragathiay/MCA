import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/lib/validation";
import { error, handleError, ok } from "@/lib/api-response";
import { setSession } from "@/lib/auth";
export async function POST(req: Request) {
  try {
    const input = registerSchema.parse(await req.json());
    await connectDB();
    const email = input.email.toLowerCase();
    if (await User.exists({ email }))
      return error("An account with that email already exists.", 409);
    const user = await User.create({
      name: input.name,
      email,
      passwordHash: await bcrypt.hash(input.password, 12),
    });
    const response = ok(
      { user: { id: user.id, name: user.name, email: user.email } },
      201,
    );
    setSession(response, user.id);
    return response;
  } catch (e) {
    return handleError(e);
  }
}
