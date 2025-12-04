import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Save, Edit2, ArrowLeftRight, Plus, Minus, X, PlusCircle, GitBranch, Type, Slash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import bodyFrontWorkout from "@/assets/body-front-workout-transparent.png";
import bodyBackWorkout from "@/assets/body-back-workout-transparent.png";
import { ExerciseList } from "@/components/ExerciseList";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface WorkoutMuscleMapProps {
  view: "front" | "back";
  selectedMuscle: string | null;
  onMuscleSelect: (muscle: string) => void;
}

interface MuscleLabel {
  name: string;
  muscle: string;
  side: "left" | "right";
  top: string;
  left?: string;
  right?: string;
  fontSize?: number;
  lineWidth?: number;
  pointSide?: "left" | "right";
  lineType?: "straight" | "angled";
  hideLabel?: boolean;
  hideLine?: boolean;
}

// Mapeamento de cores por grupo muscular
const muscleColorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  chest: { bg: "from-blue-500/20 to-blue-600/10", border: "border-blue-400/40", text: "text-blue-600 dark:text-blue-400", glow: "shadow-blue-500/30" },
  back: { bg: "from-blue-500/20 to-blue-600/10", border: "border-blue-400/40", text: "text-blue-600 dark:text-blue-400", glow: "shadow-blue-500/30" },
  shoulders: { bg: "from-teal-500/20 to-teal-600/10", border: "border-teal-400/40", text: "text-teal-600 dark:text-teal-400", glow: "shadow-teal-500/30" },
  biceps: { bg: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-400/40", text: "text-emerald-600 dark:text-emerald-400", glow: "shadow-emerald-500/30" },
  triceps: { bg: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-400/40", text: "text-emerald-600 dark:text-emerald-400", glow: "shadow-emerald-500/30" },
  forearms: { bg: "from-green-500/20 to-green-600/10", border: "border-green-400/40", text: "text-green-600 dark:text-green-400", glow: "shadow-green-500/30" },
  abs: { bg: "from-purple-500/20 to-purple-600/10", border: "border-purple-400/40", text: "text-purple-600 dark:text-purple-400", glow: "shadow-purple-500/30" },
  obliques: { bg: "from-violet-500/20 to-violet-600/10", border: "border-violet-400/40", text: "text-violet-600 dark:text-violet-400", glow: "shadow-violet-500/30" },
  legs: { bg: "from-orange-500/20 to-orange-600/10", border: "border-orange-400/40", text: "text-orange-600 dark:text-orange-400", glow: "shadow-orange-500/30" },
  hamstrings: { bg: "from-amber-500/20 to-amber-600/10", border: "border-amber-400/40", text: "text-amber-600 dark:text-amber-400", glow: "shadow-amber-500/30" },
  calves: { bg: "from-rose-500/20 to-rose-600/10", border: "border-rose-400/40", text: "text-rose-600 dark:text-rose-400", glow: "shadow-rose-500/30" },
  glutes: { bg: "from-pink-500/20 to-pink-600/10", border: "border-pink-400/40", text: "text-pink-600 dark:text-pink-400", glow: "shadow-pink-500/30" },
  traps: { bg: "from-cyan-500/20 to-cyan-600/10", border: "border-cyan-400/40", text: "text-cyan-600 dark:text-cyan-400", glow: "shadow-cyan-500/30" },
  lower_back: { bg: "from-indigo-500/20 to-indigo-600/10", border: "border-indigo-400/40", text: "text-indigo-600 dark:text-indigo-400", glow: "shadow-indigo-500/30" },
  adductors: { bg: "from-fuchsia-500/20 to-fuchsia-600/10", border: "border-fuchsia-400/40", text: "text-fuchsia-600 dark:text-fuchsia-400", glow: "shadow-fuchsia-500/30" },
};

const getDefaultMuscleColor = () => ({ 
  bg: "from-slate-500/20 to-slate-600/10", 
  border: "border-slate-400/40", 
  text: "text-slate-600 dark:text-slate-400",
  glow: "shadow-slate-500/30"
});

const frontLabels: MuscleLabel[] = [
  { name: "Peitoral", muscle: "chest", side: "right", top: "20%" },
  { name: "Ombros", muscle: "shoulders", side: "left", top: "16%" },
  { name: "Bíceps", muscle: "biceps", side: "left", top: "30%" },
  { name: "Abdômen", muscle: "abs", side: "right", top: "36%" },
  { name: "Antebraços", muscle: "forearms", side: "right", top: "48%" },
  { name: "Oblíquos", muscle: "obliques", side: "left", top: "44%" },
  { name: "Quadríceps", muscle: "legs", side: "left", top: "62%" },
  { name: "Adutores", muscle: "adductors", side: "right", top: "62%" },
  { name: "Panturrilhas", muscle: "calves", side: "right", top: "78%" },
];

const backLabels: MuscleLabel[] = [
  { name: "Trapézio", muscle: "traps", side: "right", top: "14%" },
  { name: "Dorsais", muscle: "back", side: "right", top: "28%" },
  { name: "Tríceps", muscle: "triceps", side: "left", top: "28%" },
  { name: "Lombares", muscle: "lower_back", side: "left", top: "42%" },
  { name: "Glúteos", muscle: "glutes", side: "right", top: "48%" },
  { name: "Isquiotibiais", muscle: "hamstrings", side: "left", top: "62%" },
  { name: "Panturrilhas", muscle: "calves", side: "right", top: "76%" },
];

export function WorkoutMuscleMap({ view, selectedMuscle, onMuscleSelect }: WorkoutMuscleMapProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const storageKey = `muscle-labels-${view}-${isMobile ? 'mobile' : 'desktop'}`;
  const globalSettingsKey = `muscle-map-global-settings-${view}-${isMobile ? 'mobile' : 'desktop'}`;
  
  const [labels, setLabels] = useState<MuscleLabel[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : (view === "front" ? frontLabels : backLabels);
  });
  const [isEditing, setIsEditing] = useState(() => {
    const savedEditMode = localStorage.getItem('muscle-map-edit-mode');
    return savedEditMode === 'true';
  });
  const [labelSize, setLabelSize] = useState(() => {
    const saved = localStorage.getItem(globalSettingsKey);
    return saved ? JSON.parse(saved).labelSize || 14 : 14;
  });
  const [lineWidth, setLineWidth] = useState(() => {
    const saved = localStorage.getItem(globalSettingsKey);
    return saved ? JSON.parse(saved).lineWidth || 40 : 40;
  });
  const [draggedLabel, setDraggedLabel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showExercises, setShowExercises] = useState(false);
  const [selectedMuscleForExercises, setSelectedMuscleForExercises] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLabelData, setNewLabelData] = useState({ name: "", muscle: "", side: "left" as "left" | "right" });

  // Carregar labels quando mudar de view
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setLabels(saved ? JSON.parse(saved) : (view === "front" ? frontLabels : backLabels));
    
    const savedGlobal = localStorage.getItem(globalSettingsKey);
    if (savedGlobal) {
      const parsed = JSON.parse(savedGlobal);
      setLabelSize(parsed.labelSize || 14);
      setLineWidth(parsed.lineWidth || 40);
    } else {
      setLabelSize(14);
      setLineWidth(40);
    }
  }, [view, storageKey, globalSettingsKey]);

  // Salvar ajustes globais automaticamente
  useEffect(() => {
    localStorage.setItem(globalSettingsKey, JSON.stringify({ labelSize, lineWidth }));
  }, [labelSize, lineWidth, globalSettingsKey]);

  // Auto-save labels com debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(labels));
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [labels, storageKey]);

  const toggleEditMode = () => {
    const newEditMode = !isEditing;
    setIsEditing(newEditMode);
    localStorage.setItem('muscle-map-edit-mode', String(newEditMode));
    if (newEditMode) {
      toast.success("Modo Editor ativado!");
    } else {
      toast.info("Modo Editor desativado");
    }
  };

  const handleSavePositions = () => {
    localStorage.setItem(storageKey, JSON.stringify(labels));
    toast.success("Posições salvas! (O salvamento é automático)");
  };

  const handleResetPositions = () => {
    const defaultLabels = view === "front" ? frontLabels : backLabels;
    setLabels(defaultLabels);
    localStorage.removeItem(storageKey);
    setLabelSize(14);
    setLineWidth(40);
    localStorage.removeItem(globalSettingsKey);
    toast.success("Posições e ajustes resetados!");
  };

  const handleFlipSide = (muscle: string) => {
    setLabels(prev => prev.map(label => 
      label.muscle === muscle 
        ? { ...label, side: label.side === "left" ? "right" : "left" }
        : label
    ));
  };

  const handleFlipPointSide = (muscle: string) => {
    setLabels(prev => prev.map(label => {
      if (label.muscle === muscle) {
        const currentPointSide = label.pointSide || label.side;
        return { ...label, pointSide: currentPointSide === "left" ? "right" : "left" };
      }
      return label;
    }));
  };

  const handleToggleLineType = (muscle: string) => {
    setLabels(prev => prev.map(label => 
      label.muscle === muscle 
        ? { ...label, lineType: label.lineType === "angled" ? "straight" : "angled" }
        : label
    ));
  };

  const handleToggleLabel = (muscle: string) => {
    setLabels(prev => prev.map(label => 
      label.muscle === muscle 
        ? { ...label, hideLabel: !label.hideLabel }
        : label
    ));
  };

  const handleToggleLine = (muscle: string) => {
    setLabels(prev => prev.map(label => 
      label.muscle === muscle 
        ? { ...label, hideLine: !label.hideLine }
        : label
    ));
  };

  const handleDragStart = (e: React.MouseEvent, muscle: string) => {
    if (!isEditing) return;
    e.preventDefault();
    setDraggedLabel(muscle);
    
    const label = labels.find(l => l.muscle === muscle);
    if (!label) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isEditing || !draggedLabel) return;
    
    const container = document.getElementById('muscle-map-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const topPercent = ((e.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;
    const leftPercent = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    setLabels(prev => prev.map(label => 
      label.muscle === draggedLabel
        ? { 
            ...label, 
            top: `${Math.max(0, Math.min(100, topPercent))}%`,
            ...(label.side === "left" 
              ? { left: `${Math.max(0, Math.min(50, leftPercent))}%` }
              : { right: `${Math.max(0, Math.min(50, 100 - leftPercent))}%` }
            )
          }
        : label
    ));
  };

  const handleDragEnd = () => {
    if (draggedLabel) {
      localStorage.setItem(storageKey, JSON.stringify(labels));
    }
    setDraggedLabel(null);
  };

  const handleLabelClick = (muscle: string) => {
    if (isEditing) return;
    
    const label = labels.find(l => l.muscle === muscle);
    const muscleName = label ? label.name.toLowerCase() : muscle;
    
    navigate(`/workouts/muscle/${muscleName}`);
  };

  const getMuscleName = (muscle: string) => {
    const label = labels.find(l => l.muscle === muscle);
    return label ? label.name : muscle;
  };

  const getMuscleColor = (muscle: string) => {
    return muscleColorMap[muscle] || getDefaultMuscleColor();
  };

  const handleIncreaseFontSize = (muscle: string) => {
    setLabels(prev => prev.map(label => 
      label.muscle === muscle 
        ? { ...label, fontSize: (label.fontSize || labelSize) + 1 }
        : label
    ));
  };

  const handleDecreaseFontSize = (muscle: string) => {
    setLabels(prev => prev.map(label => 
      label.muscle === muscle 
        ? { ...label, fontSize: Math.max(10, (label.fontSize || labelSize) - 1) }
        : label
    ));
  };

  const handleIncreaseLineWidth = (muscle: string) => {
    setLabels(prev => prev.map(label => 
      label.muscle === muscle 
        ? { ...label, lineWidth: (label.lineWidth || lineWidth) + 5 }
        : label
    ));
  };

  const handleDecreaseLineWidth = (muscle: string) => {
    setLabels(prev => prev.map(label => 
      label.muscle === muscle 
        ? { ...label, lineWidth: Math.max(20, (label.lineWidth || lineWidth) - 5) }
        : label
    ));
  };

  const handleToggleLabelEdit = (muscle: string, e: React.MouseEvent) => {
    if (!isEditing) return;
    e.stopPropagation();
    setEditingLabel(editingLabel === muscle ? null : muscle);
  };

  const handleAddLabel = () => {
    if (!newLabelData.name.trim() || !newLabelData.muscle.trim()) {
      toast.error("Preencha nome e identificador do músculo");
      return;
    }

    const newLabel: MuscleLabel = {
      name: newLabelData.name,
      muscle: newLabelData.muscle.toLowerCase().replace(/\s+/g, '_'),
      side: newLabelData.side,
      top: "50%",
      fontSize: labelSize,
      lineWidth: lineWidth
    };

    setLabels(prev => [...prev, newLabel]);
    setNewLabelData({ name: "", muscle: "", side: "left" });
    setShowAddDialog(false);
    toast.success("Label adicionado!");
  };

  const handleRemoveLabel = (muscle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLabels(prev => prev.filter(label => label.muscle !== muscle));
    setEditingLabel(null);
    toast.success("Label removido!");
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-0 gap-2">
      {/* Edit Controls */}
      <div className="flex gap-2 flex-wrap justify-center px-2">
        <Button 
          variant={isEditing ? "default" : "outline"} 
          size="sm"
          className={`gap-2 text-xs sm:text-sm ${isEditing ? 'animate-pulse' : ''}`}
          onClick={toggleEditMode}
        >
          <Edit2 className="w-4 h-4" />
          {isEditing ? "Modo Editor Ativo" : "🎨 Ativar Modo Editor"}
        </Button>

        {isEditing && (
          <>
            <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm" onClick={handleSavePositions}>
              <Save className="w-4 h-4" />
              Salvar Posições
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={handleResetPositions}>
              Resetar
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm" onClick={() => setShowAddDialog(true)}>
              <PlusCircle className="w-4 h-4" />
              Adicionar Label
            </Button>
          </>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm">
              <Settings className="w-4 h-4" />
              Ajustes Globais
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label-size">Tamanho do Texto Padrão: {labelSize}px</Label>
                <Slider
                  id="label-size"
                  min={10}
                  max={24}
                  step={1}
                  value={[labelSize]}
                  onValueChange={(value) => setLabelSize(value[0])}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="line-width">Largura da Linha Padrão: {lineWidth}px</Label>
                <Slider
                  id="line-width"
                  min={20}
                  max={100}
                  step={5}
                  value={[lineWidth]}
                  onValueChange={(value) => setLineWidth(value[0])}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {isEditing && (
        <Card className="bg-primary/5 border-primary/20 p-4 max-w-2xl">
          <div className="text-sm space-y-2">
            <p className="font-semibold text-primary flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Como usar o Modo Editor:
            </p>
            <ul className="space-y-1 text-muted-foreground ml-4">
              <li>• <strong>Arrastar:</strong> Clique e segure em qualquer label para mover</li>
              <li>• <strong>Editar:</strong> Clique no label para abrir controles</li>
              <li>• <strong>Auto-save:</strong> As posições são salvas automaticamente</li>
            </ul>
          </div>
        </Card>
      )}

      <div
        id="muscle-map-container"
        className="relative w-full max-w-[600px] flex items-center justify-center"
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Glow Background Effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[300px] h-[500px] bg-gradient-radial from-primary/10 via-primary/5 to-transparent blur-3xl opacity-60" />
        </div>

        {/* Body Image with enhanced styling */}
        <div className="relative flex items-center justify-center transition-all duration-300 ease-in-out">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent blur-2xl" />
          <img
            src={view === "front" ? bodyFrontWorkout : bodyBackWorkout}
            alt={view === "front" ? "Vista frontal do corpo" : "Vista traseira do corpo"}
            className="w-[200px] sm:w-[250px] md:w-[280px] h-auto object-contain transition-all duration-300 drop-shadow-2xl"
            style={{ maxHeight: "600px", filter: "drop-shadow(0 0 20px rgba(var(--primary), 0.15))" }}
          />
        </div>

        {/* Muscle Labels with Animations */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {labels.map((label, index) => {
            const colors = getMuscleColor(label.muscle);
            const isSelected = selectedMuscle === label.muscle;
            
            return (
              <motion.div
                key={label.muscle}
                initial={{ opacity: 0, x: label.side === "left" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                className={`absolute pointer-events-auto ${
                  !label.left && !label.right ? (label.side === "left" ? "left-0" : "right-0") : ""
                } ${isEditing ? "cursor-move" : "cursor-pointer"} group ${
                  draggedLabel === label.muscle ? "z-50 opacity-80 scale-110" : ""
                } ${editingLabel === label.muscle ? "z-50" : ""}`}
                style={{ 
                  top: label.top,
                  left: label.side === "left" && label.left ? label.left : undefined,
                  right: label.side === "right" && label.right ? label.right : undefined
                }}
                onClick={(e) => isEditing ? handleToggleLabelEdit(label.muscle, e) : handleLabelClick(label.muscle)}
                onMouseDown={(e) => isEditing && handleDragStart(e, label.muscle)}
                whileHover={!isEditing ? { scale: 1.05 } : {}}
                whileTap={!isEditing ? { scale: 0.98 } : {}}
              >
                <div className="space-y-1">
                  <div className={`flex items-center ${label.side === "left" ? "flex-row" : "flex-row-reverse"} gap-2`}>
                    {/* Enhanced Label with Glassmorphism */}
                    {!label.hideLabel && (
                      <div
                        className={`
                          relative px-3 py-1.5 rounded-xl whitespace-nowrap
                          bg-gradient-to-r ${colors.bg}
                          backdrop-blur-md border ${colors.border}
                          shadow-lg ${isSelected ? `shadow-xl ${colors.glow}` : 'shadow-black/5'}
                          transition-all duration-300 ease-out
                          ${label.side === "left" ? "text-left" : "text-right"}
                          ${isSelected 
                            ? `ring-2 ring-primary/50 ${colors.text} font-bold` 
                            : `${colors.text} font-medium group-hover:ring-2 group-hover:ring-primary/30 group-hover:shadow-lg`
                          }
                          ${isEditing && editingLabel === label.muscle ? "ring-2 ring-primary animate-pulse" : ""}
                        `}
                        style={{ fontSize: `${label.fontSize || labelSize}px` }}
                      >
                        {/* Shine effect on selected */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse rounded-xl" />
                        )}
                        <span className="relative z-10">{label.name}</span>
                      </div>
                    )}

                    {/* Enhanced Connector Line */}
                    {!label.hideLine && (
                      <div className={`relative flex items-center ${
                        (label.pointSide || label.side) !== label.side ? "flex-row-reverse" : ""
                      }`}>
                        {label.lineType === "angled" ? (
                          <svg 
                            width={label.lineWidth || lineWidth} 
                            height="24" 
                            className="overflow-visible"
                            style={{ 
                              transform: (label.pointSide || label.side) === "left" ? "scaleX(-1)" : "none"
                            }}
                          >
                            {/* Glow effect for line */}
                            <path
                              d={`M 0,12 L ${((label.lineWidth || lineWidth) * 0.6)},12 L ${(label.lineWidth || lineWidth)},0`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              className={`${isSelected ? "text-primary/30" : "text-transparent"} transition-colors duration-300`}
                            />
                            {/* Main line */}
                            <path
                              d={`M 0,12 L ${((label.lineWidth || lineWidth) * 0.6)},12 L ${(label.lineWidth || lineWidth)},0`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              className={`${
                                isSelected ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary"
                              } transition-colors duration-300`}
                            />
                            {/* Endpoint circle with glow */}
                            <circle
                              cx={(label.lineWidth || lineWidth)}
                              cy="0"
                              r="5"
                              className={`${
                                isSelected ? "fill-primary/30" : "fill-transparent"
                              } transition-all duration-300`}
                            />
                            <circle
                              cx={(label.lineWidth || lineWidth)}
                              cy="0"
                              r="3"
                              className={`${
                                isSelected ? "fill-primary" : "fill-muted-foreground/60 group-hover:fill-primary"
                              } transition-all duration-300`}
                            />
                          </svg>
                        ) : (
                          <>
                            {/* Straight line with glow */}
                            <div className="relative">
                              {isSelected && (
                                <div 
                                  className="absolute h-[4px] bg-primary/30 blur-sm -top-[1.5px]"
                                  style={{ width: `${label.lineWidth || lineWidth}px` }}
                                />
                              )}
                              <div
                                className={`h-[1.5px] ${
                                  isSelected ? "bg-primary" : "bg-muted-foreground/50 group-hover:bg-primary"
                                } transition-all duration-300`}
                                style={{ width: `${label.lineWidth || lineWidth}px` }}
                              />
                            </div>
                            {/* Endpoint with glow */}
                            <div className="relative">
                              {isSelected && (
                                <div className="absolute w-4 h-4 -left-1 -top-1 bg-primary/30 rounded-full blur-sm animate-pulse" />
                              )}
                              <div
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                  isSelected 
                                    ? "bg-primary shadow-lg shadow-primary/50" 
                                    : "bg-muted-foreground/50 group-hover:bg-primary group-hover:shadow-md"
                                }`}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Edit Controls */}
                  {isEditing && editingLabel === label.muscle && (
                    <Card className="p-3 mt-2 shadow-xl z-50 bg-background/95 backdrop-blur-lg border-2 border-primary/30">
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-primary mb-2">Controles de Edição</div>
                        <div className="flex gap-1 items-center flex-wrap">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 px-3"
                            onClick={(e) => handleRemoveLabel(label.muscle, e)}
                            title="Remover label"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Remover
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFlipSide(label.muscle);
                            }}
                            title="Inverter lado do label"
                          >
                            <ArrowLeftRight className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFlipPointSide(label.muscle);
                            }}
                            title="Inverter lado do ponto"
                          >
                            <ArrowLeftRight className="w-3 h-3" />
                            <span className="text-[10px]">P</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLineType(label.muscle);
                            }}
                            title={`Tipo de linha: ${label.lineType === "angled" ? "Ângulo" : "Reta"}`}
                          >
                            <GitBranch className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={label.hideLine ? "default" : "ghost"}
                            className="h-7 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLine(label.muscle);
                            }}
                            title={label.hideLine ? "Mostrar linha" : "Ocultar linha"}
                          >
                            <Slash className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={label.hideLabel ? "default" : "ghost"}
                            className="h-7 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLabel(label.muscle);
                            }}
                            title={label.hideLabel ? "Mostrar label" : "Ocultar label"}
                          >
                            <Type className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        {/* Font Size Controls */}
                        <div className="flex gap-2 items-center justify-between bg-muted/50 p-2 rounded-lg border border-border">
                          <span className="text-xs font-medium flex items-center gap-1">
                            <Type className="w-3 h-3" />
                            Texto
                          </span>
                          <div className="flex gap-1 items-center">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDecreaseFontSize(label.muscle);
                              }}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-semibold px-2 min-w-[30px] text-center">
                              {label.fontSize || labelSize}px
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIncreaseFontSize(label.muscle);
                              }}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Line Width Controls */}
                        <div className="flex gap-2 items-center justify-between bg-muted/50 p-2 rounded-lg border border-border">
                          <span className="text-xs font-medium flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            Linha
                          </span>
                          <div className="flex gap-1 items-center">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDecreaseLineWidth(label.muscle);
                              }}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-semibold px-2 min-w-[30px] text-center">
                              {label.lineWidth || lineWidth}px
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIncreaseLineWidth(label.muscle);
                              }}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Exercise Modal */}
      <Dialog open={showExercises} onOpenChange={setShowExercises}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Exercícios para {selectedMuscleForExercises && getMuscleName(selectedMuscleForExercises)}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 pr-2">
            {selectedMuscleForExercises && (
              <ExerciseList muscle={selectedMuscleForExercises as any} searchQuery="" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Label Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Label</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="label-name">Nome do Músculo</Label>
              <Input
                id="label-name"
                placeholder="Ex: Deltoides"
                value={newLabelData.name}
                onChange={(e) => setNewLabelData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label-muscle">Identificador (usado para exercícios)</Label>
              <Input
                id="label-muscle"
                placeholder="Ex: deltoids"
                value={newLabelData.muscle}
                onChange={(e) => setNewLabelData(prev => ({ ...prev, muscle: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Lado Inicial</Label>
              <div className="flex gap-2">
                <Button
                  variant={newLabelData.side === "left" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewLabelData(prev => ({ ...prev, side: "left" }))}
                >
                  Esquerda
                </Button>
                <Button
                  variant={newLabelData.side === "right" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewLabelData(prev => ({ ...prev, side: "right" }))}
                >
                  Direita
                </Button>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddLabel}>
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
