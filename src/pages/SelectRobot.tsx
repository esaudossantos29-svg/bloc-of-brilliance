import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { RobotSelector } from '@/components/RobotSelector';
import { useToast } from '@/hooks/use-toast';

const SelectRobot = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRobotSelect = (robotType: string) => {
    // Save selection to localStorage
    localStorage.setItem('nutriai-robot-type', robotType);
    
    toast({
      title: '✓ Robô selecionado!',
      description: 'Seu NutriAI foi atualizado com sucesso.',
    });

    // Navigate back to nutrition page
    setTimeout(() => {
      navigate('/nutrition');
    }, 500);
  };

  // Get current selection from localStorage
  const currentSelection = localStorage.getItem('nutriai-robot-type') || 'kawaii';

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <RobotSelector 
          onSelect={handleRobotSelect} 
          currentSelection={currentSelection}
        />
      </div>
    </Layout>
  );
};

export default SelectRobot;
