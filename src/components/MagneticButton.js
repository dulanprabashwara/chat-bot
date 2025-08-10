"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useAnimation } from "motion/react";

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

export default function MagneticButton({
  particleCount = 12,
  className = "",
  children,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  onFocus,
  onBlur,
  ...props
}) {
  const [isAttracting, setIsAttracting] = useState(false);
  const [particles, setParticles] = useState([]);
  const controls = useAnimation();

  useEffect(() => {
    const radius = 90;
    const pts = Array.from({ length: particleCount }, (_, i) => {
      const angle = randomInRange(0, Math.PI * 2);
      const r = randomInRange(radius * 0.4, radius);
      return { id: i, x: Math.cos(angle) * r, y: Math.sin(angle) * r };
    });
    setParticles(pts);
  }, [particleCount]);

  const startAttract = useCallback(async () => {
    setIsAttracting(true);
    await controls.start({
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 12 },
    });
  }, [controls]);

  const endAttract = useCallback(async () => {
    setIsAttracting(false);
    await controls.start((i) => ({
      x: particles[i]?.x ?? 0,
      y: particles[i]?.y ?? 0,
      transition: { type: "spring", stiffness: 120, damping: 16 },
    }));
  }, [controls, particles]);

  return (
    <button
      type="button"
      aria-busy={isAttracting}
      className={[
        "relative inline-flex items-center justify-center gap-2",
        "px-8 py-3 rounded-xl select-none touch-none",
        "bg-green-400 text-black font-semibold",
        "shadow-sm transition-colors duration-200",
        "hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={(e) => {
        startAttract();
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        endAttract();
        onMouseLeave?.(e);
      }}
      onTouchStart={(e) => {
        startAttract();
        onTouchStart?.(e);
      }}
      onTouchEnd={(e) => {
        endAttract();
        onTouchEnd?.(e);
      }}
      onFocus={(e) => {
        startAttract();
        onFocus?.(e);
      }}
      onBlur={(e) => {
        endAttract();
        onBlur?.(e);
      }}
      {...props}
    >
      {particles.map((p, index) => (
        <motion.div
          key={p.id}
          custom={index}
          initial={{ x: p.x, y: p.y, opacity: 0.5 }}
          animate={controls}
          style={{ pointerEvents: "none" }}
          className={[
            "absolute w-1.5 h-1.5 rounded-full",
            "bg-white/60",
            isAttracting ? "opacity-100" : "opacity-40",
            "transition-opacity duration-300",
          ].join(" ")}
        />
      ))}
      <span className="relative flex items-center gap-2 font-medium">
        {children ?? "Hover me"}
      </span>
    </button>
  );
}
