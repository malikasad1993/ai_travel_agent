import arcjet, { tokenBucket } from "@arcjet/next";
import { NextResponse } from "next/server";

const isDev = process.env.NODE_ENV !== "production";

// ✅ Tune these safely without code changes
const REFILL_RATE = Number(process.env.ARCJET_REFILL_RATE ?? "60");   // tokens per interval
const INTERVAL = Number(process.env.ARCJET_INTERVAL ?? "86400");      // seconds
const CAPACITY = Number(process.env.ARCJET_CAPACITY ?? "60");         // bucket max

export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: isDev ? "DRY_RUN" : "LIVE",
      characteristics: ["userId"],
      refillRate: REFILL_RATE,
      interval: INTERVAL,
      capacity: CAPACITY,
    }),
  ],
});

export async function GET(req: Request) {
  const userId = "user123";
  const decision = await aj.protect(req, { userId, requested: 1 });

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too Many Requests" },
      { status: 429 }
    );
  }

  return NextResponse.json({
    message: "Hello world",
    mode: isDev ? "DRY_RUN" : "LIVE",
    limits: { REFILL_RATE, INTERVAL, CAPACITY },
  });
}
