import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Note, StudyGroup, Quiz, VivaQuestion, UserProfile } from '../backend';

export function useNotesBySubject(subject: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Note[]>({
    queryKey: ['notes', subject],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotesBySubject(subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useGetNote(noteId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Note | null>({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNote(noteId);
    },
    enabled: !!actor && !isFetching && !!noteId,
  });
}

export function useGetStudyGroup(groupId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<StudyGroup | null>({
    queryKey: ['studyGroup', groupId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudyGroup(groupId);
    },
    enabled: !!actor && !isFetching && !!groupId,
  });
}

export function useGetQuiz(quizId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Quiz | null>({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getQuiz(quizId);
    },
    enabled: !!actor && !isFetching && !!quizId,
  });
}

export function useGetVivaQuestions(subject: string) {
  const { actor, isFetching } = useActor();

  return useQuery<VivaQuestion[]>({
    queryKey: ['vivaQuestions', subject],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVivaQuestions(subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}
