import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useSaveVivaQuestions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subject, questions }: { subject: string; questions: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveVivaQuestions(subject, questions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vivaQuestions'] });
    },
  });
}
