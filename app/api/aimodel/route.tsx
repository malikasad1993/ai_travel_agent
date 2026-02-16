import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { aj } from "../arcjet/route";
import { auth, currentUser } from "@clerk/nextjs/server";

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PROMPT = `
You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.
Ask questions in this exact order, one at a time, waiting for the user before the next:
1. Starting location (source)
2. Destination city or country
3. Group size (Solo, Couple, Family, Friends)
4. Budget (Low, Medium, High)
5. Trip duration (number of days)
6. Preferences (adventure, sightseeing, cultural, food, nightlife, relaxation, include everything)
7. Special requirements (if any)

Do not ask multiple questions at once.
Along with the response also send which UI component to display for generative UI:
'budget' | 'groupSize' | 'TripDuration' | 'Preference' | 'Final'

Return STRICT JSON ONLY:
{
  "resp": "Text response",
  "ui": "budget/groupSize/TripDuration/Preference/Final"
}
`.trim();

// ✅ Tightened to reduce JSON breakage + reduce token bloat
const FINAL_PROMPT = `
You are an AI travel planner. Return STRICT JSON ONLY (no markdown, no extra text).
Return VALID JSON that can be parsed by JSON.parse().

HARD LIMITS (must follow):
- Output must contain ONLY the keys shown in the schema. No extra keys anywhere.
- Hotels: return EXACTLY 3 hotels.
- Itinerary days: return EXACTLY N day objects where N = duration in days from the conversation (if missing/unclear, default N=3).
- Activities per day: return EXACTLY 4 activities per day.
- Keep every string short: MAX 120 characters per string field (shorter is better).
- DO NOT include unescaped double quotes (") inside any string values. Avoid quotes inside strings completely.
- Do NOT use newline characters in string values.
- If unsure of any value (ticket price, exact travel time, exact URL), use "Varies".
- Geo coordinates MUST be numbers (latitude/longitude), never strings, never null.

DURATION FORMAT:
- Set trip_plan.duration to a numeric string like "3" or "5" (NOT "5 Days").

IMAGE URL RULE:
- If you do not know a real image URL, set hotel_image_url/place_image_url to "Varies".

Output JSON schema (follow exactly, include all keys):
{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "preference": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": { "latitude": 0, "longitude": 0 },
        "rating": 0,
        "description": "string"
      },
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": { "latitude": 0, "longitude": 0 },
        "rating": 0,
        "description": "string"
      },
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": { "latitude": 0, "longitude": 0 },
        "rating": 0,
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": { "latitude": 0, "longitude": 0 },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          },
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": { "latitude": 0, "longitude": 0 },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          },
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": { "latitude": 0, "longitude": 0 },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          },
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": { "latitude": 0, "longitude": 0 },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}

IMPORTANT:
- The "itinerary" array MUST include one object per day (day 1..N).
- Each day must include exactly 4 activities.
- The "hotels" array must include exactly 3 hotels.
- Output JSON only.
`.trim();

function safeJsonParse<T = any>(
  text: string
): { ok: true; data: T } | { ok: false; error: string } {
  try {
    const data = JSON.parse(text);
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Invalid JSON" };
  }
}

async function repairJsonWithModel(badText: string) {
  const FIX_PROMPT = `
You are a JSON repair tool.
Return VALID JSON ONLY. No markdown. No comments.
Fix the provided content into valid JSON.

Rules:
- Keep the same schema and keys.
- Remove or escape any unescaped double quotes inside strings.
- Remove newline characters inside string values.
- Ensure every string is properly closed.
- Ensure arrays and objects are properly closed.
- Do not add any extra keys.
Output JSON only.
`.trim();

  const fix = await openai.chat.completions.create({
    model: "openai/gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: FIX_PROMPT },
      { role: "user", content: badText },
    ],
    temperature: 0.1,
    max_tokens: 1200,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  });

  return fix.choices?.[0]?.message?.content ?? "";
}

function extractStatus(e: any): number | undefined {
  return e?.status ?? e?.response?.status ?? e?.cause?.status;
}

function extractMessage(e: any): string {
  return (
    e?.response?.data?.error?.message ||
    e?.response?.data?.message ||
    e?.message ||
    "Unknown error"
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages = body?.messages ?? [];
  const isFinal = Boolean(body?.isFinal);

  // ✅ Clerk
  const user = await currentUser();
  const { has } = await auth();
  const hasPremiumAccess = has({ plan: "monthly" });

  const userId = user?.primaryEmailAddress?.emailAddress ?? "anonymous";

  // ✅ Arcjet: charge 1 token per step, 5 for final (adjust as you like)
  const tokensToCharge = isFinal ? 5 : 1;

  const decision = await aj.protect(req, { userId, requested: tokensToCharge });
  console.log("Has Premium Access?:", hasPremiumAccess);
  console.log("Arcjet conclusion:", decision.conclusion);

  // ✅ If denied and not premium -> return 429 cleanly
  if (decision.isDenied() && !hasPremiumAccess) {
    return NextResponse.json(
      {
        resp: "You’ve hit the free limit for today. Try again tomorrow or upgrade to Premium.",
        ui: "limit",
        error: "RATE_LIMITED",
      },
      { status: 429 }
    );
  }

  // ✅ Keep token usage safer (final can still be big)
  const maxTokens = isFinal ? 1800 : 400;

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: isFinal ? FINAL_PROMPT : PROMPT },
        ...messages,
      ],
      temperature: isFinal ? 0.15 : 0.3,
      max_tokens: isFinal ? 6000: 60,
      top_p: 1,
      presence_penalty: 0,
      frequency_penalty: 0,
    });

    const content = completion.choices?.[0]?.message?.content ?? "";

    if (!content) {
      return NextResponse.json(
        {
          error: "EMPTY_MODEL_RESPONSE",
          resp: "Model returned empty response.",
          ui: "error",
        },
        { status: 502 }
      );
    }

    // ✅ Parse attempt #1
    const parsed = safeJsonParse(content);

    if (!parsed.ok) {
      console.error(
        "Model JSON parse failed:",
        parsed.error,
        "content (start):",
        content.slice(0, 400)
      );

      // ✅ Repair attempt (one retry)
      const repairedText = await repairJsonWithModel(content);
      const repaired = safeJsonParse(repairedText);

      if (!repaired.ok) {
        console.error(
          "Repair failed:",
          repaired.error,
          "repaired (start):",
          repairedText.slice(0, 400)
        );
        return NextResponse.json(
          {
            error: "INVALID_MODEL_JSON",
            resp: "Model returned invalid JSON (repair failed).",
            ui: "error",
          },
          { status: 502 }
        );
      }

      // ✅ Final mode must include trip_plan
      if (isFinal && !repaired.data?.trip_plan) {
        return NextResponse.json(
          {
            error: "FINAL_MISSING_TRIP_PLAN",
            resp: "Final plan generation failed. Please try again.",
            ui: "error",
          },
          { status: 502 }
        );
      }

      return NextResponse.json(repaired.data);
    }

    // ✅ Final mode must include trip_plan
    if (isFinal && !parsed.data?.trip_plan) {
      return NextResponse.json(
        {
          error: "FINAL_MISSING_TRIP_PLAN",
          resp: "Final plan generation failed. Please try again.",
          ui: "error",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (e: any) {
    const status = extractStatus(e);
    const msg = extractMessage(e);

    // ✅ OpenRouter credit issue -> map to 402
    if (status === 402 || msg.includes("requires more credits")) {
      return NextResponse.json(
        {
          error: "OPENROUTER_CREDITS_LOW",
          resp: "OpenRouter credits are low. Reduce duration or add credits in OpenRouter.",
          ui: "credits",
          details: msg,
        },
        { status: 402 }
      );
    }

    console.error("aimodel error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
