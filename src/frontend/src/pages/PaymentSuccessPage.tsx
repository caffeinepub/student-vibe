import { useNavigate } from '@tanstack/react-router';
import { CheckCircle, Crown } from 'lucide-react';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-chart-1">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
          Payment Successful!
        </h1>

        <p className="text-lg text-muted-foreground mb-8">
          Welcome to Student Vibe Premium! Your subscription has been activated.
        </p>

        <div className="p-6 rounded-2xl bg-card border border-border mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-6 w-6 text-chart-1" />
            <h2 className="text-xl font-semibold">Premium Benefits</h2>
          </div>
          <ul className="space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-chart-1" />
              Unlimited note uploads
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-chart-1" />
              Full AI capabilities
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-chart-1" />
              Priority support
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-chart-1" />
              Advanced analytics
            </li>
          </ul>
        </div>

        <button
          onClick={() => navigate({ to: '/' })}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary via-chart-1 to-chart-2 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
