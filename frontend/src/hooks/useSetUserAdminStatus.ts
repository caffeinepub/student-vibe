import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';

export function useSetUserAdminStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, isAdmin }: { principal: string; isAdmin: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      const principalObj = Principal.fromText(principal);
      return actor.setUserAdminStatus(principalObj, isAdmin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['adminUserProfile'] });
    },
  });
}
