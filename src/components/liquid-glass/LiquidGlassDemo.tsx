import React, { useState } from 'react';
import { Home, User, Settings, Bell, Zap, Star, Heart } from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';
import { LiquidGlassNavbar } from './LiquidGlassNavbar';
import { LiquidGlassToggle } from './LiquidGlassToggle';
import { LiquidGlassTabs } from './LiquidGlassTabs';

export const LiquidGlassDemo: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { label: 'Início', icon: <Home className="w-4 h-4" />, onClick: () => {} },
    { label: 'Perfil', icon: <User className="w-4 h-4" />, onClick: () => {} },
    { label: 'Config', icon: <Settings className="w-4 h-4" />, onClick: () => {} },
  ];

  const tabs = [
    { id: 'home', label: 'Início', icon: <Home className="w-4 h-4" /> },
    { id: 'features', label: 'Recursos', icon: <Zap className="w-4 h-4" /> },
    { id: 'favorites', label: 'Favoritos', icon: <Star className="w-4 h-4" /> },
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Performance',
      description: 'Otimizado para velocidade máxima',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Qualidade',
      description: 'Design premium com atenção aos detalhes',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Experiência',
      description: 'Interface intuitiva e agradável',
    },
  ];

  return (
    <div className={`min-h-screen p-8 transition-colors duration-500 ${darkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400'}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-inter tracking-tight text-foreground mb-2">
            Liquid Glass UI
          </h1>
          <p className="text-foreground/70 font-inter tracking-tight">
            Componentes com efeito de vidro líquido e interações fluidas
          </p>
        </div>

        {/* Navbar Demo */}
        <section>
          <h2 className="text-sm font-medium text-foreground/60 mb-3 font-inter tracking-tight">
            BARRA DE NAVEGAÇÃO
          </h2>
          <LiquidGlassNavbar
            items={navItems}
            logo={
              <span className="font-bold text-lg font-inter tracking-tight">
                LiquidUI
              </span>
            }
          />
        </section>

        {/* Tabs Demo */}
        <section>
          <h2 className="text-sm font-medium text-foreground/60 mb-3 font-inter tracking-tight">
            MENU DE ABAS
          </h2>
          <LiquidGlassTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </section>

        {/* Toggle Demo */}
        <section>
          <h2 className="text-sm font-medium text-foreground/60 mb-3 font-inter tracking-tight">
            BOTÕES ALTERNÂNCIA
          </h2>
          <LiquidGlassCard className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-foreground/70" />
                  <span className="font-inter tracking-tight">Notificações</span>
                </div>
                <LiquidGlassToggle
                  checked={notifications}
                  onChange={setNotifications}
                  size="md"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-foreground/70" />
                  <span className="font-inter tracking-tight">Modo Escuro</span>
                </div>
                <LiquidGlassToggle
                  checked={darkMode}
                  onChange={setDarkMode}
                  size="md"
                />
              </div>
            </div>
          </LiquidGlassCard>
        </section>

        {/* Feature Cards Demo */}
        <section>
          <h2 className="text-sm font-medium text-foreground/60 mb-3 font-inter tracking-tight">
            CARTÕES DE RECURSO
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <LiquidGlassCard key={index} className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-xl bg-white/10 dark:bg-white/5">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold font-inter tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground/70 font-inter tracking-tight">
                    {feature.description}
                  </p>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </section>

        {/* Sizes Demo */}
        <section>
          <h2 className="text-sm font-medium text-foreground/60 mb-3 font-inter tracking-tight">
            TAMANHOS DE TOGGLE
          </h2>
          <LiquidGlassCard className="p-6">
            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <LiquidGlassToggle size="sm" checked />
                <span className="text-xs text-foreground/60 font-inter tracking-tight">
                  Pequeno
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LiquidGlassToggle size="md" checked />
                <span className="text-xs text-foreground/60 font-inter tracking-tight">
                  Médio
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LiquidGlassToggle size="lg" checked />
                <span className="text-xs text-foreground/60 font-inter tracking-tight">
                  Grande
                </span>
              </div>
            </div>
          </LiquidGlassCard>
        </section>
      </div>
    </div>
  );
};

export default LiquidGlassDemo;
