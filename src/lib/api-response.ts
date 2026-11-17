import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const ok = (data: unknown, status = 200) => NextResponse.json({ success: true, data }, { status });
export const error = (message: string, status = 400) => NextResponse.json({ success: false, message }, { status });
export function handleError(err: unknown) {
  if (err instanceof ZodError) return error("Please check the submitted fields.", 422);
  if (err instanceof Error && (err.name === "MongooseServerSelectionError" || err.message.includes("ECONNREFUSED"))) return error("Database is unavailable. Start MongoDB or check MONGODB_URI in .env.local.", 503);
  console.error(err);
  return error("Something went wrong. Please try again.", 500);
}
