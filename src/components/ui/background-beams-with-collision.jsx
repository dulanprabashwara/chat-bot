"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import React, { useRef, useState, useEffect } from "react";

export const BackgroundBeamsWithCollision = ({ children, className }) => {
  const containerRef = useRef(null);
  const parentRef = useRef(null);

  const beams = [
    // Left side beams
    {
      initialX: "5%",
      translateX: 0,
      duration: 7,
      repeatDelay: 3,
      delay: 0,
    },
    {
      initialX: "10%",
      translateX: 0,
      duration: 5,
      repeatDelay: 2,
      delay: 1,
      className: "h-8",
    },
    {
      initialX: "15%",
      translateX: 0,
      duration: 6,
      repeatDelay: 4,
      delay: 3,
      className: "h-6",
    },
    {
      initialX: "20%",
      translateX: 0,
      duration: 8,
      repeatDelay: 1,
      delay: 2,
      className: "h-12",
    },
    // Center-left beams
    {
      initialX: "25%",
      translateX: 0,
      duration: 4,
      repeatDelay: 3,
      delay: 0.5,
      className: "h-10",
    },
    {
      initialX: "30%",
      translateX: 0,
      duration: 7,
      repeatDelay: 2,
      delay: 4,
    },
    {
      initialX: "35%",
      translateX: 0,
      duration: 5,
      repeatDelay: 5,
      delay: 1.5,
      className: "h-6",
    },
    {
      initialX: "40%",
      translateX: 0,
      duration: 6,
      repeatDelay: 3,
      delay: 3.5,
      className: "h-8",
    },
    // Center beams
    {
      initialX: "45%",
      translateX: 0,
      duration: 8,
      repeatDelay: 2,
      delay: 2.5,
      className: "h-16",
    },
    {
      initialX: "50%",
      translateX: 0,
      duration: 5,
      repeatDelay: 4,
      delay: 1,
    },
    {
      initialX: "55%",
      translateX: 0,
      duration: 7,
      repeatDelay: 1,
      delay: 4.5,
      className: "h-12",
    },
    // Center-right beams
    {
      initialX: "60%",
      translateX: 0,
      duration: 6,
      repeatDelay: 3,
      delay: 0.8,
      className: "h-8",
    },
    {
      initialX: "65%",
      translateX: 0,
      duration: 4,
      repeatDelay: 2,
      delay: 3.2,
      className: "h-6",
    },
    {
      initialX: "70%",
      translateX: 0,
      duration: 8,
      repeatDelay: 4,
      delay: 1.8,
      className: "h-10",
    },
    {
      initialX: "75%",
      translateX: 0,
      duration: 5,
      repeatDelay: 1,
      delay: 4.2,
    },
    // Right side beams
    {
      initialX: "80%",
      translateX: 0,
      duration: 7,
      repeatDelay: 3,
      delay: 2.2,
      className: "h-12",
    },
    {
      initialX: "85%",
      translateX: 0,
      duration: 6,
      repeatDelay: 2,
      delay: 0.3,
      className: "h-8",
    },
    {
      initialX: "90%",
      translateX: 0,
      duration: 4,
      repeatDelay: 4,
      delay: 3.8,
      className: "h-6",
    },
    {
      initialX: "95%",
      translateX: 0,
      duration: 8,
      repeatDelay: 1,
      delay: 1.3,
      className: "h-14",
    },
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "relative w-full overflow-hidden",
        // h-screen if you want bigger
        className
      )}
    >
      {beams.map((beam) => (
        <CollisionMechanism
          key={beam.initialX + "beam-idx"}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}
      {children}
      <div
        ref={containerRef}
        className="fixed bottom-0 left-0 right-0 bg-transparent w-full pointer-events-none h-4 z-0"
      ></div>
    </div>
  );
};

const CollisionMechanism = React.forwardRef(
  ({ parentRef, containerRef, beamOptions = {} }, ref) => {
    const beamRef = useRef(null);
    const [collision, setCollision] = useState({
      detected: false,
      coordinates: null,
    });
    const [beamKey, setBeamKey] = useState(0);
    const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

    useEffect(() => {
      const checkCollision = () => {
        if (
          beamRef.current &&
          containerRef.current &&
          parentRef.current &&
          !cycleCollisionDetected
        ) {
          const beamRect = beamRef.current.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          const parentRect = parentRef.current.getBoundingClientRect();

          if (beamRect.bottom >= containerRect.top) {
            const relativeX =
              beamRect.left - parentRect.left + beamRect.width / 2;
            const relativeY = beamRect.bottom - parentRect.top;

            setCollision({
              detected: true,
              coordinates: {
                x: relativeX,
                y: relativeY,
              },
            });
            setCycleCollisionDetected(true);
          }
        }
      };

      const animationInterval = setInterval(checkCollision, 50);

      return () => clearInterval(animationInterval);
    }, [cycleCollisionDetected, containerRef]);

    useEffect(() => {
      if (collision.detected && collision.coordinates) {
        setTimeout(() => {
          setCollision({ detected: false, coordinates: null });
          setCycleCollisionDetected(false);
        }, 2000);

        setTimeout(() => {
          setBeamKey((prevKey) => prevKey + 1);
        }, 2000);
      }
    }, [collision]);

    return (
      <>
        <motion.div
          key={beamKey}
          ref={beamRef}
          animate="animate"
          initial={{
            translateY: beamOptions.initialY || "-200px",
            translateX: beamOptions.initialX || "0px",
            rotate: beamOptions.rotate || 0,
          }}
          variants={{
            animate: {
              translateY: beamOptions.translateY || "3000px",
              translateX: beamOptions.translateX || "0px",
              rotate: beamOptions.rotate || 0,
            },
          }}
          transition={{
            duration: beamOptions.duration || 8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: beamOptions.delay || 0,
            repeatDelay: beamOptions.repeatDelay || 0,
          }}
          className={cn(
            "absolute top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-green-400 via-green-300 to-transparent shadow-lg shadow-green-400/50",
            beamOptions.className
          )}
          style={{
            left: beamOptions.initialX,
          }}
        />
        <AnimatePresence>
          {collision.detected && collision.coordinates && (
            <Explosion
              key={`${collision.coordinates.x}-${collision.coordinates.y}`}
              className=""
              style={{
                left: `${collision.coordinates.x}px`,
                top: `${collision.coordinates.y}px`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </AnimatePresence>
      </>
    );
  }
);

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-green-400 to-transparent blur-sm shadow-lg shadow-green-400/70"
      ></motion.div>
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-green-300 to-green-500 shadow-sm shadow-green-400/50"
        />
      ))}
    </div>
  );
};
