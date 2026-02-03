import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY
})

const PROMPT = `You are an Al Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.
Only ask questions about the following details in order, and wait for the user's answer before asking the next:
1. Starting location (source)
2. Destination city or country
3. Group size (Solo, Couple, Family, Friends)
4. Budget (Low, Medium, High)
5. Trip duration (number of days)
6. Preferences (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation, include everything)
7. Special requirements or preferences (if any)
Do not ask multiple questions at once, and never ask irrelevant questions
If any answer is missing or unclear, politely ask the user to clarify before proceeding.
Always maintain a conversational, interactive style while asking questions.
Along wth response also send which ui component to display for generative UI for example 'budget/groupSize/TripDuration/Preference/Final) , where Final means Al generating complete final output.
Once all required information is collected, generate and return a strict JSON response only (no explanations or extra text) with following JSON schema:
{
resp:'Text Resp'
ui:'budget/groupSize/TripDuration/Preference/Final)'
}`.trim();

const FINAL_PROMPT = `
You are an AI travel planner. Return STRICT JSON ONLY (no markdown, no extra text).

HARD LIMITS (must follow):
- Hotels: return EXACTLY 3 hotels.
- Itinerary days: return EXACTLY the number of days mentioned by the user (if missing, default to 3).
- Activities per day: return EXACTLY 4 activities per day.
- Keep every string short: MAX 160 characters per string field.
- Do NOT include unescaped double quotes (") inside any string values.
- Do NOT use newline characters inside string values.
- If you are unsure of an exact value (e.g., ticket price), use "Varies" (as a string).
- Geo coordinates MUST be numbers (latitude/longitude), never strings.
- Return valid JSON that can be parsed by JSON.parse().

Generate a detailed travel plan using the user's provided details from the conversation:
- origin
- destination
- group_size
- budget
- duration (days)
- preference

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
- The "itinerary" array must include one object per day (day 1..N).
- Each day must include exactly 4 activities.
- The "hotels" array must include exactly 3 hotels.
- Output JSON only.
`.trim();


export async function POST (req: NextRequest) {
  const { messages, isFinal } = await req.json()

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4.1-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: isFinal ? FINAL_PROMPT : PROMPT
        },
        ...messages
      ],
      temperature: 0.3, // lower = more controlled & structured
      max_tokens: isFinal ? 6000 : 600,

      // optional but recommended
      top_p: 1,
      presence_penalty: 0,
      frequency_penalty: 0
    })
    console.log(completion.choices[0].message)
    const message = completion.choices[0].message

    return NextResponse.json(JSON.parse(message.content ?? ''))
  } 
  catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Unknown error' },
      { status: 500 }
    )
  }
}
