import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface LiquidGlassNavbarProps {
  items: NavItem[];
  logo?: React.ReactNode;
  className?: string;
}

export const LiquidGlassNavbar: React.FC<LiquidGlassNavbarProps> = ({
  items,
  logo,
  className,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <nav
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'liquid-glass-navbar relative overflow-hidden rounded-2xl',
        'bg-white/10 dark:bg-white/5 backdrop-blur-md',
        'border border-white/20 dark:border-white/10',
        'shadow-xl shadow-black/5 dark:shadow-black/20',
        'font-inter tracking-tight',
        'px-6 py-4',
        'transition-all duration-300 ease-out',
        className
      )}
    >
      {/* Iridescent border gradient */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-40"
        style={{
          background: `linear-gradient(90deg, 
            rgba(255,100,150,0.4) 0%, 
            rgba(100,200,255,0.4) 33%, 
            rgba(150,255,150,0.4) 66%, 
            rgba(255,200,100,0.4) 100%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* Shimmer effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute h-40 w-40 rounded-full opacity-20 transition-opacity duration-300"
          style={{
            left: mousePos.x - 80,
            top: mousePos.y - 80,
            background: 'radial-gradient(circle, rgba(255,255,255,0.9), transparent 60%)',
            filter: 'blur(15px)',
          }}
        />
      )}

      <div className="relative z-10 flex items-center justify-between">
        {/* Logo */}
        {logo && <div className="flex-shrink-0">{logo}</div>}

        {/* Nav Items */}
        <div className="flex items-center gap-2">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={cn(
                'relative px-4 py-2 rounded-xl',
                'text-foreground/80 hover:text-foreground',
                'bg-transparent hover:bg-white/10 dark:hover:bg-white/5',
                'transition-all duration-200 ease-out',
                'hover:scale-105 active:scale-95',
                'flex items-center gap-2',
                'font-medium text-sm'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default LiquidGlassNavbar;
