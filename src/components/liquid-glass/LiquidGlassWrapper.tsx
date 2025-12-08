import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface RippleProps {
  x: number;
  y: number;
  id: number;
}

interface LiquidGlassWrapperProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "fitness" | "nutrition" | "highlight";
  hoverable?: boolean;
  onClick?: () => void;
}

export function LiquidGlassWrapper({
  children,
  className,
  variant = "default",
  hoverable = false,
  onClick,
}: LiquidGlassWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);

      onClick?.();
    },
    [onClick]
  );

  const variantGradients = {
    default: `linear-gradient(135deg, rgba(255,100,150,0.3) 0%, rgba(100,200,255,0.3) 25%, rgba(150,255,150,0.3) 50%, rgba(255,200,100,0.3) 75%, rgba(255,100,150,0.3) 100%)`,
    fitness: `linear-gradient(135deg, rgba(34,197,94,0.4) 0%, rgba(59,130,246,0.4) 50%, rgba(34,197,94,0.4) 100%)`,
    nutrition: `linear-gradient(135deg, rgba(249,115,22,0.4) 0%, rgba(236,72,153,0.4) 50%, rgba(249,115,22,0.4) 100%)`,
    highlight: `linear-gradient(135deg, rgba(168,85,247,0.4) 0%, rgba(59,130,246,0.4) 50%, rgba(34,197,94,0.4) 100%)`,
  };

  const variantGlow = {
    default: "rgba(255, 255, 255, 0.2)",
    fitness: "rgba(34, 197, 94, 0.3)",
    nutrition: "rgba(249, 115, 22, 0.3)",
    highlight: "rgba(168, 85, 247, 0.3)",
  };

  return (
    <div
      ref={wrapperRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-white/10 dark:bg-white/5 backdrop-blur-md",
        "border border-white/20 dark:border-white/10",
        "shadow-xl shadow-black/5 dark:shadow-black/20",
        "font-inter tracking-tight",
        "transition-all duration-300 ease-out",
        hoverable && "cursor-pointer hover:scale-[1.02] hover:bg-white/15 dark:hover:bg-white/10",
        className
      )}
    >
      {/* Iridescent border gradient */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-50"
        style={{
          background: variantGradients[variant],
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1.5px',
        }}
      />

      {/* Shimmer effect on cursor */}
      {isHovered && (
        <div
          className="pointer-events-none absolute h-40 w-40 rounded-full opacity-30 transition-opacity duration-300"
          style={{
            left: mousePos.x - 80,
            top: mousePos.y - 80,
            background: `radial-gradient(circle, ${variantGlow[variant]}, transparent 60%)`,
            filter: 'blur(12px)',
          }}
        />
      )}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute animate-ripple rounded-full bg-white/20"
          style={{
            left: ripple.x - 60,
            top: ripple.y - 60,
            width: 120,
            height: 120,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
