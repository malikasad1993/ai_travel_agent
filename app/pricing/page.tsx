"use client";

import { PricingTable } from "@clerk/nextjs";

function Pricing() {
  return (
    <main className="w-full">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-10">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center leading-tight">
          Pick Your 🤖AI ✈️Travel Agent Plans
        </h2>

        <p className="mt-3 text-sm sm:text-base text-center text-muted-foreground">
          Choose a plan that fits your travel style — upgrade anytime.
        </p>

        <div className="mt-6 sm:mt-10">
          <div className="mx-auto max-w-4xl rounded-3xl border bg-background p-4 sm:p-6 shadow-sm">
            <PricingTable />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Pricing;
