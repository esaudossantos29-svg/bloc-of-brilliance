import { Button } from "@/components/ui/button";
import { OnboardingData } from "../OnboardingFlow";
import workoutIcon from "@/assets/workout-icon.png";

interface StepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const Step1 = ({ nextStep }: StepProps) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-8 text-center animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Vamos começar</h1>
        <p className="text-lg text-muted-foreground">
          Primeiro, precisamos saber algumas informações sobre você para criar seu treino personalizado...
        </p>
      </div>

      <div className="py-8">
        <img 
          src={workoutIcon} 
          alt="Workout Icon" 
          className="w-48 h-48 mx-auto"
        />
      </div>

      <Button 
        onClick={nextStep}
        size="lg"
        className="w-full gradient-hero hover:opacity-90 transition-smooth"
      >
        Começar
      </Button>
    </div>
  );
};

export default Step1;
