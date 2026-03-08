import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { User, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function UserProfileDisplay() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  if (!isAuthenticated || isLoading) {
    return null;
  }

  if (!userProfile) {
    return null;
  }

  const initials = userProfile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent/30 border border-border/40">
      <Avatar className="h-8 w-8 border-2 border-primary/50">
        <AvatarFallback className="bg-gradient-to-br from-primary to-chart-1 text-primary-foreground text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="hidden lg:flex flex-col">
        <span className="text-sm font-semibold text-foreground leading-tight">
          {userProfile.name}
        </span>
        <span className="text-xs text-muted-foreground leading-tight">
          {userProfile.college}
        </span>
      </div>
      {userProfile.isPremium && (
        <span className="hidden lg:inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-chart-1 to-chart-2 text-white">
          Premium
        </span>
      )}
    </div>
  );
}
