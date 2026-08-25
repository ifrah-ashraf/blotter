export type EntryIntensity = 1 | 2 | 3 | 4;

export type LogEntry = {
  date: string;
  intensity: EntryIntensity;
  dsa: string;
  development: string;
  other: string;
  createdAt: string;
  updatedAt: string;
};

export type LogEntryInput = {
  date: string;
  intensity: EntryIntensity;
  dsa: string;
  development: string;
  other: string;
};

// export type MonthlyGoal = {
//   month: string;
//   text: string;
//   locked: boolean;
//   resetDate: string;
// };

export type LogbookSummary = {
  currentStreak: number;
  activeDays: number;
  totalEntries: number;
  averageIntensity: number;
  lastLoggedDate: string | null;
};

export type LogbookState = {
  entries: LogEntry[];
  goals: Record<string, MonthlyGoal>;
};

export function isEntryIntensity(value: unknown): value is EntryIntensity {
  return value === 1 || value === 2 || value === 3 || value === 4;
}

// API schema for different component
export type MonthlyGoal = {
  id: string ;
  month: string ;
  text: string ;
  created_at?: string ;
  updated_at?: string ;
};

// API Response structure
export type GoalsResponse = {
  month: string;
  goals: MonthlyGoal[];
};