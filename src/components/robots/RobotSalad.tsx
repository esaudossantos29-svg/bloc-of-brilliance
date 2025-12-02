import { motion } from 'framer-motion';

interface RobotSaladProps {
  isActive: boolean;
  mood?: 'neutral' | 'happy' | 'thinking' | 'excited' | 'grateful';
}

export const RobotSalad = ({ isActive, mood = 'neutral' }: RobotSaladProps) => {
  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="bowlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff9db" />
          <stop offset="100%" stopColor="#fce8a3" />
        </linearGradient>
        
        <radialGradient id="saladCheekGradient">
          <stop offset="0%" stopColor="#c3fae8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#c3fae8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Bowl rim */}
      <motion.ellipse
        cx="100"
        cy="65"
        rx="55"
        ry="12"
        fill="#f8f0c8"
        stroke="#e8d89f"
        strokeWidth="3"
      />

      {/* Bowl body */}
      <motion.path
        d="M45,65 Q45,140 100,155 Q155,140 155,65"
        fill="url(#bowlGradient)"
        stroke="#e8d89f"
        strokeWidth="3"
        animate={isActive ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '100px 110px' }}
      />

      {/* Salad vegetables (decorative) */}
      <motion.g
        animate={isActive ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {/* Lettuce leaves */}
        <ellipse cx="75" cy="50" rx="15" ry="10" fill="#96f2d7" opacity="0.8" />
        <ellipse cx="100" cy="45" rx="18" ry="12" fill="#63e6be" opacity="0.8" />
        <ellipse cx="125" cy="52" rx="14" ry="9" fill="#96f2d7" opacity="0.8" />
        
        {/* Tomato slice */}
        <circle cx="85" cy="58" r="8" fill="#ff6b6b" opacity="0.7" />
        
        {/* Carrot piece */}
        <rect x="110" y="55" width="8" height="10" rx="2" fill="#ff922b" opacity="0.7" />
      </motion.g>

      {/* Eyes on bowl */}
      <motion.g>
        {/* Left eye */}
        <circle cx="80" cy="90" r="10" fill="#2d3436" />
        <circle cx="82" cy="87" r="4" fill="#ffffff" />
        <circle cx="85" cy="89" r="2" fill="#ffffff" />
        
        {/* Right eye */}
        <circle cx="120" cy="90" r="10" fill="#2d3436" />
        <circle cx="122" cy="87" r="4" fill="#ffffff" />
        <circle cx="125" cy="89" r="2" fill="#ffffff" />
      </motion.g>

      {/* Happy cheeks */}
      <ellipse cx="60" cy="100" rx="10" ry="8" fill="url(#saladCheekGradient)" />
      <ellipse cx="140" cy="100" rx="10" ry="8" fill="url(#saladCheekGradient)" />

      {/* Mouth */}
      <motion.path
        d={isActive ? "M85,105 Q100,118 115,105" : "M85,105 Q100,110 115,105"}
        stroke="#51cf66"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        animate={isActive ? { d: ["M85,105 Q100,118 115,105", "M85,105 Q100,114 115,105", "M85,105 Q100,118 115,105"] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Salad details inside bowl */}
      <g opacity="0.4">
        <circle cx="95" cy="120" r="4" fill="#51cf66" />
        <circle cx="105" cy="125" r="3" fill="#ff6b6b" />
        <circle cx="90" cy="130" r="3" fill="#ff922b" />
      </g>

      {/* Base */}
      <ellipse cx="100" cy="160" rx="30" ry="10" fill="#e8d89f" opacity="0.6" />
      
      <motion.ellipse
        cx="100"
        cy="195"
        rx="35"
        ry="15"
        fill="#e8d89f"
        opacity="0.4"
      />
    </svg>
  );
};
