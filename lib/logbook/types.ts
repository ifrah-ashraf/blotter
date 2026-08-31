import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { EntryIntensity, LogEntry, LogEntryInput, MonthlyGoal } from '@/lib/logbook/types';

export interface GoalInput {
  text: string;
}

export interface LogbookSummary {
  totalEntries: number;
  currentStreak: number;
  averageIntensity: number;
}

export interface ListEntriesParams {
  startDate?: string;
  endDate?: string;
}

// Mock data
const mockEntries: LogEntry[] = [
  {
    date: '2024-01-15',
    intensity: 3,
    dsa: 'Solved binary tree problems',
    development: 'Built a React component',
    other: 'Practiced calculus',
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
  },
  {
    date: '2024-01-16',
    intensity: 4,
    dsa: 'Graph algorithms',
    development: 'API integration',
    other: 'Linear algebra',
    createdAt: '2024-01-16T12:00:00.000Z',
    updatedAt: '2024-01-16T12:00:00.000Z',
  },
];

const mockGoal: MonthlyGoal = {
  id: 'goal-2026-08',
  month: '2026-08',
  text: 'Complete 30 days of coding shoding',
  achieved: null,
  created_at: '2026-08-30T00:00:00.000Z',
  updated_at: '2026-08-30T00:00:00.000Z',
};

const mockSummary: LogbookSummary = {
  totalEntries: 25,
  currentStreak: 5,
  averageIntensity: 3.2,
};

export const getListEntriesQueryKey = (params?: ListEntriesParams) => {
  return ['/api/entries', ...(params ? [params] : [])] as const;
};

export const getGetEntryQueryKey = (date: string) => {
  return [`/api/entries/${date}`] as const;
};

export const getGetSummaryQueryKey = () => {
  return ['/api/summary'] as const;
};

export const getGetGoalQueryKey = () => {
  return ['/api/goal'] as const;
};

export function useListEntries(params?: ListEntriesParams) {
  return useQuery({
    queryKey: getListEntriesQueryKey(params),
    queryFn: async () => mockEntries,
  });
}

export function useGetEntry(date: string) {
  return useQuery({
    queryKey: getGetEntryQueryKey(date),
    queryFn: async () => {
      const entry = mockEntries.find((e) => e.date === date);
      if (!entry) throw new Error('Entry not found');
      return entry;
    },
    enabled: !!date,
  });
}

export function useGetSummary() {
  return useQuery({
    queryKey: getGetSummaryQueryKey(),
    queryFn: async () => mockSummary,
  });
}

export function useGetGoal() {
  return useQuery({
    queryKey: getGetGoalQueryKey(),
    queryFn: async () => mockGoal,
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LogEntryInput) => {
      const now = new Date().toISOString();
      const newEntry: LogEntry = { ...input, createdAt: now, updatedAt: now };
      mockEntries.push(newEntry);
      return newEntry;
    },
    onSuccess: (newEntry) => {
      queryClient.setQueryData<LogEntry[]>(getListEntriesQueryKey(), (old) =>
        old ? [...old, newEntry] : [newEntry],
      );
      queryClient.setQueryData(getGetEntryQueryKey(newEntry.date), newEntry);
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: GoalInput) => {
      const now = new Date().toISOString();
      const created: MonthlyGoal = { ...mockGoal, text: input.text, created_at: now, updated_at: now };
      return created;
    },
    onSuccess: (goal) => {
      queryClient.setQueryData(getGetGoalQueryKey(), goal);
    },
  });
}