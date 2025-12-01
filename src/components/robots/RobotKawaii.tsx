import { motion } from 'framer-motion';

interface RobotKawaiiProps {
  isActive: boolean;
  mood?: 'neutral' | 'happy' | 'thinking' | 'excited' | 'grateful';
}

export const RobotKawaii = ({ isActive, mood = 'neutral' }: RobotKawaiiProps) => {
  const getEyeExpression = () => {
    if (!isActive) return 'M10,0 Q15,5 20,0'; // Closed eyes
    
    switch (mood) {
      case 'happy': return 'M10,0 Q15,-3 20,0'; // Happy arcs
      case 'excited': return 'M10,-2 Q15,-5 20,-2'; // Very excited
      case 'thinking': return 'M10,2 Q15,0 20,2'; // Thoughtful
      case 'grateful': return 'M10,1 Q15,-1 20,1'; // Gentle
      default: return 'M10,0 Q15,-2 20,0'; // Neutral arcs
    }
  };

  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a8e6cf" />
          <stop offset="100%" stopColor="#88d8b0" />
        </linearGradient>
        
        <radialGradient id="cheekGradient">
          <stop offset="0%" stopColor="#ffb3ba" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffb3ba" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="apronGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0f0f0" />
        </linearGradient>
      </defs>

      {/* Head */}
      <motion.circle
        cx="100"
        cy="80"
        r="50"
        fill="url(#bodyGradient)"
        animate={isActive ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Left antenna with leaf */}
      <motion.g
        animate={isActive ? { rotate: [-3, 3, -3] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '65px 40px' }}
      >
        <line x1="65" y1="40" x2="65" y2="15" stroke="#56ab2f" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="65" cy="10" rx="8" ry="12" fill="#56ab2f" />
      </motion.g>

      {/* Right antenna with apple */}
      <motion.g
        animate={isActive ? { rotate: [3, -3, 3] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '135px 40px' }}
      >
        <line x1="135" y1="40" x2="135" y2="15" stroke="#56ab2f" strokeWidth="3" strokeLinecap="round" />
        <circle cx="135" cy="10" r="7" fill="#ff6b6b" />
        <line x1="135" y1="3" x2="138" y2="0" stroke="#56ab2f" strokeWidth="2" />
      </motion.g>

      {/* Eyes */}
      <motion.g>
        {/* Left eye */}
        <circle cx="80" cy="75" r="10" fill="#2d3436" />
        <circle cx="82" cy="72" r="4" fill="#ffffff" />
        <circle cx="85" cy="75" r="2" fill="#ffffff" />
        
        {/* Right eye */}
        <circle cx="120" cy="75" r="10" fill="#2d3436" />
        <circle cx="122" cy="72" r="4" fill="#ffffff" />
        <circle cx="125" cy="75" r="2" fill="#ffffff" />
      </motion.g>

      {/* Cheeks */}
      <ellipse cx="60" cy="90" rx="12" ry="8" fill="url(#cheekGradient)" />
      <ellipse cx="140" cy="90" rx="12" ry="8" fill="url(#cheekGradient)" />

      {/* Mouth */}
      <motion.path
        d={isActive ? "M85,95 Q100,105 115,95" : "M85,95 Q100,98 115,95"}
        stroke="#ff6b6b"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        animate={isActive ? { d: ["M85,95 Q100,105 115,95", "M85,95 Q100,102 115,95", "M85,95 Q100,105 115,95"] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Body/Apron */}
      <motion.rect
        x="70"
        y="130"
        width="60"
        height="50"
        rx="10"
        fill="url(#apronGradient)"
        stroke="#e0e0e0"
        strokeWidth="2"
      />

      {/* Salad icon on apron */}
      <circle cx="100" cy="155" r="8" fill="#56ab2f" opacity="0.3" />
      <path d="M95,155 L100,150 L105,155" stroke="#56ab2f" strokeWidth="2" fill="none" />

      {/* Base */}
      <motion.ellipse
        cx="100"
        cy="190"
        rx="35"
        ry="15"
        fill="#27ae60"
        opacity="0.6"
      />
    </svg>
  );
};
