import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface RippleProps {
  x: number;
  y: number;
  id: number;
}

interface MuscleGroupCardProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
  exerciseCount?: number;
}

export function MuscleGroupCard({ name, icon, color, isSelected, onClick, exerciseCount = 0 }: MuscleGroupCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick();
  }, [onClick]);

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl cursor-pointer",
        "bg-white/10 dark:bg-white/5 backdrop-blur-md",
        "border border-white/20 dark:border-white/10",
        "shadow-xl shadow-black/5 dark:shadow-black/20",
        "font-inter tracking-tight",
        "transition-all duration-300 ease-out",
        "hover:scale-105 hover:bg-white/20 dark:hover:bg-white/10",
        isSelected && "ring-2 ring-offset-2 ring-offset-background scale-105"
      )}
      style={{
        borderColor: isSelected ? color : undefined,
        boxShadow: isSelected ? `0 0 30px ${color}40` : undefined,
      }}
    >
      {/* Iridescent border gradient */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-50"
        style={{
          background: isSelected
            ? `linear-gradient(135deg, ${color}80 0%, ${color}40 50%, ${color}80 100%)`
            : `linear-gradient(135deg, rgba(255,100,150,0.3) 0%, rgba(100,200,255,0.3) 25%, rgba(150,255,150,0.3) 50%, rgba(255,200,100,0.3) 75%, rgba(255,100,150,0.3) 100%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1.5px',
        }}
      />

      {/* Shimmer effect on cursor */}
      {isHovered && (
        <div
          className="pointer-events-none absolute h-24 w-24 rounded-full opacity-40 transition-opacity duration-300"
          style={{
            left: mousePos.x - 48,
            top: mousePos.y - 48,
            background: `radial-gradient(circle, ${color}80, transparent 60%)`,
            filter: 'blur(10px)',
          }}
        />
      )}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute animate-ripple rounded-full"
          style={{
            left: ripple.x - 40,
            top: ripple.y - 40,
            width: 80,
            height: 80,
            backgroundColor: `${color}40`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 p-4 flex flex-col items-center justify-center gap-3">
        <div 
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 bg-white/10 dark:bg-white/5 backdrop-blur-sm"
          style={{ 
            boxShadow: isSelected ? `0 0 25px ${color}60` : `0 4px 15px ${color}20`,
          }}
        >
          <img 
            src={icon} 
            alt={name} 
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="text-center w-full">
          <span className="text-sm font-semibold block text-foreground">{name}</span>
          {exerciseCount > 0 && (
            <span className="text-xs text-muted-foreground block mt-1">
              {exerciseCount} {exerciseCount === 1 ? 'exercício' : 'exercícios'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
