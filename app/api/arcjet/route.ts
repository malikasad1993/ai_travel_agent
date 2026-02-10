import arcjet, { tokenBucket } from "@arcjet/next";
import { NextResponse } from "next/server";

const isDev = process.env.NODE_ENV !== "production";

export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: isDev ? "DRY_RUN" : "LIVE", // ✅ don't block yourself in dev
      characteristics: ["userId"],
      refillRate: 5,     // ✅ refill 5 tokens per interval
      interval: 86400,   // ✅ interval is in seconds -> 86400 = 24 hours
      capacity: 5,       // ✅ max tokens stored
    }),
  ],
});

export async function GET(req: Request) {
  const userId = "user123";
  const decision = await aj.protect(req, { userId, requested: 1 });
  console.log("Arcjet decision", decision);

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too Many Requests", reason: decision.reason },
      { status: 429 }
    );
  }

  return NextResponse.json({ message: "Hello world" });
}
