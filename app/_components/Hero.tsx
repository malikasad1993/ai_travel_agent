"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Globe2, Landmark, Plane, Send } from "lucide-react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import thumbnail from "@/public/thumbnail.jpg";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const suggestions = [
  {
    title: "Create a New Trip",
    icon: <Globe2 className="text-blue-400 h-5 w-5 shrink-0" />,
  },
  {
    title: "Inspire me where to go",
    icon: <Plane className="text-orange-500 h-5 w-5 shrink-0" />,
  },
  {
    title: "Discover Hidden Gems",
    icon: <Landmark className="text-green-500 h-5 w-5 shrink-0" />,
  },
  {
    title: "Adventure Destination",
    icon: <Globe2 className="text-yellow-600 h-5 w-5 shrink-0" />,
  },
];

function Hero() {
  const { user } = useUser();
  const router = useRouter();

  const onSend = () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    router.push("/create-new-trip");
  };

  return (
    <section className="w-full flex justify-center px-4 sm:px-6 pt-10 sm:pt-14">
      <div className="w-full max-w-3xl text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
          Hey, I am your personal <br />
          <span className="text-primary">Travel Agent</span>
        </h1>

        <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
          Let me know what&apos;s in your bucket list, and I&apos;ll show you the magic🪄
          <br />
          Flights, Hotels, Trip planning - all in just a wind!
        </p>

        {/* Input Box */}
        <div className="w-full">
          <div className="border rounded-2xl p-3 sm:p-4 shadow relative">
            <Textarea
              className="w-full h-28 sm:h-32 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none pr-12"
              placeholder="E.g: Create a trip from Paris to Newyork"
            />

            <Button
              onClick={onSend}
              size="icon"
              className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 cursor-pointer"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Suggestion Cards */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="
                flex items-center gap-2
                border rounded-full
                px-3 py-2
                cursor-pointer
                hover:bg-primary hover:text-secondary
                transition-colors
                w-full sm:w-auto
                justify-center
              "
            >
              {suggestion.icon}
              <h2 className="text-sm sm:text-[14px] whitespace-normal sm:whitespace-nowrap">
                {suggestion.title}
              </h2>
            </div>
          ))}
        </div>

        <h2 className="text-base sm:text-lg text-center">
          See Our travel video to get inspire!!⬇️
        </h2>

        {/* Video Section */}
        <div className="w-full">
          <HeroVideoDialog
            className="block dark:hidden w-full"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/exI_hD_4jAM?si=ituR5LPoa_4HMd3v"
            thumbnailSrc={thumbnail.src}
            thumbnailAlt="Dummy Video"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
