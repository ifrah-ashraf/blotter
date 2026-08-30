import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MonthlyGoal } from '@/lib/logbook/types'; 
// Types
export type EntryIntensity = 1 | 2 | 3 | 4;

export interface LogEntry {
  date: string;
  intensity: EntryIntensity;
  dsa: string;
  development: string;
  other: string;
}

export interface LogEntryInput {
  date: string;
  intensity: EntryIntensity;
  dsa: string;
  development: string;
  other: string;
}

export interface GoalInput {
  goal: string;
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
    other: 'Practiced calculus'
  },
  {
    date: '2024-01-16',
    intensity: 4,
    dsa: 'Graph algorithms',
    development: 'API integration',
    other: 'Linear algebra'
  }
];

// dummy data to mock goal
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
  averageIntensity: 3.2
};

// Helper function to simulate API delay this making the page feel slow
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Query keys
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

// Query hooks
export function useListEntries(params?: ListEntriesParams) {
  return useQuery({
    queryKey: getListEntriesQueryKey(params),
    queryFn: async () => {
      // await delay(0); // Simulate network delay
      return mockEntries;
    },
  });
}

export function useGetEntry(date: string) {
  return useQuery({
    queryKey: getGetEntryQueryKey(date),
    queryFn: async () => {
      //await delay(0); // mock function don't fill unecessary api delay
      const entry = mockEntries.find(e => e.date === date);
      if (!entry) throw new Error('Entry not found');
      return entry;
    },
    enabled: !!date,
  });
}

export function useGetSummary() {
  return useQuery({
    queryKey: getGetSummaryQueryKey(),
    queryFn: async () => {
      //await delay(0);
      return mockSummary;
    },
  });
}

export function useGetGoal() {
  return useQuery({
    queryKey: getGetGoalQueryKey(),
    queryFn: async () => {
      //await delay(0);
      return mockGoal;
    },
  });
}

// Mutation hooks
export function useCreateEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: LogEntryInput) => {
      //await delay(300);
      const newEntry: LogEntry = { ...input };
      mockEntries.push(newEntry);
      return newEntry;
    },
    onSuccess: (newEntry) => {
      // Update cache
      queryClient.setQueryData<LogEntry[]>(
        getListEntriesQueryKey(),
        (old) => old ? [...old, newEntry] : [newEntry]
      );
      queryClient.setQueryData(getGetEntryQueryKey(newEntry.date), newEntry);
    },
  });
}

export function useUpdateEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ date, data }: { date: string; data: LogEntryInput }) => {
      //await delay(0);
      const index = mockEntries.findIndex(e => e.date === date);
      if (index !== -1) {
        mockEntries[index] = { ...data, date };
        return mockEntries[index];
      }
      throw new Error('Entry not found');
    },
    onSuccess: (updatedEntry) => {
      // Update cache
      queryClient.setQueryData<LogEntry[]>(
        getListEntriesQueryKey(),
        (old) => old?.map(e => e.date === updatedEntry.date ? updatedEntry : e)
      );
      queryClient.setQueryData(getGetEntryQueryKey(updatedEntry.date), updatedEntry);
    },
  });
}

export function useDeleteEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (date: string) => {
      // await delay(0);
      const index = mockEntries.findIndex(e => e.date === date);
      if (index !== -1) {
        mockEntries.splice(index, 1);
      }
    },
    onSuccess: (_, date) => {
      // Update cache
      queryClient.setQueryData<LogEntry[]>(
        getListEntriesQueryKey(),
        (old) => old?.filter(e => e.date !== date)
      );
      queryClient.removeQueries({ queryKey: getGetEntryQueryKey(date) });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: GoalInput) => {
      // await delay(0);
      mockGoal.goal = input.goal;
      return mockGoal;
    },
    onSuccess: (updatedGoal) => {
      queryClient.setQueryData(getGetGoalQueryKey(), updatedGoal);
    },
  });
}

// add alongside useUpdateGoal
export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: GoalInput) => {
      const created: MonthlyGoal = { ...mockGoal, goal: input.goal };
      return created;
    },
    onSuccess: (goal) => {
      queryClient.setQueryData(getGetGoalQueryKey(), goal);
    },
  });
}