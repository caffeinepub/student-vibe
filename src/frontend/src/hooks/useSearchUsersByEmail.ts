import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';
import { useState, useEffect } from 'react';

export function useSearchUsersByEmail(searchTerm: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return useQuery<UserProfile[]>({
    queryKey: ['searchUsers', debouncedSearchTerm],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!debouncedSearchTerm.trim()) return [];
      return actor.searchUsersByEmail(debouncedSearchTerm);
    },
    enabled: !!actor && !actorFetching && debouncedSearchTerm.trim().length > 0,
    retry: false,
  });
}
