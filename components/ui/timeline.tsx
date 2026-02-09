"use client";

import { useScroll, useTransform, motion } from "motion/react";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { TripInfo } from "../../app/create-new-trip/_components/ChatBox";
import { Calendar, Users2, Wallet } from "lucide-react";

interface TimelineEntry {
  title: string;
  content: ReactNode;
}

export const Timeline = ({
  data,
  tripData,
}: {
  data: TimelineEntry[];
  tripData: TripInfo;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // ✅ Recalculate height when content changes + on resize
  useEffect(() => {
    const calc = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [data?.length]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans"
      ref={containerRef}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-10">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-black dark:text-white leading-tight max-w-4xl">
          Your Trip Plan from{" "}
          <strong className="text-primary">{tripData.origin} </strong> to{" "}
          <strong className="text-primary">{tripData.destination}</strong> is
          Ready!
        </h2>

        {/* ✅ Mobile-friendly summary chips */}
        <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 text-sm sm:text-base">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Duration {tripData.duration} days</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
            <Wallet className="h-4 w-4 text-primary" />
            <span>Budget {tripData.budget}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
            <Users2 className="h-4 w-4 text-primary" />
            <span>{tripData.group_size} Person</span>
          </div>
        </div>
      </div>

      {/* Timeline Body */}
      <div ref={ref} className="relative max-w-7xl mx-auto pb-16 px-4 sm:px-6 lg:px-10">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row md:items-start md:gap-10 pt-8 md:pt-10"
          >
            {/* Left timeline label */}
            <div className="md:sticky md:top-40 md:self-start md:w-[40%] z-40">
              {/* Dot */}
              <div className="relative">
                <div className="hidden md:flex h-10 w-10 rounded-full bg-white dark:bg-black items-center justify-center border">
                  <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
                </div>
              </div>

              {/* Desktop title */}
              <h3 className="hidden md:block mt-4 text-lg font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>

              {/* Mobile title */}
              <h3 className="md:hidden text-lg font-bold text-neutral-700 dark:text-neutral-300">
                {item.title}
              </h3>
            </div>

            {/* Right content */}
            <div className="w-full mt-3 md:mt-0 md:w-[60%]">
              {item.content}
            </div>
          </div>
        ))}

        {/* Vertical line (desktop only) */}
        <div
          style={{ height: height + "px" }}
          className="hidden md:block absolute left-[28px] top-0 overflow-hidden w-[2px]
            bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))]
            from-transparent from-[0%] via-neutral-200 dark:via-neutral-700
            to-transparent to-[99%]
            [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]
          "
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px]
              bg-gradient-to-t from-purple-500 via-blue-500 to-transparent
              from-[0%] via-[10%] rounded-full
            "
          />
        </div>
      </div>
    </div>
  );
};
