import { useNavigate } from '@tanstack/react-router';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>

        <h1 className="text-4xl font-bold mb-4">Payment Failed</h1>

        <p className="text-lg text-muted-foreground mb-8">
          We couldn't process your payment. Please try again or contact support if the issue persists.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary via-chart-1 to-chart-2 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-8 py-3 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
