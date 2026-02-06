import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const placeName = body?.placeName;

    if (!placeName || typeof placeName !== "string") {
      return NextResponse.json(
        { error: "placeName is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY; // IMPORTANT: server env
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GOOGLE_API_KEY. Add it to .env.local and restart dev server." },
        { status: 500 }
      );
    }

    const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

    const googleRes = await axios.post(
      BASE_URL,
      { textQuery: placeName },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          // ask for only what you need
          "X-Goog-FieldMask": "places.id,places.displayName,places.photos",
        },
        timeout: 15000,
      }
    );

    const place = googleRes?.data?.places?.[0];
    const photoName = place?.photos?.[0]?.name;

    if (!place) {
      return NextResponse.json({ error: "No places found" }, { status: 404 });
    }

    let photoUrl: string | null = null;

    if (photoName) {
      photoUrl =
        `https://places.googleapis.com/v1/${photoName}/media` +
        `?maxHeightPx=1000&maxWidthPx=1000&key=${apiKey}`;
    }

    return NextResponse.json(photoUrl)
  } catch (err: any) {
    // ✅ show the real upstream error
    const status = err?.response?.status ?? 500;
    const data = err?.response?.data ?? { message: err?.message ?? "Unknown error" };

    console.error("Google Places error:", status, data);

    return NextResponse.json(
      {
        error: "Google Places request failed",
        status,
        data,
      },
      { status }
    );
  }
}
