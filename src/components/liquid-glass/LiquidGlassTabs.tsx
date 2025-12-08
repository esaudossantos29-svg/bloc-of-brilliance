import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface RippleProps {
  x: number;
  y: number;
  id: number;
}

interface LiquidGlassTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const LiquidGlassTabs: React.FC<LiquidGlassTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const activeTabEl = tabRefs.current.get(activeTab);
    if (activeTabEl && tabsRef.current) {
      const containerRect = tabsRef.current.getBoundingClientRect();
      const tabRect = activeTabEl.getBoundingClientRect();
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [activeTab]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleTabClick = useCallback(
    (tabId: string, e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const parentRect = tabsRef.current?.getBoundingClientRect();
      if (!parentRect) return;

      const x = e.clientX - parentRect.left;
      const y = e.clientY - parentRect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);

      onChange(tabId);
    },
    [onChange]
  );

  return (
    <div
      ref={tabsRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'liquid-glass-tabs relative overflow-hidden rounded-2xl',
        'bg-white/10 dark:bg-white/5 backdrop-blur-md',
        'border border-white/20 dark:border-white/10',
        'shadow-xl shadow-black/5 dark:shadow-black/20',
        'font-inter tracking-tight',
        'p-1.5',
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
          className="pointer-events-none absolute h-32 w-32 rounded-full opacity-20 transition-opacity duration-300"
          style={{
            left: mousePos.x - 64,
            top: mousePos.y - 64,
            background: 'radial-gradient(circle, rgba(255,255,255,0.9), transparent 60%)',
            filter: 'blur(12px)',
          }}
        />
      )}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute animate-ripple rounded-full bg-white/30 z-0"
          style={{
            left: ripple.x - 40,
            top: ripple.y - 40,
            width: 80,
            height: 80,
          }}
        />
      ))}

      {/* Active indicator */}
      <div
        className="absolute top-1.5 bottom-1.5 rounded-xl bg-white/20 dark:bg-white/15 backdrop-blur-sm transition-all duration-300 ease-out"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      >
        <div
          className="absolute inset-0 rounded-xl opacity-60"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Tabs */}
      <div className="relative z-10 flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
            }}
            onClick={(e) => handleTabClick(tab.id, e)}
            className={cn(
              'relative px-4 py-2 rounded-xl',
              'text-sm font-medium',
              'transition-all duration-200 ease-out',
              'hover:scale-105 active:scale-95',
              'flex items-center gap-2',
              activeTab === tab.id
                ? 'text-foreground'
                : 'text-foreground/60 hover:text-foreground/80'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LiquidGlassTabs;
