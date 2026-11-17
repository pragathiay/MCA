import { cookies } from "next/headers";
import crypto from "node:crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const COOKIE = "budgetpulse_session";
const secret = () => process.env.AUTH_SECRET || "development-only-secret-change-me";
const sign = (value: string) => crypto.createHmac("sha256", secret()).update(value).digest("hex");
export function createToken(userId: string) { const payload = `${userId}.${Date.now() + 1000 * 60 * 60 * 24 * 7}`; return `${payload}.${sign(payload)}`; }
function verifyToken(token?: string) { if (!token) return null; const [id, expiry, signature] = token.split("."); const payload = `${id}.${expiry}`; const expected = sign(payload); if (!id || !expiry || !signature || signature.length !== expected.length || Number(expiry) < Date.now() || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null; return id; }
export async function getCurrentUser() { const id = verifyToken((await cookies()).get(COOKIE)?.value); if (!id) return null; await connectDB(); return User.findById(id).select("-passwordHash").lean(); }
export async function requireAuth() { const user = await getCurrentUser(); if (!user) throw new Error("UNAUTHORIZED"); return user; }
export function setSession(response: Response, userId: string) { response.headers.append("Set-Cookie", `${COOKIE}=${createToken(userId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${process.env.NODE_ENV === "production" ? "; Secure" : ""}`); }
export function clearSession(response: Response) { response.headers.append("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`); }
