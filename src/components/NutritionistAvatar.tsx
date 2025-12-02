import { motion, AnimatePresence } from 'framer-motion';

interface NutritionistAvatarProps {
  isActive: boolean;
  mood?: 'neutral' | 'happy' | 'thinking' | 'excited' | 'serious' | 'sad' | 'crying';
  isSpeaking?: boolean;
}

export const NutritionistAvatar = ({ isActive, mood = 'neutral', isSpeaking = false }: NutritionistAvatarProps) => {
  // Eye states based on mood
  const getEyeExpression = () => {
    if (!isActive) return 'sleeping';
    switch (mood) {
      case 'happy':
      case 'excited':
        return 'happy';
      case 'thinking':
        return 'thinking';
      case 'serious':
        return 'serious';
      case 'sad':
      case 'crying':
        return 'sad';
      default:
        return 'open';
    }
  };

  const eyeState = getEyeExpression();

  return (
    <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {/* Background gradient */}
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#1E3A5F" />
        </linearGradient>

        {/* Skin gradient */}
        <radialGradient id="skinGradient" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#FFE4C4" />
          <stop offset="100%" stopColor="#FFDAB9" />
        </radialGradient>

        {/* Hair gradient */}
        <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="50%" stopColor="#16213e" />
          <stop offset="100%" stopColor="#0f3460" />
        </linearGradient>

        {/* Blush gradient */}
        <radialGradient id="blushGradient">
          <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0" />
        </radialGradient>

        {/* Lab coat gradient */}
        <linearGradient id="coatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0f0f0" />
        </linearGradient>
      </defs>

      {/* Background with gradient */}
      <rect x="0" y="0" width="200" height="280" fill="url(#bgGradient)" rx="20" />

      {/* Stars/dots in background */}
      <circle cx="30" cy="40" r="2" fill="white" opacity="0.6" />
      <circle cx="170" cy="60" r="1.5" fill="white" opacity="0.5" />
      <circle cx="50" cy="80" r="1" fill="white" opacity="0.4" />
      <circle cx="150" cy="30" r="2" fill="white" opacity="0.6" />
      <circle cx="180" cy="100" r="1.5" fill="white" opacity="0.5" />

      {/* Floating food icons in background */}
      <g opacity="0.3">
        {/* Apple icon */}
        <circle cx="25" cy="120" r="8" fill="#ff6b6b" />
        <path d="M25,112 Q27,108 25,108" stroke="#4a7c59" strokeWidth="2" fill="none" />
        
        {/* Carrot icon */}
        <path d="M175,140 L180,160 L170,160 Z" fill="#ff9f43" />
        <path d="M175,138 L173,135 M175,138 L177,135" stroke="#4a7c59" strokeWidth="1.5" />
        
        {/* Broccoli icon */}
        <circle cx="40" cy="200" r="6" fill="#27ae60" />
        <rect x="38" y="206" width="4" height="8" fill="#6b8e23" />
      </g>

      {/* Body/Lab coat */}
      <motion.g
        animate={isActive ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Jacket base (black) */}
        <path
          d="M60,180 Q60,200 65,230 L135,230 Q140,200 140,180 Q140,160 100,155 Q60,160 60,180"
          fill="#1a1a2e"
        />

        {/* Lab coat */}
        <path
          d="M55,175 Q55,200 60,240 L80,240 L80,190 L100,185 L120,190 L120,240 L140,240 Q145,200 145,175 Q145,160 100,152 Q55,160 55,175"
          fill="url(#coatGradient)"
          stroke="#e0e0e0"
          strokeWidth="1"
        />

        {/* Coat lapels */}
        <path d="M80,175 L100,195 L120,175" fill="none" stroke="#e0e0e0" strokeWidth="2" />

        {/* Badge */}
        <rect x="115" y="178" width="20" height="12" rx="2" fill="#4a90d9" />
        <text x="125" y="187" fontSize="5" fill="white" textAnchor="middle">Dr. Nutri</text>

        {/* Nutritionist emblem on coat */}
        <g transform="translate(85, 195)">
          <circle r="10" fill="#4a7c59" />
          <path d="M-3,-5 L3,-5 L3,5 L-3,5 Z" fill="white" opacity="0.8" />
          <path d="M-5,-3 L5,-3 L5,3 L-5,3 Z" fill="white" opacity="0.8" />
        </g>

        {/* Apple necklace pendant */}
        <motion.g
          animate={isActive ? { rotate: [-5, 5, -5] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '100px 165px' }}
        >
          <path d="M95,155 Q100,160 105,155" stroke="#gold" strokeWidth="1.5" fill="none" />
          <circle cx="100" cy="168" r="6" fill="#ff6b6b" />
          <path d="M100,162 Q102,160 100,159" stroke="#4a7c59" strokeWidth="1.5" fill="none" />
        </motion.g>
      </motion.g>

      {/* Head */}
      <motion.g
        animate={isActive ? { y: [0, -3, 0] } : { y: [0, 2, 0] }}
        transition={{ duration: isActive ? 2 : 3, repeat: Infinity }}
      >
        {/* Face */}
        <ellipse cx="100" cy="100" rx="45" ry="50" fill="url(#skinGradient)" />

        {/* Hair */}
        <motion.g
          animate={isActive ? { y: [0, -1, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {/* Main hair */}
          <path
            d="M55,90 Q50,60 70,45 Q90,35 100,35 Q110,35 130,45 Q150,60 145,90 Q145,75 130,65 Q110,55 100,55 Q90,55 70,65 Q55,75 55,90"
            fill="url(#hairGradient)"
          />
          
          {/* Spiky hair strands */}
          <path d="M70,50 Q65,35 75,30 Q80,40 70,50" fill="#1a1a2e" />
          <path d="M85,42 Q85,25 95,22 Q95,35 85,42" fill="#16213e" />
          <path d="M100,40 Q105,20 110,22 Q108,35 100,40" fill="#0f3460" />
          <path d="M115,42 Q120,28 125,32 Q120,42 115,42" fill="#16213e" />
          <path d="M130,50 Q140,38 135,48" fill="#1a1a2e" />

          {/* Blue highlights */}
          <path d="M75,45 Q72,35 80,32" stroke="#4a90d9" strokeWidth="3" fill="none" opacity="0.8" />
          <path d="M95,38 Q98,28 105,28" stroke="#4a90d9" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M120,42 Q125,32 128,38" stroke="#4a90d9" strokeWidth="2" fill="none" opacity="0.6" />
        </motion.g>

        {/* Headphones */}
        <g>
          {/* Headband */}
          <path
            d="M52,85 Q50,60 100,55 Q150,60 148,85"
            stroke="#2d2d2d"
            strokeWidth="6"
            fill="none"
          />
          
          {/* Left ear cup */}
          <ellipse cx="52" cy="95" rx="12" ry="18" fill="#2d2d2d" />
          <ellipse cx="52" cy="95" rx="8" ry="12" fill="#1a1a1a" />
          
          {/* Right ear cup */}
          <ellipse cx="148" cy="95" rx="12" ry="18" fill="#2d2d2d" />
          <ellipse cx="148" cy="95" rx="8" ry="12" fill="#1a1a1a" />
          
          {/* Microphone arm */}
          <motion.g
            animate={isSpeaking ? { rotate: [0, 5, 0] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: '52px 105px' }}
          >
            <path d="M52,105 Q45,115 50,130" stroke="#2d2d2d" strokeWidth="3" fill="none" />
            <ellipse cx="52" cy="133" rx="6" ry="4" fill="#2d2d2d" />
            <ellipse cx="52" cy="133" rx="4" ry="2.5" fill="#4a4a4a" />
          </motion.g>
        </g>

        {/* Blush/Cheeks */}
        <ellipse cx="65" cy="110" rx="12" ry="8" fill="url(#blushGradient)" />
        <ellipse cx="135" cy="110" rx="12" ry="8" fill="url(#blushGradient)" />

        {/* Eyebrows */}
        <motion.g
          animate={
            mood === 'thinking' ? { y: -3 } :
            mood === 'sad' || mood === 'crying' ? { y: 2, rotate: 10 } :
            mood === 'serious' ? { y: -2 } :
            {}
          }
        >
          <path
            d={mood === 'thinking' || mood === 'serious' 
              ? "M72,75 Q80,72 88,75" 
              : mood === 'sad' || mood === 'crying'
              ? "M72,78 Q80,75 88,78"
              : "M72,78 Q80,76 88,78"}
            stroke="#1a1a2e"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={mood === 'thinking' || mood === 'serious'
              ? "M112,75 Q120,72 128,75"
              : mood === 'sad' || mood === 'crying'
              ? "M112,78 Q120,75 128,78"
              : "M112,78 Q120,76 128,78"}
            stroke="#1a1a2e"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Eyes */}
        <AnimatePresence mode="wait">
          {eyeState === 'sleeping' ? (
            <motion.g
              key="sleeping"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Closed eyes (curved lines) */}
              <path d="M72,90 Q80,95 88,90" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M112,90 Q120,95 128,90" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" fill="none" />
            </motion.g>
          ) : eyeState === 'happy' ? (
            <motion.g
              key="happy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Happy eyes (^ ^) */}
              <path d="M72,92 Q80,85 88,92" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M112,92 Q120,85 128,92" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" fill="none" />
              
              {/* Sparkles */}
              <motion.g
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <path d="M95,80 L97,85 L95,90 L93,85 Z" fill="#FFD700" />
                <path d="M135,78 L137,83 L135,88 L133,83 Z" fill="#FFD700" />
              </motion.g>
            </motion.g>
          ) : eyeState === 'sad' ? (
            <motion.g
              key="sad"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Sad eyes */}
              <ellipse cx="80" cy="90" rx="8" ry="10" fill="white" />
              <ellipse cx="80" cy="92" rx="5" ry="6" fill="#4a3728" />
              <ellipse cx="81" cy="91" rx="2" ry="2.5" fill="white" />
              
              <ellipse cx="120" cy="90" rx="8" ry="10" fill="white" />
              <ellipse cx="120" cy="92" rx="5" ry="6" fill="#4a3728" />
              <ellipse cx="121" cy="91" rx="2" ry="2.5" fill="white" />

              {/* Tears for crying */}
              {mood === 'crying' && (
                <motion.g
                  animate={{ y: [0, 20], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ellipse cx="70" cy="105" rx="3" ry="5" fill="#87CEEB" />
                  <ellipse cx="130" cy="105" rx="3" ry="5" fill="#87CEEB" />
                </motion.g>
              )}
            </motion.g>
          ) : (
            <motion.g
              key="open"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              style={{ transformOrigin: '100px 90px' }}
            >
              {/* Normal/Open eyes */}
              <ellipse cx="80" cy="90" rx="10" ry="12" fill="white" />
              <motion.ellipse
                cx="80"
                cy="90"
                rx="6"
                ry="7"
                fill="#4a3728"
                animate={mood === 'thinking' ? { cx: [80, 85, 80] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <ellipse cx="82" cy="88" rx="2.5" ry="3" fill="white" />
              
              <ellipse cx="120" cy="90" rx="10" ry="12" fill="white" />
              <motion.ellipse
                cx="120"
                cy="90"
                rx="6"
                ry="7"
                fill="#4a3728"
                animate={mood === 'thinking' ? { cx: [120, 125, 120] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <ellipse cx="122" cy="88" rx="2.5" ry="3" fill="white" />

              {/* Blink animation */}
              <motion.rect
                x="68"
                y="78"
                width="24"
                height="24"
                fill="url(#skinGradient)"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }}
                style={{ transformOrigin: '80px 78px' }}
              />
              <motion.rect
                x="108"
                y="78"
                width="24"
                height="24"
                fill="url(#skinGradient)"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }}
                style={{ transformOrigin: '120px 78px' }}
              />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Nose */}
        <ellipse cx="100" cy="105" rx="4" ry="3" fill="#FFDAB9" opacity="0.5" />

        {/* Mouth */}
        <motion.g>
          {!isActive ? (
            // Sleeping mouth (relaxed)
            <path d="M90,120 Q100,122 110,120" stroke="#c9a088" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : isSpeaking ? (
            // Speaking mouth animation
            <motion.ellipse
              cx="100"
              cy="122"
              rx="8"
              ry="6"
              fill="#c9a088"
              animate={{ ry: [4, 8, 4, 6, 4] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
          ) : mood === 'happy' || mood === 'excited' ? (
            // Big smile
            <path d="M85,118 Q100,135 115,118" stroke="#c9a088" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : mood === 'sad' || mood === 'crying' ? (
            // Sad mouth
            <path d="M88,125 Q100,115 112,125" stroke="#c9a088" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : mood === 'serious' ? (
            // Straight mouth
            <path d="M90,120 L110,120" stroke="#c9a088" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : (
            // Normal smile
            <path d="M88,118 Q100,128 112,118" stroke="#c9a088" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}
        </motion.g>
      </motion.g>

      {/* ZZZ animation when sleeping */}
      <AnimatePresence>
        {!isActive && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.text
              x="140"
              y="50"
              fontSize="14"
              fill="white"
              fontWeight="bold"
              animate={{ y: [50, 45, 50], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Z
            </motion.text>
            <motion.text
              x="150"
              y="40"
              fontSize="12"
              fill="white"
              fontWeight="bold"
              animate={{ y: [40, 35, 40], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              z
            </motion.text>
            <motion.text
              x="158"
              y="32"
              fontSize="10"
              fill="white"
              fontWeight="bold"
              animate={{ y: [32, 27, 32], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            >
              z
            </motion.text>

            {/* Dream bubble with healthy food */}
            <motion.g
              animate={{ y: [0, -3, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Thought bubbles */}
              <circle cx="145" cy="65" r="4" fill="white" opacity="0.7" />
              <circle cx="155" cy="55" r="6" fill="white" opacity="0.8" />
              
              {/* Main dream cloud */}
              <ellipse cx="170" cy="35" rx="20" ry="15" fill="white" opacity="0.9" />
              
              {/* Food inside dream */}
              <circle cx="165" cy="35" r="5" fill="#ff6b6b" /> {/* Tomato */}
              <circle cx="175" cy="33" r="4" fill="#27ae60" /> {/* Lettuce */}
              <rect x="168" y="38" width="8" height="3" rx="1" fill="#f39c12" /> {/* Carrot */}
            </motion.g>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Sun/Energy icon when awake */}
      <AnimatePresence>
        {isActive && mood === 'excited' && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: [0, 360] }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ rotate: { duration: 10, repeat: Infinity, ease: "linear" } }}
            style={{ transformOrigin: '160px 40px' }}
          >
            <circle cx="160" cy="40" r="10" fill="#FFD700" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.line
                key={i}
                x1={160 + Math.cos((angle * Math.PI) / 180) * 12}
                y1={40 + Math.sin((angle * Math.PI) / 180) * 12}
                x2={160 + Math.cos((angle * Math.PI) / 180) * 18}
                y2={40 + Math.sin((angle * Math.PI) / 180) * 18}
                stroke="#FFD700"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}
          </motion.g>
        )}
      </AnimatePresence>

      {/* Thinking elements */}
      <AnimatePresence>
        {isActive && mood === 'thinking' && (
          <motion.g
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Magnifying glass */}
            <motion.g
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ transformOrigin: '165px 55px' }}
            >
              <circle cx="160" cy="50" r="12" stroke="#4a90d9" strokeWidth="3" fill="none" />
              <line x1="170" y1="58" x2="180" y2="70" stroke="#4a90d9" strokeWidth="3" strokeLinecap="round" />
            </motion.g>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Hand with food when happy/excited */}
      <AnimatePresence>
        {isActive && (mood === 'happy' || mood === 'excited') && (
          <motion.g
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
          >
            {/* Hand holding apple */}
            <motion.g
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ transformOrigin: '40px 180px' }}
            >
              <ellipse cx="35" cy="180" rx="12" ry="8" fill="#FFDAB9" />
              <circle cx="35" cy="165" r="10" fill="#ff6b6b" />
              <path d="M35,155 Q38,150 35,150" stroke="#4a7c59" strokeWidth="2" fill="none" />
            </motion.g>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Sad food items */}
      <AnimatePresence>
        {isActive && (mood === 'sad' || mood === 'crying') && (
          <motion.g
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            {/* Junk food with X */}
            <motion.g
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <rect x="155" y="130" width="25" height="20" rx="3" fill="#f39c12" /> {/* Burger bun */}
              <rect x="153" y="140" width="29" height="5" fill="#c0392b" /> {/* Patty */}
              
              {/* Red X */}
              <motion.g
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <line x1="150" y1="125" x2="185" y2="160" stroke="#e74c3c" strokeWidth="4" strokeLinecap="round" />
                <line x1="185" y1="125" x2="150" y2="160" stroke="#e74c3c" strokeWidth="4" strokeLinecap="round" />
              </motion.g>
            </motion.g>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Serious mode - nutrition chart */}
      <AnimatePresence>
        {isActive && mood === 'serious' && (
          <motion.g
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 30, opacity: 0 }}
          >
            <motion.g
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Clipboard */}
              <rect x="155" y="120" width="35" height="45" rx="3" fill="#8B4513" />
              <rect x="158" y="125" width="29" height="37" fill="white" />
              
              {/* Chart bars */}
              <rect x="162" y="145" width="6" height="12" fill="#27ae60" />
              <rect x="170" y="140" width="6" height="17" fill="#3498db" />
              <rect x="178" y="148" width="6" height="9" fill="#e74c3c" />
            </motion.g>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Sound waves when speaking */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.g>
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`M42,${130 + i * 8} Q35,${135 + i * 8} 42,${140 + i * 8}`}
                stroke="#4a90d9"
                strokeWidth="2"
                fill="none"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  pathLength: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.g>
        )}
      </AnimatePresence>

      {/* Bottom shadow */}
      <ellipse cx="100" cy="265" rx="50" ry="10" fill="black" opacity="0.2" />
    </svg>
  );
};

export default NutritionistAvatar;
