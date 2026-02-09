"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function PopularCityList() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <section className="w-full py-10 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans leading-tight">
          Best Travel Destinations
        </h2>

        {/* Prevent carousel overflow on mobile */}
        <div className="mt-6 sm:mt-10 overflow-hidden">
          <Carousel items={cards} />
        </div>
      </div>
    </section>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(true)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-5 sm:p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                Lorem, ipsum.
              </span>{" "}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
              consequuntur quis rem, similique culpa vel blanditiis? Perferendis
              cumque odio magnam quis incidunt aut voluptatem. Doloribus neque
              minus dolor. Repudiandae, unde!
            </p>

            <img
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="mt-6 w-full max-w-[320px] sm:max-w-[420px] md:max-w-[520px] h-auto mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Paris, France",
    title: "Explore the city of Lights, Eiffel Tower, NightLife and amazing food",
    src: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Mafushi, Maldives",
    title: "Explore the islands of Maldives with your lovedone and enjoy beautiful beaches",
    src: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "London, UK",
    title: "Explore the historical and magical city of London",
    src: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Bali, Indonesia",
    title: "Bali is one of the most visited place in the world.",
    src: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Skardu, Pakistan",
    title: "Skardu is one of the most beautiful place in Pakistan.",
    src: "https://images.unsplash.com/photo-1679951124125-50cc4029d727?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Cairo, Egypt",
    title: "Cairo is the home of the Pyramids and amazing history",
    src: "https://plus.unsplash.com/premium_photo-1664303467567-17891a27998a?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
];
