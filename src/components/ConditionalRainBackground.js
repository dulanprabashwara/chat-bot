"use client";

import { usePathname } from "next/navigation";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { StarsBackground } from "@/components/stars-background";
import { ShootingStars } from "@/components/shooting-stars";

export default function ConditionalRainBackground({ children }) {
  const pathname = usePathname();

  // Don't show any animations on chat pages
  const isChattingPage = pathname.startsWith("/chat/");

  if (isChattingPage) {
    return <>{children}</>;
  }

  // Add stars, shooting stars, and rain to all other pages
  return (
    <div className="relative">
      <StarsBackground
        starDensity={0.0003}
        allStarsTwinkle={true}
        twinkleProbability={0.8}
        minTwinkleSpeed={0.5}
        maxTwinkleSpeed={1.5}
        className="absolute inset-0 z-0"
      />
      <ShootingStars
        minSpeed={15}
        maxSpeed={35}
        minDelay={800}
        maxDelay={3000}
        starColor="#22c55e"
        trailColor="#10b981"
        starWidth={12}
        starHeight={2}
        className="absolute inset-0 z-0"
      />
      <BackgroundBeamsWithCollision className="relative z-10">
        {children}
      </BackgroundBeamsWithCollision>
    </div>
  );
}
