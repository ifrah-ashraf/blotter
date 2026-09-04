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
// const mockEntries: LogEntry[] = [
//   {
//     date: '2024-01-15',
//     intensity: 3,
//     dsa: 'Solved binary tree problems',
//     development: 'Built a React component',
//     other: 'Practiced calculus',
//     createdAt: '2024-01-15T12:00:00.000Z',
//     updatedAt: '2024-01-15T12:00:00.000Z',
//   },
//   {
//     date: '2024-01-16',
//     intensity: 4,
//     dsa: 'Graph algorithms',
//     development: 'API integration',
//     other: 'Linear algebra',
//     createdAt: '2024-01-16T12:00:00.000Z',
//     updatedAt: '2024-01-16T12:00:00.000Z',
//   },
// ];

const mockGoal: MonthlyGoal = {
  id: 'goal-2026-08',
  month: '2026-08',
  goalText: 'Complete 30 days of coding shoding',
  achieved: null,
  created_at: '2026-08-30T00:00:00.000Z',
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
  return ['/api/daily-logs', date] as const;
};

export const getGetSummaryQueryKey = () => {
  return ['/api/summary'] as const;
};

export const getGetGoalQueryKey = (monthKey: string) => {
  return ['/api/goals', monthKey] as const;
};


// export function useListEntries(params?: ListEntriesParams) {
//   return useQuery({
//     queryKey: getListEntriesQueryKey(params),
//     queryFn: async () => mockEntries,
//   });
// }

// to fetch single day log
export function useGetEntry(date: string) {
  return useQuery({
    queryKey: getGetEntryQueryKey(date),
    queryFn: async () => {
      const res = await fetch(`/api/daily-logs?date=${date}`);
      if (!res.ok) throw new Error("Failed to fetch entry");
      return res.json() as Promise<LogEntry | null>;
    },
    enabled: !!date,
  });
}
// to post daily log
export function useCreateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LogEntry) => {
      const res = await fetch("/api/daily-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: input.date,
          dsa: input.dsa,
          development: input.development,
          mathsOther: input.mathsOther,
          dayIntensity: input.dayIntensity,
        }),
      });

      if (!res.ok) throw new Error("Failed to save entry");
      return res.json() as Promise<LogEntry>;
    },
    onSuccess: (entry) => {
      // Directly update the cache for that date
      queryClient.setQueryData(
        getGetEntryQueryKey(entry.date),
        entry
      );
    },
  });
}

export function useGetSummary() {
  return useQuery({
    queryKey: getGetSummaryQueryKey(),
    queryFn: async () => mockSummary,
  });
}

// useGetGoal
export function useGetGoal(monthKey: string) {
  return useQuery({
    queryKey: getGetGoalQueryKey(monthKey),
    queryFn: () => fetch(`/api/goals?month=${monthKey}`).then((r) => r.json())
  })
}


// useCreateGoal
export function useCreateGoal(monthKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { text: string }) => {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: monthKey, goalText: input.text })
      })

      if (!res.ok) throw new Error("Failed to save goal");
      return res.json() as Promise<MonthlyGoal>;
    },
    onSuccess: (goal) => {
      queryClient.setQueryData(getGetGoalQueryKey(monthKey), goal)
    }
  })
}

// update the last month Goal
export function useUpdateGoalAchieved(monthKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, achieved }: { id: string; achieved: boolean }) => {
      const res = await fetch(`/api/goals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achieved }),
      });
      if (!res.ok) throw new Error("Failed to update goal");
      return res.json() as Promise<MonthlyGoal>;
    },
    onSuccess: () => {
      // Fix: Invalidate the list query so it refetches the updated array
      queryClient.invalidateQueries({
        queryKey: getGetGoalQueryKey(monthKey)
      });
    },
  });
}

