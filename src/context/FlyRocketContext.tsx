"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";

interface RocketAnimation {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  cpX: number;
  cpY: number;
  progress: number; // 0 to 1
  currentX: number;
  currentY: number;
  angle: number;
}

interface SparkParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  opacity: number;
}

interface EndBurstParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
}

interface FlyRocketContextValue {
  triggerFlyRocket: (origin: HTMLElement | React.MouseEvent | { x: number; y: number }) => void;
  isCartBouncing: boolean;
}

const FlyRocketContext = createContext<FlyRocketContextValue>({
  triggerFlyRocket: () => {},
  isCartBouncing: false,
});

export function useFlyRocket() {
  return useContext(FlyRocketContext);
}

export function FlyRocketProvider({ children }: { children: React.ReactNode }) {
  const [activeRockets, setActiveRockets] = useState<RocketAnimation[]>([]);
  const [trailSparks, setTrailSparks] = useState<SparkParticle[]>([]);
  const [burstParticles, setBurstParticles] = useState<EndBurstParticle[]>([]);
  const [isCartBouncing, setIsCartBouncing] = useState(false);

  const nextId = useRef(1);
  const animFrameRef = useRef<number | null>(null);

  // Trigger Burst celebration at destination cart
  const triggerCartBurst = useCallback((targetX: number, targetY: number) => {
    setIsCartBouncing(true);

    const colors = ["#FFD166", "#EF4444", "#F59E0B", "#10B981", "#EC4899", "#FFFFFF"];
    const newBursts: EndBurstParticle[] = [];

    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 3.5;
      newBursts.push({
        id: nextId.current++,
        x: targetX,
        y: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[i % colors.length],
        size: 3 + Math.random() * 4,
        opacity: 1,
      });
    }

    setBurstParticles((prev) => [...prev, ...newBursts]);

    // Reset cart bounce after 600ms
    setTimeout(() => {
      setIsCartBouncing(false);
    }, 600);
  }, []);

  // Main Animation Loop
  const runAnimation = useCallback(() => {
    const DURATION = 650; // ms
    const startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / DURATION);
      // Ease-in-out curve
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      setActiveRockets((prevRockets) => {
        if (prevRockets.length === 0) return [];

        const updated = prevRockets.map((r) => {
          // Quadratic Bezier Formula: B(t) = (1-t)^2*P0 + 2(1-t)*t*P1 + t^2*P2
          const oneMinusT = 1 - ease;
          const currX =
            oneMinusT * oneMinusT * r.startX +
            2 * oneMinusT * ease * r.cpX +
            ease * ease * r.endX;
          const currY =
            oneMinusT * oneMinusT * r.startY +
            2 * oneMinusT * ease * r.cpY +
            ease * ease * r.endY;

          // Derivative for instantaneous angle: B'(t) = 2(1-t)(P1-P0) + 2t(P2-P1)
          const dx = 2 * (1 - ease) * (r.cpX - r.startX) + 2 * ease * (r.endX - r.cpX);
          const dy = 2 * (1 - ease) * (r.cpY - r.startY) + 2 * ease * (r.endY - r.cpY);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90; // +90 because rocket icon points up

          // Emit trail sparks along trajectory
          if (Math.random() < 0.75) {
            setTrailSparks((sparks) => [
              ...sparks.slice(-25),
              {
                id: nextId.current++,
                x: currX + (Math.random() - 0.5) * 6,
                y: currY + (Math.random() - 0.5) * 6,
                color: Math.random() > 0.4 ? "#FFD166" : "#EF4444",
                size: 2.5 + Math.random() * 3,
                opacity: 0.9,
              },
            ]);
          }

          return {
            ...r,
            progress: t,
            currentX: currX,
            currentY: currY,
            angle,
          };
        });

        // Check if finished
        if (t >= 1) {
          prevRockets.forEach((r) => triggerCartBurst(r.endX, r.endY));
          return [];
        }

        return updated;
      });

      // Decay trail sparks
      setTrailSparks((prev) =>
        prev
          .map((s) => ({ ...s, opacity: s.opacity - 0.05, size: Math.max(0.5, s.size - 0.1) }))
          .filter((s) => s.opacity > 0)
      );

      // Expand burst particles
      setBurstParticles((prev) =>
        prev
          .map((b) => ({
            ...b,
            x: b.x + b.vx,
            y: b.y + b.vy,
            opacity: b.opacity - 0.04,
            size: Math.max(0.5, b.size - 0.1),
          }))
          .filter((b) => b.opacity > 0)
      );

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        // Fade out remaining sparks
        const cleanupTimer = setInterval(() => {
          setTrailSparks((prev) => {
            const next = prev.map((s) => ({ ...s, opacity: s.opacity - 0.1 })).filter((s) => s.opacity > 0);
            return next;
          });
          setBurstParticles((prev) => {
            const next = prev
              .map((b) => ({ ...b, x: b.x + b.vx, y: b.y + b.vy, opacity: b.opacity - 0.08 }))
              .filter((b) => b.opacity > 0);
            if (next.length === 0) clearInterval(cleanupTimer);
            return next;
          });
        }, 30);
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
  }, [triggerCartBurst]);

  // Trigger function
  const triggerFlyRocket = useCallback(
    (origin: HTMLElement | React.MouseEvent | { x: number; y: number }) => {
      let startX = window.innerWidth / 2;
      let startY = window.innerHeight / 2;

      if ("currentTarget" in origin && origin.currentTarget) {
        const rect = (origin.currentTarget as HTMLElement).getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      } else if (origin instanceof HTMLElement) {
        const rect = origin.getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      } else if ("clientX" in origin && "clientY" in origin) {
        startX = origin.clientX;
        startY = origin.clientY;
      } else if ("x" in origin && "y" in origin) {
        startX = origin.x;
        startY = origin.y;
      }

      // Find navbar cart target
      let targetX = window.innerWidth - 80;
      let targetY = 36;

      const navCartEl =
        document.getElementById("navbar-cart-btn") ||
        document.getElementById("mobile-cart-btn");

      if (navCartEl) {
        const rect = navCartEl.getBoundingClientRect();
        // If element is visible in viewport
        if (rect.width > 0 && rect.height > 0) {
          targetX = rect.left + rect.width / 2;
          targetY = rect.top + rect.height / 2;
        }
      }

      // Compute festive arc control point (arches up into the sky gracefully)
      const cpX = (startX + targetX) / 2 + (startX < targetX ? -30 : 30);
      const cpY = Math.max(20, Math.min(startY, targetY) - Math.max(50, Math.abs(startX - targetX) * 0.25));

      const rocket: RocketAnimation = {
        id: nextId.current++,
        startX,
        startY,
        endX: targetX,
        endY: targetY,
        cpX,
        cpY,
        progress: 0,
        currentX: startX,
        currentY: startY,
        angle: -45,
      };

      setActiveRockets([rocket]);
      runAnimation();
    },
    [runAnimation]
  );

  return (
    <FlyRocketContext.Provider value={{ triggerFlyRocket, isCartBouncing }}>
      {children}

      {/* Global Flying Rocket Overlay */}
      {(activeRockets.length > 0 || trailSparks.length > 0 || burstParticles.length > 0) && (
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden select-none"
          style={{ zIndex: 99999 }}
          aria-hidden="true"
        >
          {/* Trail Sparks */}
          {trailSparks.map((spark) => (
            <div
              key={spark.id}
              className="absolute rounded-full"
              style={{
                left: spark.x,
                top: spark.y,
                width: spark.size,
                height: spark.size,
                backgroundColor: spark.color,
                opacity: spark.opacity,
                transform: "translate(-50%, -50%)",
                boxShadow: `0 0 6px ${spark.color}`,
              }}
            />
          ))}

          {/* End Celebration Burst Particles */}
          {burstParticles.map((b) => (
            <div
              key={b.id}
              className="absolute rounded-full"
              style={{
                left: b.x,
                top: b.y,
                width: b.size,
                height: b.size,
                backgroundColor: b.color,
                opacity: b.opacity,
                transform: "translate(-50%, -50%)",
                boxShadow: `0 0 8px ${b.color}`,
              }}
            />
          ))}

          {/* Flying Sivakasi Rocket */}
          {activeRockets.map((r) => (
            <div
              key={r.id}
              style={{
                position: "fixed",
                left: r.currentX,
                top: r.currentY,
                transform: `translate(-50%, -50%) rotate(${r.angle}deg)`,
                willChange: "transform, left, top",
              }}
            >
              <div className="relative flex items-center justify-center">
                {/* Blazing Flame / Sparks Jet behind Rocket */}
                <div className="absolute top-[18px] w-2.5 h-6 bg-gradient-to-b from-yellow-300 via-orange-500 to-transparent rounded-full animate-ping opacity-90" />
                <div className="absolute top-[16px] w-1.5 h-3.5 bg-yellow-200 rounded-full blur-[0.5px]" />

                {/* Festival Rocket SVG */}
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="drop-shadow-[0_0_10px_rgba(245,158,11,0.9)]"
                >
                  {/* Sivakasi Nose Cone */}
                  <path
                    d="M12 2C12 2 16 5.5 16 10C16 12 15 14 15 14H9C9 14 8 12 8 10C8 5.5 12 2 12 2Z"
                    fill="#DC2626"
                  />
                  {/* Rocket Body Stripe */}
                  <rect x="9" y="10" width="6" height="5" fill="#FFD166" />
                  <rect x="9" y="12" width="6" height="1.5" fill="#B91C1C" />
                  {/* Fins */}
                  <path d="M6 12L4 15H9L8 12H6Z" fill="#F59E0B" />
                  <path d="M18 12L20 15H15L16 12H18Z" fill="#F59E0B" />
                  {/* Rocket Stick / Fuse */}
                  <line
                    x1="12"
                    y1="15"
                    x2="12"
                    y2="20"
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Fuse Spark */}
                  <circle cx="12" cy="20.5" r="1.5" fill="#FFFFFF" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </FlyRocketContext.Provider>
  );
}
