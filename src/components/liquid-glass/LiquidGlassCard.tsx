import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface RippleProps {
  x: number;
  y: number;
  id: number;
}

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className,
  onClick,
  hoverable = true,
}) => {
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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
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

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'liquid-glass-card relative overflow-hidden rounded-2xl',
        'bg-white/10 dark:bg-white/5 backdrop-blur-md',
        'border border-white/20 dark:border-white/10',
        'shadow-xl shadow-black/5 dark:shadow-black/20',
        'font-inter tracking-tight',
        'transition-all duration-300 ease-out',
        hoverable && 'hover:scale-105 hover:bg-white/20 dark:hover:bg-white/10',
        'cursor-pointer',
        className
      )}
      style={{
        background: isHovered
          ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15), transparent 40%)`
          : undefined,
      }}
    >
      {/* Iridescent border gradient */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-50"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255,100,150,0.3) 0%, 
            rgba(100,200,255,0.3) 25%, 
            rgba(150,255,150,0.3) 50%, 
            rgba(255,200,100,0.3) 75%, 
            rgba(255,100,150,0.3) 100%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* Shimmer effect on cursor */}
      {isHovered && (
        <div
          className="pointer-events-none absolute h-32 w-32 rounded-full opacity-30 transition-opacity duration-300"
          style={{
            left: mousePos.x - 64,
            top: mousePos.y - 64,
            background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent 60%)',
            filter: 'blur(10px)',
          }}
        />
      )}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute animate-ripple rounded-full bg-white/30"
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default LiquidGlassCard;
