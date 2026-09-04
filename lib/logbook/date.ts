export type DateRange = {
  from: string;
  to: string;
};

export const GOAL_EDIT_WINDOW_DAYS = 5; // days 1–5 editable/reviewable

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isDateKey(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function monthKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function nextMonthDate(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);
  const nextMonth = monthNumber === 12 ? 1 : monthNumber + 1;
  const nextYear = monthNumber === 12 ? year + 1 : year;
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;
}

export function addDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function getRollingYearRange(): DateRange {
  const to = new Date();
  const from = new Date(to);
  from.setFullYear(to.getFullYear() - 1);
  from.setDate(from.getDate() + 1);
  return { from: toDateKey(from), to: toDateKey(to) };
}

export function getMonthlyGoalWindows(date: Date) {
  const day = date.getDate();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return {
    canEditGoal: day <= 3,
    canMarkAchieved: day <= 3 || day > daysInMonth - 3,
  };
}

export function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function getPreviousMonthKey(date: Date): string {
  return toMonthKey(new Date(date.getFullYear(), date.getMonth() - 1, 1));
}

/**
 * Pure function, no hooks — easy to unit test.
 * needsReview: previous month's goal exists and hasn't been decided yet.
 * canEditGoal: writing window is open, review is clear, and nothing's written yet.
 */
export function getGoalWindowState(
  now: Date,
  previousGoal: { achieved: boolean | null } | null | undefined,
  currentGoal: { goalText: string } | null | undefined,
) {
  const isWithinEditWindow = now.getDate() <= GOAL_EDIT_WINDOW_DAYS;
  const needsReview = Boolean(previousGoal) && previousGoal!.achieved === null;
  return {
    needsReview,
    canEditGoal: isWithinEditWindow && !needsReview && !currentGoal?.goalText,
  };
}

// API route util function to parse date consistently
export const dateKeyRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export function dateKeyToDate(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

export function dateToDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
} 