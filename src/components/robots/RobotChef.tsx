import { motion } from 'framer-motion';

interface RobotChefProps {
  isActive: boolean;
  mood?: 'neutral' | 'happy' | 'thinking' | 'excited' | 'grateful';
}

export const RobotChef = ({ isActive, mood = 'neutral' }: RobotChefProps) => {
  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="chefHeadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8f9fa" />
          <stop offset="100%" stopColor="#e9ecef" />
        </linearGradient>
        
        <radialGradient id="chefCheekGradient">
          <stop offset="0%" stopColor="#ffb3ba" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffb3ba" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Chef Hat */}
      <motion.g
        animate={isActive ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Hat top (puff) */}
        <ellipse cx="100" cy="35" rx="40" ry="25" fill="#ffffff" stroke="#dee2e6" strokeWidth="2" />
        {/* Hat band */}
        <rect x="60" y="50" width="80" height="12" rx="6" fill="#ffffff" stroke="#dee2e6" strokeWidth="2" />
      </motion.g>

      {/* Head */}
      <motion.circle
        cx="100"
        cy="90"
        r="45"
        fill="url(#chefHeadGradient)"
        stroke="#dee2e6"
        strokeWidth="2"
        animate={isActive ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Eyes */}
      <motion.g>
        {/* Left eye */}
        <circle cx="82" cy="85" r="8" fill="#2d3436" />
        <circle cx="84" cy="83" r="3" fill="#ffffff" />
        
        {/* Right eye */}
        <circle cx="118" cy="85" r="8" fill="#2d3436" />
        <circle cx="120" cy="83" r="3" fill="#ffffff" />
      </motion.g>

      {/* Cheeks */}
      <ellipse cx="65" cy="95" rx="10" ry="7" fill="url(#chefCheekGradient)" />
      <ellipse cx="135" cy="95" rx="10" ry="7" fill="url(#chefCheekGradient)" />

      {/* Mustache */}
      <motion.g
        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '100px 100px' }}
      >
        <path d="M70,100 Q85,95 100,100 Q115,95 130,100" stroke="#495057" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="70" cy="100" r="6" fill="#495057" />
        <circle cx="130" cy="100" r="6" fill="#495057" />
      </motion.g>

      {/* Mouth (smile behind mustache) */}
      <motion.path
        d={isActive ? "M85,108 Q100,115 115,108" : "M85,108 Q100,110 115,108"}
        stroke="#ff6b6b"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Apron */}
      <motion.rect
        x="70"
        y="140"
        width="60"
        height="50"
        rx="8"
        fill="#ffffff"
        stroke="#dee2e6"
        strokeWidth="2"
      />

      {/* Chef's cross utensils on apron */}
      <g opacity="0.5">
        <line x1="95" y1="155" x2="95" y2="175" stroke="#495057" strokeWidth="2" />
        <line x1="105" y1="155" x2="105" y2="175" stroke="#495057" strokeWidth="2" />
        <circle cx="95" cy="153" r="3" fill="#495057" />
        <path d="M103,153 L107,153 L105,158 Z" fill="#495057" />
      </g>

      {/* Base */}
      <ellipse cx="100" cy="195" rx="35" ry="15" fill="#495057" opacity="0.3" />
    </svg>
  );
};
