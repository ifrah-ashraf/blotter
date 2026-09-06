import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {  LogEntry, MonthlyGoal } from '@/lib/logbook/types';
import { useRouter } from 'next/navigation';

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

export const getListGoalsQueryKey = () => {
  return ['/api/goals/all'] as const ;
}

export const getListLogsQueryKey = () => {
  return ['/api/daily-logs/all'] as const ;
}


// to fetch single day log
export function useGetEntry(date: string) {
  return useQuery({
    queryKey: getGetEntryQueryKey(date),
    queryFn: async () => {
      const res = await fetch(`/api/daily-logs?date=${date}`);
      if (!res.ok) throw new Error("Failed to fetch entry");
      return res.json() as Promise<LogEntry | undefined>;
    },
    enabled: !!date,
  });
}
// to fetch all logs
export function useListLogs(){
  return useQuery({
    queryKey: getListLogsQueryKey() ,
    queryFn: () => fetch(`/api/daily-logs/all`).then((r) => r.json()) 
  })
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

// export function useGetSummary() {
//   return useQuery({
//     queryKey: getGetSummaryQueryKey(),
//     queryFn: async () => mockSummary,
//   });
// }

// useGetGoal using month key
export function useGetGoal(monthKey: string) {
  return useQuery({
    queryKey: getGetGoalQueryKey(monthKey),
    queryFn: () => fetch(`/api/goals?month=${monthKey}`).then((r) => r.json())
  })
}

// get all goals
export function useListGoals(){
  return useQuery({
    queryKey: getListGoalsQueryKey() ,
    queryFn: () => fetch(`/api/goals/all`).then((r) => r.json()) 
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

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Failed to log out");
    },
    onSuccess: () => {
      queryClient.clear(); // drop any cached write-mode data now that the session is gone
      router.push("/login");
      router.refresh();
    },
  });
}

