import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface RippleProps {
  x: number;
  y: number;
  id: number;
}

interface LiquidGlassToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: { track: 'w-10 h-5', thumb: 'w-4 h-4', translate: 'translate-x-5' },
  md: { track: 'w-12 h-6', thumb: 'w-5 h-5', translate: 'translate-x-6' },
  lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
};

export const LiquidGlassToggle: React.FC<LiquidGlassToggleProps> = ({
  checked = false,
  onChange,
  disabled = false,
  className,
  size = 'md',
}) => {
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const sizes = sizeClasses[size];

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);

      onChange?.(!checked);
    },
    [checked, disabled, onChange]
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'liquid-glass-toggle relative overflow-hidden rounded-full',
        'bg-white/10 dark:bg-white/5 backdrop-blur-md',
        'border border-white/20 dark:border-white/10',
        'shadow-xl shadow-black/5 dark:shadow-black/20',
        'font-inter tracking-tight',
        'transition-all duration-300 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-white/30',
        isHovered && !disabled && 'scale-105',
        checked && 'bg-white/20 dark:bg-white/15',
        disabled && 'opacity-50 cursor-not-allowed',
        sizes.track,
        className
      )}
    >
      {/* Iridescent border gradient */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full opacity-50"
        style={{
          background: checked
            ? `linear-gradient(135deg, 
                rgba(100,255,150,0.5) 0%, 
                rgba(100,200,255,0.5) 50%, 
                rgba(150,255,200,0.5) 100%)`
            : `linear-gradient(135deg, 
                rgba(255,100,150,0.3) 0%, 
                rgba(200,200,200,0.3) 100%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute animate-ripple rounded-full bg-white/40"
          style={{
            left: ripple.x - 15,
            top: ripple.y - 15,
            width: 30,
            height: 30,
          }}
        />
      ))}

      {/* Thumb */}
      <div
        className={cn(
          'absolute top-0.5 left-0.5 rounded-full',
          'bg-white/80 dark:bg-white/70 backdrop-blur-sm',
          'shadow-lg shadow-black/10',
          'transition-transform duration-300 ease-out',
          checked && sizes.translate,
          sizes.thumb
        )}
      >
        {/* Thumb shimmer */}
        <div
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 50%)',
          }}
        />
      </div>
    </button>
  );
};

export default LiquidGlassToggle;
