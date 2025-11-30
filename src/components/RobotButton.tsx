import { motion } from 'framer-motion';

interface RobotButtonProps {
  onClick: () => void;
  isActive: boolean;
}

const RobotButton = ({ onClick, isActive }: RobotButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Container do robô */}
      <div className="relative w-20 h-20 md:w-24 md:h-24">
        {/* Sombra */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/20 blur-xl rounded-full" />
        
        {/* Corpo do robô */}
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-2xl"
          animate={isActive ? "active" : "sleeping"}
        >
          {/* Cabeça do robô */}
          <motion.g
            variants={{
              sleeping: { y: 5, rotate: 15 },
              active: { y: 0, rotate: 0 }
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Corpo principal */}
            <rect
              x="25"
              y="35"
              width="50"
              height="50"
              rx="12"
              className="fill-gradient-to-br from-green-500 to-emerald-600"
              fill="url(#robotGradient)"
            />
            
            {/* Antena */}
            <motion.g
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <line
                x1="50"
                y1="35"
                x2="50"
                y2="25"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="50" cy="23" r="3" fill="#34d399" />
            </motion.g>

            {/* Olhos */}
            <motion.g
              variants={{
                sleeping: { scaleY: 0.1 },
                active: { scaleY: 1 }
              }}
              transition={{ duration: 0.3 }}
            >
              <ellipse cx="38" cy="52" rx="5" ry="6" fill="#fff" />
              <ellipse cx="62" cy="52" rx="5" ry="6" fill="#fff" />
              <motion.circle
                cx="38"
                cy="52"
                r="3"
                fill="#1f2937"
                animate={isActive ? {
                  x: [0, 2, -2, 0],
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
              <motion.circle
                cx="62"
                cy="52"
                r="3"
                fill="#1f2937"
                animate={isActive ? {
                  x: [0, 2, -2, 0],
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
            </motion.g>

            {/* Boca */}
            <motion.path
              d={isActive ? "M 38 68 Q 50 73 62 68" : "M 38 68 Q 50 70 62 68"}
              stroke="#fff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              animate={{
                d: isActive 
                  ? ["M 38 68 Q 50 73 62 68", "M 38 68 Q 50 75 62 68", "M 38 68 Q 50 73 62 68"]
                  : "M 38 68 Q 50 70 62 68"
              }}
              transition={{
                duration: 2,
                repeat: isActive ? Infinity : 0,
                ease: "easeInOut"
              }}
            />

            {/* Detalhes decorativos */}
            <circle cx="32" cy="45" r="2" fill="#34d399" opacity="0.6" />
            <circle cx="68" cy="45" r="2" fill="#34d399" opacity="0.6" />
            <rect x="45" y="75" width="10" height="3" rx="1.5" fill="#34d399" opacity="0.6" />
          </motion.g>

          {/* Gradiente */}
          <defs>
            <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* ZZZ quando dormindo */}
        {!isActive && (
          <motion.div
            className="absolute -top-8 -right-2 text-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [0.4, 1, 0.4],
              y: [0, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex flex-col items-end gap-0.5">
              <motion.span 
                className="text-green-500 font-bold"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                Z
              </motion.span>
              <motion.span 
                className="text-green-500 font-bold text-xl"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                Z
              </motion.span>
              <motion.span 
                className="text-green-500 font-bold text-sm"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              >
                Z
              </motion.span>
            </div>
          </motion.div>
        )}

        {/* Pulso de ativação */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-400"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>

      {/* Texto (opcional, aparece no hover) */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      >
        {isActive ? 'NutriAI Ativo' : 'Ativar NutriAI'}
      </motion.div>
    </motion.button>
  );
};

export default RobotButton;
