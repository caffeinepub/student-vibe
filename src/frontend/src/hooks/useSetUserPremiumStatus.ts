import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';

export function useSetUserPremiumStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, isPremium }: { principal: string; isPremium: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      const principalObj = Principal.fromText(principal);
      return actor.setUserPremiumStatus(principalObj, isPremium);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
