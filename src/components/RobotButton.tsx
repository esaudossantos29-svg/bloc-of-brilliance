import { motion } from 'framer-motion';
import { useSnoringSound } from '@/hooks/useSnoringSound';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { NutritionistAvatar } from './NutritionistAvatar';

interface RobotButtonProps {
  onClick: () => void;
  isActive: boolean;
  isListening?: boolean;
  isSpeaking?: boolean;
  isProcessing?: boolean;
  mood?: 'neutral' | 'happy' | 'thinking' | 'excited' | 'serious' | 'sad' | 'crying';
}

const RobotButton = ({ onClick, isActive, isListening, isSpeaking, isProcessing, mood = 'neutral' }: RobotButtonProps) => {
  // Som de ronco quando inativo
  useSnoringSound(!isActive);

  // Get status text
  const getStatusText = () => {
    if (!isActive) return 'Dormindo... (Clique para acordar)';
    if (isProcessing) return 'Pensando...';
    if (isSpeaking) return 'Falando...';
    if (isListening) return 'Ouvindo você...';
    return 'Pronto para ajudar!';
  };

  // Determine mood based on state
  const getCurrentMood = (): 'neutral' | 'happy' | 'thinking' | 'excited' | 'serious' | 'sad' | 'crying' => {
    if (isProcessing) return 'thinking';
    if (isSpeaking) return 'happy';
    // Map grateful to excited (closest equivalent)
    if (mood === 'grateful' as any) return 'excited';
    return mood;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
          {/* Container do Avatar */}
          <div className="relative w-28 h-36 md:w-32 md:h-40">
            {/* Indicador visual de ouvindo */}
            {isListening && (
              <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  className="flex gap-1"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-cyan-400 rounded-full"
                      animate={{
                        height: [8, 16, 8],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Glow effect when active */}
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-b from-cyan-400/20 to-blue-500/20 blur-xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Dynamic Nutritionist Avatar */}
            <div className="w-full h-full drop-shadow-2xl relative z-10">
              <NutritionistAvatar 
                isActive={isActive} 
                mood={getCurrentMood()} 
                isSpeaking={isSpeaking}
              />
            </div>
          </div>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="left" className="bg-background/95 backdrop-blur-sm">
        <p className="text-sm font-medium">{getStatusText()}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default RobotButton;
