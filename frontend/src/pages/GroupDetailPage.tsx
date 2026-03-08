import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetStudyGroup } from '../hooks/useQueries';
import { ArrowLeft, Users } from 'lucide-react';

export default function GroupDetailPage() {
  const { groupId } = useParams({ from: '/groups/$groupId' });
  const navigate = useNavigate();
  const { data: group, isLoading } = useGetStudyGroup(groupId);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Group not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <button
        onClick={() => navigate({ to: '/groups' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Groups
      </button>

      <div className="p-8 rounded-2xl bg-card border border-border">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary to-chart-1">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
            <p className="text-muted-foreground">{group.description}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Members ({group.members.length})</h2>
          <div className="space-y-2">
            {group.members.map((member, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted">
                <p className="text-sm font-mono">{member.toString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
