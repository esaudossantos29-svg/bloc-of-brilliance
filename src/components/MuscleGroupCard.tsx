import { Card, CardContent } from "@/components/ui/card";
import { Flame, Clock, Zap } from "lucide-react";

type ProgressLevel = 'recent' | 'moderate' | 'resting' | 'none';

interface MuscleGroupCardProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
  exerciseCount?: number;
  progressLevel?: ProgressLevel;
  daysSinceTraining?: number | null;
}

const progressConfig: Record<ProgressLevel, { 
  indicator: React.ReactNode; 
  borderClass: string; 
  glowClass: string;
  label: string;
}> = {
  recent: {
    indicator: <Flame className="w-3.5 h-3.5 text-orange-500" />,
    borderClass: "border-orange-500/50",
    glowClass: "shadow-orange-500/30",
    label: "Treinado recentemente"
  },
  moderate: {
    indicator: <Zap className="w-3.5 h-3.5 text-yellow-500" />,
    borderClass: "border-yellow-500/40",
    glowClass: "shadow-yellow-500/20",
    label: "Em recuperação"
  },
  resting: {
    indicator: <Clock className="w-3.5 h-3.5 text-emerald-500" />,
    borderClass: "border-emerald-500/40",
    glowClass: "shadow-emerald-500/20",
    label: "Pronto para treinar"
  },
  none: {
    indicator: null,
    borderClass: "",
    glowClass: "",
    label: ""
  }
};

export function MuscleGroupCard({ 
  name, 
  icon, 
  color, 
  isSelected, 
  onClick, 
  exerciseCount = 0,
  progressLevel = 'none',
  daysSinceTraining
}: MuscleGroupCardProps) {
  const progress = progressConfig[progressLevel];
  
  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 relative ${
        isSelected ? 'ring-2 ring-primary shadow-xl scale-105' : ''
      } ${progressLevel !== 'none' ? `border ${progress.borderClass} shadow-md ${progress.glowClass}` : ''}`}
      onClick={onClick}
      style={{
        borderColor: isSelected ? color : undefined,
        backgroundColor: isSelected ? `${color}15` : undefined
      }}
    >
      {/* Progress Indicator Badge */}
      {progressLevel !== 'none' && (
        <div 
          className="absolute -top-1.5 -right-1.5 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-background border shadow-sm"
          title={`${progress.label}${daysSinceTraining !== null && daysSinceTraining !== undefined ? ` (${daysSinceTraining === 0 ? 'hoje' : daysSinceTraining === 1 ? 'ontem' : `há ${daysSinceTraining} dias`})` : ''}`}
        >
          {progress.indicator}
        </div>
      )}
      
      <CardContent className="p-4 flex flex-col items-center justify-center gap-3 relative">
        <div 
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
          style={{ 
            backgroundColor: `${color}20`,
            boxShadow: isSelected ? `0 0 20px ${color}40` : undefined
          }}
        >
          <img 
            src={icon} 
            alt={name} 
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="text-center w-full">
          <span className="text-sm font-semibold block">{name}</span>
          {exerciseCount > 0 && (
            <span className="text-xs text-muted-foreground block mt-1">
              {exerciseCount} {exerciseCount === 1 ? 'exercício' : 'exercícios'}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}