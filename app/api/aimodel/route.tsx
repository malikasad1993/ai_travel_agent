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

const FINAL_PROMPT = `
You are an AI travel planner. Return STRICT JSON ONLY (no markdown, no extra text).

HARD LIMITS (must follow):
- Hotels: return EXACTLY 3 hotels.
- Itinerary days: return EXACTLY the number of days mentioned by the user (if missing, default to 3).
- Activities per day: return EXACTLY 4 activities per day.
- Keep every string short: MAX 160 characters per string field.
- Do NOT include unescaped double quotes (") inside any string values.
- Do NOT use newline characters inside string values.
- If you are unsure of an exact value (e.g., ticket price), use "Varies".
- Geo coordinates MUST be numbers (latitude/longitude), never strings.
- Return valid JSON that can be parsed by JSON.parse().

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
- "itinerary" must include one object per day (day 1..N).
- Each day must include exactly 4 activities.
- "hotels" must include exactly 3 hotels.
- Output JSON only.
`.trim();

function safeJsonParse<T = any>(text: string): { ok: true; data: T } | { ok: false; error: string } {
  try {
    const data = JSON.parse(text);
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Invalid JSON" };
  }
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

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: isFinal ? FINAL_PROMPT : PROMPT },
        ...messages,
      ],
      temperature: 0.3,
      max_tokens: isFinal ? 2000 : 400,
      top_p: 1,
      presence_penalty: 0,
      frequency_penalty: 0,
    });

    const msg = completion.choices?.[0]?.message;
    const content = msg?.content ?? "";

    if (!content) {
      return NextResponse.json(
        { error: "EMPTY_MODEL_RESPONSE", resp: "Model returned empty response.", ui: "error" },
        { status: 502 }
      );
    }

    const parsed = safeJsonParse(content);

    if (!parsed.ok) {
      console.error("Model JSON parse failed:", parsed.error, "content:", content.slice(0, 300));
      return NextResponse.json(
        { error: "INVALID_MODEL_JSON", resp: "Model returned invalid JSON.", ui: "error" },
        { status: 502 }
      );
    }

    // ✅ In final mode we EXPECT trip_plan.
    // If model returns {resp, ui} incorrectly, convert it into a consistent error.
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
    console.error("aimodel error:", e?.message ?? e);
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
