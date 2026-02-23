import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useCreateCheckoutSession } from '../hooks/useCreateCheckoutSession';
import { Crown, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SubscriptionCard() {
  const { data: userProfile } = useGetCallerUserProfile();
  const createCheckoutSession = useCreateCheckoutSession();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const isPremium = userProfile?.isPremium || false;

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const session = await createCheckoutSession.mutateAsync([
        {
          productName: 'Premium Subscription',
          productDescription: 'Unlock unlimited uploads and full AI features',
          priceInCents: BigInt(6900),
          currency: 'inr',
          quantity: BigInt(1),
        },
      ]);
      if (!session?.url) throw new Error('Stripe session missing url');
      window.location.href = session.url;
    } catch (error) {
      console.error('Upgrade error:', error);
      setIsUpgrading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Free Tier</h3>
          <p className="text-3xl font-bold">₹0</p>
        </div>
        <ul className="space-y-3 mb-6">
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-muted-foreground" />
            5 uploads per month
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-muted-foreground" />
            Basic AI features
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-muted-foreground" />
            Study groups
          </li>
        </ul>
        {!isPremium && (
          <div className="px-4 py-2 rounded-lg bg-muted text-center text-sm font-medium">
            Current Plan
          </div>
        )}
      </div>

      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary via-chart-1 to-chart-2 text-white shadow-xl">
        {isPremium && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Active
          </div>
        )}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Premium
          </h3>
          <p className="text-3xl font-bold">₹69</p>
          <p className="text-sm opacity-90">per month</p>
        </div>
        <ul className="space-y-3 mb-6">
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4" />
            Unlimited uploads
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4" />
            Full AI capabilities
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4" />
            Priority support
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4" />
            Advanced analytics
          </li>
        </ul>
        {!isPremium && (
          <button
            onClick={handleUpgrade}
            disabled={isUpgrading}
            className="w-full py-3 rounded-lg bg-white text-primary font-medium hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isUpgrading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Upgrade to Premium'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
