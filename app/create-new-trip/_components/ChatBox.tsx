"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import EmptyBoxState from "./EmptyBoxState";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import TripDurationUi from "./TripDurationUi";
import FinalUi from "./FinalUi";
import PreferenceUi from "./PreferenceUi";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTripDetail, useUserDetail } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";

type Message = {
  role: "user" | "assistant";
  content: string;
  ui?: string;
};

export type TripInfo = {
  budget: string;
  destination: string;
  duration: string;
  group_size: string;
  hotels: Hotel[];
  itinerary: Itinerary[];
  origin: string;
  preference: string;
};

export type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  hotel_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  description: string;
};

export type Activity = {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
};

export type Itinerary = {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: Activity[];
};

function logAnyError(prefix: string, err: unknown) {
  // ✅ This avoids the dev overlay showing "{}"
  if (axios.isAxiosError(err)) {
    console.error(prefix, {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    return;
  }

  if (err instanceof Error) {
    console.error(prefix, { message: err.message, stack: err.stack });
    return;
  }

  try {
    console.error(prefix, JSON.stringify(err));
  } catch {
    console.error(prefix, String(err));
  }
}

function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);

  const { userDetail } = useUserDetail();
  const { setTripDetailInfo } = useTripDetail();

  // ✅ store final plan here
  const [tripPlan, setTripPlan] = useState<TripInfo>();

  // ✅ store trip plan in convex:
  const SaveTripDetail = useMutation(api.tripPlan.CreateTripDetail);

  // ✅ keep latest messages to avoid stale state bugs
  const messagesRef = useRef<Message[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // ✅ keep latest flags to avoid stale closure in useEffect
  const isFinalRef = useRef(false);
  useEffect(() => {
    isFinalRef.current = isFinal;
  }, [isFinal]);

  const tripPlanRef = useRef<TripInfo | undefined>(undefined);
  useEffect(() => {
    tripPlanRef.current = tripPlan;
  }, [tripPlan]);

  // ✅ prevent duplicate final generation calls
  const finalRequestInFlightRef = useRef(false);

  // ✅ auto-scroll
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string, finalFlag: boolean) => {
    const trimmed = text?.trim();
    if (!trimmed) return;

    // Prevent overlapping requests (helps a LOT in dev mode)
    if (loading) return;

    setLoading(true);

    const newMessage: Message = { role: "user", content: trimmed };

    // optimistic UI update
    const nextMessages = [...messagesRef.current, newMessage];
    setMessages(nextMessages);
    messagesRef.current = nextMessages;

    try {
      const result = await axios.post("/api/aimodel", {
        messages: nextMessages,
        isFinal: finalFlag,
      });

      // ✅ FINAL response: { trip_plan: {...} }
      if (finalFlag && result.data?.trip_plan) {
        const plan: TripInfo = result.data.trip_plan;

        setTripPlan(plan);
        setTripDetailInfo(plan);

        // Only save if we have a valid uid
        const uid = userDetail?._id;
        if (uid) {
          const _tripId = uuidv4();
          await SaveTripDetail({
            tripDetail: plan,
            tripId: _tripId,
            uid,
          });
        } else {
          console.warn("Skipping SaveTripDetail: userDetail._id is not ready yet.");
        }

        // ✅ show final UI message
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "✅ Your trip plan is ready!",
            ui: "Final",
          },
        ]);

        return;
      }

      // ✅ Normal step response: { resp, ui }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result?.data?.resp ?? "",
          ui: result?.data?.ui,
        },
      ]);
    } catch (err: unknown) {
      logAnyError("sendMessage failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry — something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSend = async () => {
    if (loading) return;
    const text = userInput;
    setUserInput("");
    await sendMessage(text, isFinal);
  };

  const RenderGenerativeUi = (ui: string) => {
    switch (ui) {
      case "budget":
        return <BudgetUi onSelectedOption={(v: string) => sendMessage(v, isFinal)} />;
      case "groupSize":
        return <GroupSizeUi onSelectedOption={(v: string) => sendMessage(v, isFinal)} />;
      case "TripDuration":
        return <TripDurationUi onSelectedOption={(v: string) => sendMessage(v, isFinal)} />;
      case "Preference":
        return <PreferenceUi onSelectedOption={(v: string) => sendMessage(v, isFinal)} />;
      case "Final":
        return (
          <FinalUi
            tripPlan={tripPlan}
            viewTrip={() => console.log(tripPlan)}
            disable={!tripPlan}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg) return;

    // ✅ when agent says Final, trigger final generation ONCE
    const shouldTriggerFinal =
      lastMsg.role === "assistant" &&
      lastMsg.ui === "Final" &&
      !isFinalRef.current &&
      !tripPlanRef.current &&
      !finalRequestInFlightRef.current;

    if (shouldTriggerFinal) {
      finalRequestInFlightRef.current = true;
      setIsFinal(true);

      // fire and release the lock when done
      sendMessage("Generate the final trip plan now.", true).finally(() => {
        finalRequestInFlightRef.current = false;
      });
    }
  }, [messages]); // ✅ safe because we use refs

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  return (
    <div
      className="
        flex flex-col border shadow bg-secondary rounded-2xl
        p-4 sm:p-6 lg:p-10
        h-[calc(100vh-140px)] md:h-[85vh]
        overflow-hidden
      "
    >
      {!hasMessages && (
        <div className="mb-3">
          <EmptyBoxState onSelectOption={(v: string) => sendMessage(v, isFinal)} />
        </div>
      )}

      {/* Display Messages */}
      <section className="flex-1 overflow-y-auto px-1 sm:px-2 py-3">
        {messages.map((msg: Message, index) =>
          msg.role === "user" ? (
            <div className="flex justify-end mt-2" key={index}>
              <div className="max-w-[85%] sm:max-w-lg bg-primary text-white px-4 py-2 rounded-2xl break-words">
                {msg.content}
              </div>
            </div>
          ) : (
            <div className="flex justify-start mt-2" key={index}>
              <div className="max-w-[85%] sm:max-w-lg bg-background text-foreground px-4 py-2 rounded-2xl break-words">
                {msg.content}
                {RenderGenerativeUi(msg.ui ?? "")}
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="flex justify-start mt-2">
            <div className="max-w-[85%] sm:max-w-lg bg-background text-foreground px-4 py-2 rounded-2xl">
              <Loader className="animate-spin" />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </section>

      {/* User Input */}
      <section className="pt-2">
        <div className="border rounded-2xl p-3 sm:p-4 shadow relative bg-background">
          <Textarea
            className="w-full h-24 sm:h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none pr-12"
            placeholder="Start typing here!"
            onChange={(event) => setUserInput(event.target.value ?? "")}
            value={userInput}
          />

          <Button
            onClick={onSend}
            size="icon"
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 cursor-pointer"
            disabled={loading}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Chatbox;
