import { motion } from 'framer-motion';

interface RobotCapsuleProps {
  isActive: boolean;
  mood?: 'neutral' | 'happy' | 'thinking' | 'excited' | 'grateful';
}

export const RobotCapsule = ({ isActive, mood = 'neutral' }: RobotCapsuleProps) => {
  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="capsuleTopGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#51cf66" />
          <stop offset="100%" stopColor="#37b24d" />
        </linearGradient>
        
        <linearGradient id="capsuleBottomGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f3f5" />
        </linearGradient>

        <radialGradient id="capsuleCheekGradient">
          <stop offset="0%" stopColor="#d3f9d8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d3f9d8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Capsule body */}
      <motion.g
        animate={isActive ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Top half (green) */}
        <path
          d="M60,90 Q60,50 100,50 Q140,50 140,90 L140,100 L60,100 Z"
          fill="url(#capsuleTopGradient)"
          stroke="#2f9e44"
          strokeWidth="3"
        />
        
        {/* Bottom half (white) */}
        <path
          d="M60,100 L60,130 Q60,160 100,160 Q140,160 140,130 L140,100 Z"
          fill="url(#capsuleBottomGradient)"
          stroke="#dee2e6"
          strokeWidth="3"
        />

        {/* Center band */}
        <rect x="55" y="98" width="90" height="4" fill="#adb5bd" />
      </motion.g>

      {/* Plus symbol on top (medical) */}
      <motion.g
        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '100px 70px' }}
      >
        <rect x="97" y="63" width="6" height="14" rx="2" fill="#ffffff" opacity="0.9" />
        <rect x="93" y="67" width="14" height="6" rx="2" fill="#ffffff" opacity="0.9" />
      </motion.g>

      {/* Eyes */}
      <motion.g>
        {/* Left eye */}
        <ellipse cx="82" cy="115" rx="8" ry={isActive ? 10 : 6} fill="#2d3436" />
        <ellipse cx="83" cy="112" rx="3" ry="4" fill="#ffffff" />
        
        {/* Right eye */}
        <ellipse cx="118" cy="115" rx="8" ry={isActive ? 10 : 6} fill="#2d3436" />
        <ellipse cx="119" cy="112" rx="3" ry="4" fill="#ffffff" />
      </motion.g>

      {/* Cheeks */}
      <ellipse cx="65" cy="125" rx="10" ry="7" fill="url(#capsuleCheekGradient)" />
      <ellipse cx="135" cy="125" rx="10" ry="7" fill="url(#capsuleCheekGradient)" />

      {/* Mouth */}
      <motion.path
        d={isActive ? "M85,135 Q100,145 115,135" : "M85,135 Q100,138 115,135"}
        stroke="#51cf66"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        animate={isActive ? { d: ["M85,135 Q100,145 115,135", "M85,135 Q100,142 115,135", "M85,135 Q100,145 115,135"] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Small dots (capsule details) */}
      <g opacity="0.3">
        <circle cx="75" cy="108" r="2" fill="#ffffff" />
        <circle cx="85" cy="110" r="2" fill="#ffffff" />
        <circle cx="115" cy="108" r="2" fill="#ffffff" />
        <circle cx="125" cy="110" r="2" fill="#ffffff" />
      </g>

      {/* Base stand */}
      <motion.rect
        x="80"
        y="165"
        width="40"
        height="25"
        rx="6"
        fill="#adb5bd"
        opacity="0.4"
      />

      <ellipse cx="100" cy="195" rx="30" ry="12" fill="#adb5bd" opacity="0.3" />
    </svg>
  );
};
