import Image from "next/image";
import { Button } from "@/components/ui/button"
import Hero from "./_components/Hero";
import { PopularCityList } from "./_components/PopularCityList";

export default function Home() {
  return (
    <div>
      <Hero/>
      <PopularCityList/>
    </div>
  );
}
