import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import DashboardCard from '../components/DashboardCard';
import HeroSection from '../components/HeroSection';
import SubscriptionCard from '../components/SubscriptionCard';
import { Upload, BookOpen, Users, Sparkles, Crown } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();

  const dashboardItems = [
    {
      title: 'Upload Notes',
      description: 'Share your college notes with the community',
      icon: Upload,
      onClick: () => navigate({ to: '/upload' }),
      gradient: 'bg-gradient-to-br from-chart-1 to-chart-2',
    },
    {
      title: 'Browse Notes',
      description: 'Discover and download notes from other students',
      icon: BookOpen,
      onClick: () => navigate({ to: '/browse' }),
      gradient: 'bg-gradient-to-br from-primary to-chart-1',
    },
    {
      title: 'Study Groups',
      description: 'Collaborate with peers in study groups',
      icon: Users,
      onClick: () => navigate({ to: '/groups' }),
      gradient: 'bg-gradient-to-br from-chart-2 to-chart-3',
    },
    {
      title: 'AI Features',
      description: 'Generate summaries, quizzes, and viva questions',
      icon: Sparkles,
      onClick: () => navigate({ to: '/browse' }),
      gradient: 'bg-gradient-to-br from-chart-4 to-chart-5',
    },
  ];

  return (
    <div className="container py-8 space-y-8">
      <HeroSection />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {userProfile?.name || 'Student'}!
          </h2>
          <p className="text-muted-foreground">
            {userProfile?.isPremium ? (
              <span className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-chart-1" />
                Premium Member
              </span>
            ) : (
              'Free Tier'
            )}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item) => (
          <DashboardCard key={item.title} {...item} />
        ))}
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Subscription Plans</h3>
        <SubscriptionCard />
      </div>
    </div>
  );
}
