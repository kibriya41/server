import jwt from "jsonwebtoken";

export function generateToken(userId: string) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { userId },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions
  );
}