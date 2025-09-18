import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/user";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

export function generateToken(payload: {
  userId: number;
  email: string;
  username: string;
}): string {
  return jwt.sign(
    {
      sub: payload.userId.toString(),
      email: payload.email,
      username: payload.username,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function extractTokenFromHeader(
  authHeader: string | null
): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
