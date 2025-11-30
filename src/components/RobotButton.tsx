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
      <div className="relative w-24 h-24 md:w-28 md:h-28">
        {/* Sombra suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-500/30 blur-2xl rounded-full" />
        
        {/* Corpo do robô */}
        <motion.svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-2xl"
          animate={isActive ? "active" : "sleeping"}
        >
          {/* Cabeça do robô */}
          <motion.g
            variants={{
              sleeping: { y: 3, rotate: 10 },
              active: { y: 0, rotate: 0 }
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Corpo principal - mais arredondado */}
            <rect
              x="30"
              y="40"
              width="60"
              height="60"
              rx="20"
              fill="url(#robotGradient)"
              filter="url(#softGlow)"
            />
            
            {/* Antena fofa com coração */}
            <motion.g
              animate={{
                y: [0, -3, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <line
                x1="60"
                y1="40"
                x2="60"
                y2="28"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Coração na ponta da antena */}
              <path
                d="M60 30 C55 26, 50 28, 50 32 C50 35, 55 38, 60 40 C65 38, 70 35, 70 32 C70 28, 65 26, 60 30"
                fill="#ef4444"
                stroke="#dc2626"
                strokeWidth="0.5"
              />
              <motion.circle
                cx="60"
                cy="32"
                r="1.5"
                fill="#fff"
                opacity="0.8"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              />
            </motion.g>

            {/* Olhos grandes e expressivos */}
            <motion.g
              variants={{
                sleeping: { scaleY: 0.15, y: 2 },
                active: { scaleY: 1, y: 0 }
              }}
              transition={{ duration: 0.4, ease: "backOut" }}
            >
              {/* Olho esquerdo */}
              <circle cx="45" cy="60" r="8" fill="#fff" />
              <motion.circle
                cx="45"
                cy="60"
                r="5"
                fill="#1f2937"
                animate={isActive ? {
                  x: [0, 2, -2, 0],
                  scale: [1, 0.95, 1]
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
              {/* Brilho no olho */}
              <circle cx="47" cy="58" r="2.5" fill="#fff" opacity="0.9" />
              <circle cx="43.5" cy="61" r="1" fill="#fff" opacity="0.6" />
              
              {/* Olho direito */}
              <circle cx="75" cy="60" r="8" fill="#fff" />
              <motion.circle
                cx="75"
                cy="60"
                r="5"
                fill="#1f2937"
                animate={isActive ? {
                  x: [0, 2, -2, 0],
                  scale: [1, 0.95, 1]
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
              {/* Brilho no olho */}
              <circle cx="77" cy="58" r="2.5" fill="#fff" opacity="0.9" />
              <circle cx="73.5" cy="61" r="1" fill="#fff" opacity="0.6" />
            </motion.g>

            {/* Bochechas rosadas */}
            <motion.circle
              cx="28"
              cy="68"
              r="6"
              fill="#fca5a5"
              opacity="0.5"
              animate={isActive ? {
                opacity: [0.5, 0.7, 0.5],
                scale: [1, 1.1, 1]
              } : {
                opacity: 0.4
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
            <motion.circle
              cx="92"
              cy="68"
              r="6"
              fill="#fca5a5"
              opacity="0.5"
              animate={isActive ? {
                opacity: [0.5, 0.7, 0.5],
                scale: [1, 1.1, 1]
              } : {
                opacity: 0.4
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />

            {/* Boca super fofa */}
            <motion.path
              d={isActive ? "M 45 80 Q 60 88 75 80" : "M 45 80 Q 60 83 75 80"}
              stroke="#fff"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              animate={{
                d: isActive 
                  ? ["M 45 80 Q 60 88 75 80", "M 45 80 Q 60 90 75 80", "M 45 80 Q 60 88 75 80"]
                  : "M 45 80 Q 60 83 75 80"
              }}
              transition={{
                duration: 2,
                repeat: isActive ? Infinity : 0,
                ease: "easeInOut"
              }}
            />

            {/* Língua (aparece quando ativo) */}
            {isActive && (
              <motion.ellipse
                cx="60"
                cy="86"
                rx="4"
                ry="3"
                fill="#ff6b9d"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scaleY: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 4
                }}
              />
            )}

            {/* Detalhes decorativos - botões fofos */}
            <motion.circle
              cx="38"
              cy="50"
              r="2.5"
              fill="#34d399"
              opacity="0.8"
              animate={{
                opacity: [0.8, 1, 0.8],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.circle
              cx="82"
              cy="50"
              r="2.5"
              fill="#34d399"
              opacity="0.8"
              animate={{
                opacity: [0.8, 1, 0.8],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5
              }}
            />
            <motion.rect
              x="55"
              y="92"
              width="10"
              height="4"
              rx="2"
              fill="#34d399"
              opacity="0.7"
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1
              }}
            />
          </motion.g>

          {/* Gradientes e filtros */}
          <defs>
            <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
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
