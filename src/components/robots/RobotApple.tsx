import { motion } from 'framer-motion';

interface RobotAppleProps {
  isActive: boolean;
  mood?: 'neutral' | 'happy' | 'thinking' | 'excited' | 'grateful';
}

export const RobotApple = ({ isActive, mood = 'neutral' }: RobotAppleProps) => {
  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="appleGradient" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="60%" stopColor="#ee5a6f" />
          <stop offset="100%" stopColor="#c92a2a" />
        </radialGradient>
        
        <radialGradient id="appleHighlight" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="appleCheekGradient">
          <stop offset="0%" stopColor="#fff5f5" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fff5f5" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Leaf on top */}
      <motion.g
        animate={isActive ? { rotate: [-5, 5, -5] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '100px 35px' }}
      >
        <ellipse cx="100" cy="35" rx="15" ry="8" fill="#56ab2f" />
        <line x1="100" y1="35" x2="100" y2="50" stroke="#8b4513" strokeWidth="4" strokeLinecap="round" />
      </motion.g>

      {/* Apple body (head) */}
      <motion.g
        animate={isActive ? { scale: [1, 1.03, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '100px 100px' }}
      >
        {/* Main apple shape */}
        <path
          d="M100,50 Q130,50 140,80 Q145,110 135,130 Q120,150 100,155 Q80,150 65,130 Q55,110 60,80 Q70,50 100,50"
          fill="url(#appleGradient)"
        />
        
        {/* Highlight */}
        <ellipse cx="85" cy="70" rx="20" ry="25" fill="url(#appleHighlight)" />
      </motion.g>

      {/* Eyes */}
      <motion.g>
        {/* Left eye */}
        <ellipse cx="82" cy="90" rx="10" ry={isActive ? 12 : 6} fill="#2d3436" />
        <ellipse cx="84" cy="87" rx="4" ry="5" fill="#ffffff" />
        
        {/* Right eye */}
        <ellipse cx="118" cy="90" rx="10" ry={isActive ? 12 : 6} fill="#2d3436" />
        <ellipse cx="120" cy="87" rx="4" ry="5" fill="#ffffff" />
      </motion.g>

      {/* Cheeks */}
      <ellipse cx="65" cy="105" rx="12" ry="10" fill="url(#appleCheekGradient)" />
      <ellipse cx="135" cy="105" rx="12" ry="10" fill="url(#appleCheekGradient)" />

      {/* Mouth */}
      <motion.path
        d={isActive ? "M85,110 Q100,122 115,110" : "M85,110 Q100,115 115,110"}
        stroke="#c92a2a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        animate={isActive ? { d: ["M85,110 Q100,122 115,110", "M85,110 Q100,118 115,110", "M85,110 Q100,122 115,110"] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Seeds (decorative dots) */}
      <g opacity="0.3">
        <ellipse cx="90" cy="120" rx="3" ry="4" fill="#8b4513" />
        <ellipse cx="110" cy="125" rx="3" ry="4" fill="#8b4513" />
      </g>

      {/* Base/Stand */}
      <motion.rect
        x="80"
        y="160"
        width="40"
        height="30"
        rx="5"
        fill="#8b4513"
        opacity="0.4"
      />

      <ellipse cx="100" cy="195" rx="30" ry="12" fill="#8b4513" opacity="0.3" />
    </svg>
  );
};
