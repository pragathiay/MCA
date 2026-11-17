import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri && process.env.NODE_ENV !== "test") console.warn("MONGODB_URI is not configured");

declare global { var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined; }
const cached = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB() {
  if (!uri) throw new Error("Database is not configured");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 }).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
