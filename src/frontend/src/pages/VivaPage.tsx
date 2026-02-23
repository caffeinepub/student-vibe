import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function VivaPage() {
  const { subject } = useParams({ from: '/viva/$subject' });
  const navigate = useNavigate();

  return (
    <div className="container py-8 max-w-4xl">
      <button
        onClick={() => navigate({ to: '/browse' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Browse
      </button>

      <div className="p-8 rounded-2xl bg-card border border-border text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Viva Questions for {subject}</h2>
        <p className="text-muted-foreground mb-6">
          Viva question generation requires premium subscription and external AI service integration.
          This feature will generate 10-15 oral exam practice questions.
        </p>
        <button
          onClick={() => navigate({ to: '/browse' })}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary via-chart-1 to-chart-2 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Browse More Notes
        </button>
      </div>
    </div>
  );
}
