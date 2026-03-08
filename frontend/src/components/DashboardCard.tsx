import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  gradient?: string;
}

export default function DashboardCard({ title, description, icon: Icon, onClick, gradient }: DashboardCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 text-left overflow-hidden"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${gradient || 'bg-gradient-to-br from-primary to-chart-1'}`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${gradient || 'bg-gradient-to-br from-primary to-chart-1'} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}
