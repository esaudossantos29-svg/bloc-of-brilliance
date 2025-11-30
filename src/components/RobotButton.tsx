import { motion } from "framer-motion";

interface RobotButtonProps {
  onClick: () => void;
  isActive: boolean;
}

const RobotButton = ({ onClick, isActive }: RobotButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 focus:outline-none group"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      aria-label={isActive ? "NutriAI Ativo" : "Ativar NutriAI"}
    >
      {/* Container do Robô */}
      <div className="relative w-24 h-32 md:w-28 md:h-36">
        {/* Balão ZZZ (quando dormindo) */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [0.6, 1, 0.6],
              y: [-5, -15, -5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-8 right-0 bg-white rounded-xl px-3 py-1.5 shadow-lg border-2 border-gray-200"
          >
            <span className="text-gray-600 font-bold text-sm">zZ</span>
            {/* Triângulo do balão */}
            <div className="absolute bottom-[-8px] right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
          </motion.div>
        )}

        {/* SVG do Robô */}
        <svg
          viewBox="0 0 100 130"
          className="w-full h-full drop-shadow-2xl"
        >
          <defs>
            {/* Gradientes */}
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4e5ed" />
              <stop offset="100%" stopColor="#a8c8dc" />
            </linearGradient>
            
            <linearGradient id="visorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2a3a4a" />
              <stop offset="100%" stopColor="#1a2634" />
            </linearGradient>

            <radialGradient id="ledGlow">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="reflectionGradient">
              <stop offset="0%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Base/Pescoço (cone escuro) */}
          <motion.path
            d="M 35 85 L 30 105 L 70 105 L 65 85 Z"
            fill="#2a3a4a"
            stroke="#1a2634"
            strokeWidth="1"
          />

          {/* Anel de luz na base */}
          <motion.ellipse
            cx="50"
            cy="105"
            rx="20"
            ry="4"
            fill="#00d4ff"
            opacity={isActive ? 0.8 : 0.4}
            animate={{
              opacity: isActive ? [0.8, 1, 0.8] : [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Brilho do anel */}
          <motion.ellipse
            cx="50"
            cy="105"
            rx="25"
            ry="6"
            fill="url(#ledGlow)"
            opacity={isActive ? 0.5 : 0.2}
            animate={{
              opacity: isActive ? [0.5, 0.7, 0.5] : [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Cabeça (círculo com gradiente) */}
          <motion.g
            animate={{
              y: isActive ? 0 : 5,
              rotate: isActive ? 0 : -5,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ originX: "50px", originY: "50px" }}
          >
            {/* Corpo principal da cabeça */}
            <circle
              cx="50"
              cy="50"
              r="30"
              fill="url(#bodyGradient)"
              stroke="#8fa9b8"
              strokeWidth="1.5"
            />

            {/* Reflexo superior */}
            <ellipse
              cx="50"
              cy="35"
              rx="18"
              ry="12"
              fill="url(#reflectionGradient)"
              opacity="0.7"
            />

            {/* Visor escuro */}
            <rect
              x="30"
              y="40"
              width="40"
              height="20"
              rx="10"
              fill="url(#visorGradient)"
            />

            {/* Olhos - Estado Dormindo (arcos fechados) */}
            {!isActive && (
              <>
                <motion.path
                  d="M 38 50 Q 41 53 44 50"
                  stroke="#6dd5ed"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.path
                  d="M 56 50 Q 59 53 62 50"
                  stroke="#6dd5ed"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </>
            )}

            {/* Olhos - Estado Ativo (arcos abertos com pupilas) */}
            {isActive && (
              <>
                <motion.path
                  d="M 38 52 Q 41 49 44 52"
                  stroke="#6dd5ed"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.circle
                  cx="41"
                  cy="51"
                  r="1.5"
                  fill="#00d4ff"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
                
                <motion.path
                  d="M 56 52 Q 59 49 62 52"
                  stroke="#6dd5ed"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.circle
                  cx="59"
                  cy="51"
                  r="1.5"
                  fill="#00d4ff"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              </>
            )}

            {/* Sorriso */}
            <motion.path
              d="M 42 58 Q 50 62 58 58"
              stroke="#6dd5ed"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              animate={{
                d: isActive 
                  ? "M 42 58 Q 50 63 58 58"
                  : "M 42 58 Q 50 61 58 58"
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Antena Esquerda */}
            <g>
              <line x1="28" y1="30" x2="20" y2="20" stroke="#2a3a4a" strokeWidth="2" strokeLinecap="round" />
              <motion.circle
                cx="20"
                cy="20"
                r="3"
                fill="#00d4ff"
                animate={{
                  opacity: isActive ? [1, 0.4, 1] : [0.6, 0.3, 0.6],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.circle
                cx="20"
                cy="20"
                r="5"
                fill="url(#ledGlow)"
                opacity={isActive ? 0.6 : 0.3}
                animate={{
                  opacity: isActive ? [0.6, 0.2, 0.6] : [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </g>

            {/* Antena Direita */}
            <g>
              <line x1="72" y1="30" x2="80" y2="20" stroke="#2a3a4a" strokeWidth="2" strokeLinecap="round" />
              <motion.circle
                cx="80"
                cy="20"
                r="3"
                fill="#00d4ff"
                animate={{
                  opacity: isActive ? [0.4, 1, 0.4] : [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              <motion.circle
                cx="80"
                cy="20"
                r="5"
                fill="url(#ledGlow)"
                opacity={isActive ? 0.6 : 0.3}
                animate={{
                  opacity: isActive ? [0.2, 0.6, 0.2] : [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </g>
          </motion.g>
        </svg>

        {/* Tooltip */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {isActive ? "NutriAI Ativo" : "Ativar NutriAI"}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default RobotButton;
