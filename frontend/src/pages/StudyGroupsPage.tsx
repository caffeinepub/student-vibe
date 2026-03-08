import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateStudyGroup } from '../hooks/useCreateStudyGroup';
import { Users, Plus, Loader2 } from 'lucide-react';

export default function StudyGroupsPage() {
  const navigate = useNavigate();
  const createGroup = useCreateStudyGroup();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const groupId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const group = await createGroup.mutateAsync({
      id: groupId,
      name: groupName,
      description: groupDescription,
    });

    setShowCreateForm(false);
    setGroupName('');
    setGroupDescription('');
    navigate({ to: `/groups/${group.id}` });
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Study Groups</h1>
          <p className="text-muted-foreground">Collaborate with peers and share knowledge</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary via-chart-1 to-chart-2 text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Create Group
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-8 p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-xl font-bold mb-4">Create New Study Group</h2>
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium mb-2">
                Group Name
              </label>
              <input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., CS Semester 3 Study Group"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="groupDescription" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="groupDescription"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Describe the purpose of this study group..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createGroup.isPending}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-primary via-chart-1 to-chart-2 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {createGroup.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Group'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No study groups yet. Create one to get started!</p>
      </div>
    </div>
  );
}
