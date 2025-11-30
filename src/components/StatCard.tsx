import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  variant?: "fitness" | "nutrition" | "default";
  className?: string;
}

export function StatCard({ icon, title, value, variant = "default", className }: StatCardProps) {
  const variantClasses = {
    fitness: "glass-card border-primary/20 hover:border-primary/30 transition-smooth",
    nutrition: "glass-card border-secondary/20 hover:border-secondary/30 transition-smooth",
    default: "glass-card border-border hover:border-muted-foreground/30 transition-smooth"
  };

  const iconClasses = {
    fitness: "text-primary",
    nutrition: "text-secondary",
    default: "text-muted-foreground"
  };

  return (
    <Card className={cn(variantClasses[variant], className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={iconClasses[variant]}>
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">{value}</h3>
            <p className="text-xs text-muted-foreground">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}