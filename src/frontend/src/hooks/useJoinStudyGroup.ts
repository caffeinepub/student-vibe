import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useJoinStudyGroup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.joinStudyGroup(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyGroups'] });
      queryClient.invalidateQueries({ queryKey: ['studyGroup'] });
    },
  });
}
