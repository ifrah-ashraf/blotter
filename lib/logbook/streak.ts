import { LogEntry } from "@/lib/logbook/types";

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateStreak(logs: LogEntry[]): number {
  if (!logs.length) return 0;

  // Normalize here — the only place that needs to know entry.date
  // might carry a full timestamp instead of a plain date key.
  const loggedDates = new Set(logs.map((entry) => entry.date.slice(0, 10)));

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!loggedDates.has(formatDate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (loggedDates.has(formatDate(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}