import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { QuizQuestion } from '../backend';

export function useSaveQuiz() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, questions }: { id: string; questions: QuizQuestion[] }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveQuiz(id, questions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
    },
  });
}
