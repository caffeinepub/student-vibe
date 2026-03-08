import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useCreateStudyGroup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description }: { id: string; name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createStudyGroup(id, name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyGroups'] });
    },
  });
}
