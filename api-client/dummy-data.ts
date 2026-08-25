import type { LogEntry } from "@/lib/logbook/types";

export const DUMMY_LOG_ENTRIES: LogEntry[] = [
  {
    date: "2026-06-15",
    intensity: 2,
    dsa: "Solved 3 binary search problems on LeetCode",
    development: "",
    other: "Read a chapter on system design fundamentals",
    createdAt: "2026-06-15T09:12:00.000Z",
    updatedAt: "2026-06-15T21:40:00.000Z",
  },
  {
    date: "2026-07-02",
    intensity: 4,
    dsa: "Grinded 6 DP problems, revisited knapsack variants",
    development: "Shipped the auth flow for The Blotter",
    other: "",
    createdAt: "2026-07-02T08:05:00.000Z",
    updatedAt: "2026-07-02T22:15:00.000Z",
  },
  {
    date: "2026-07-30",
    intensity: 1,
    dsa: "",
    development: "Fixed a Supabase RLS policy bug",
    other: "Low energy day, mostly recovery",
    createdAt: "2026-07-30T11:30:00.000Z",
    updatedAt: "2026-07-30T20:00:00.000Z",
  },
  {
    date: "2026-08-10",
    intensity: 3,
    dsa: "Two graph traversal problems (BFS/DFS)",
    development: "Built the activity heatmap year dropdown",
    other: "",
    createdAt: "2026-08-10T09:00:00.000Z",
    updatedAt: "2026-08-10T23:05:00.000Z",
  },
  {
    date: "2026-08-18",
    intensity: 2,
    dsa: "Reviewed sliding window pattern",
    development: "",
    other: "Applied to 4 quant dev roles",
    createdAt: "2026-08-18T10:20:00.000Z",
    updatedAt: "2026-08-18T19:45:00.000Z",
  },
  {
    date: "2026-08-21",
    intensity: 4,
    dsa: "Contest: solved 4/5 problems",
    development: "Refactored DayDetail component",
    other: "Gym in the morning",
    createdAt: "2026-08-21T07:50:00.000Z",
    updatedAt: "2026-08-21T22:30:00.000Z",
  },
  {
    date: "2026-08-24",
    intensity: 3,
    dsa: "",
    development: "Debugged toDateKey timezone edge case",
    other: "Mock interview practice",
    createdAt: "2026-08-24T09:15:00.000Z",
    updatedAt: "2026-08-24T21:00:00.000Z",
  },
  {
    date: "2026-08-25",
    intensity: 4,
    dsa: "Two heaps problems, revisited median finder",
    development: "Wired up dummy data for heatmap testing",
    other: "",
    createdAt: "2026-08-25T08:30:00.000Z",
    updatedAt: "2026-08-25T18:10:00.000Z",
  },
];


export const MONTHLY_GOAL_DUMMY_DATA = [
  {
    month: "2026-08",
    goals: [
      { id: "1", text: "Complete DSA course" },
      { id: "2", text: "Build 3 projects" },
      { id: "3", text: "Read system design book" }
    ]
  },
  {
    month: "2026-09",
    goals: [
      { id: "4", text: "Start contributing to open source" }
    ]
  },
  {
    month: "2026-10",
    goals: [
      { id: "5", text: "Prepare for interviews" },
      { id: "6", text: "Build portfolio website" }
    ]
  }
];