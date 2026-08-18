import { addDays, isDateKey, monthKey, nextMonthDate, toDateKey } from './date';
import type {
  LogbookState,
  LogEntry,
  LogEntryInput,
  LogbookSummary,
  MonthlyGoal,
} from './types';
import { isEntryIntensity } from './types';

export const LOGBOOK_STORAGE_KEY = 'the-blotter:logbook:v1';

export const EMPTY_LOGBOOK_STATE: LogbookState = {
  entries: [],
  goals: {},
};

let snapshot = readState();
const listeners = new Set<() => void>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseEntry(value: unknown): LogEntry | null {
  if (!isRecord(value)) return null;
  if (
    !isDateKey(value.date) ||
    !isEntryIntensity(value.intensity) ||
    typeof value.dsa !== 'string' ||
    typeof value.development !== 'string' ||
    typeof value.other !== 'string'
  ) {
    return null;
  }

  const now = new Date().toISOString();
  return {
    date: value.date,
    intensity: value.intensity,
    dsa: value.dsa,
    development: value.development,
    other: value.other,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : now,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : now,
  };
}

function parseGoal(value: unknown): MonthlyGoal | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.month !== 'string' ||
    typeof value.text !== 'string' ||
    typeof value.locked !== 'boolean' ||
    typeof value.resetDate !== 'string'
  ) {
    return null;
  }

  return {
    month: value.month,
    text: value.text,
    locked: value.locked,
    resetDate: value.resetDate,
  };
}

function readState(): LogbookState {
  if (typeof window === 'undefined') return EMPTY_LOGBOOK_STATE;

  try {
    const raw = window.localStorage.getItem(LOGBOOK_STORAGE_KEY);
    if (!raw) return EMPTY_LOGBOOK_STATE;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return EMPTY_LOGBOOK_STATE;

    const entries = Array.isArray(parsed.entries)
      ? parsed.entries.map(parseEntry).filter((entry): entry is LogEntry => Boolean(entry))
      : [];
    const goals: Record<string, MonthlyGoal> = {};

    if (isRecord(parsed.goals)) {
      for (const [key, value] of Object.entries(parsed.goals)) {
        const goal = parseGoal(value);
        if (goal) goals[key] = goal;
      }
    }

    return { entries, goals };
  } catch {
    return EMPTY_LOGBOOK_STATE;
  }
}

function persist(nextState: LogbookState): void {
  snapshot = nextState;

  try {
    window.localStorage.setItem(LOGBOOK_STORAGE_KEY, JSON.stringify(nextState));
  } catch {
    // Private browsing and quota failures should not make the editor unusable.
  }

  listeners.forEach((listener) => listener());
}

function updateState(updater: (current: LogbookState) => LogbookState): void {
  persist(updater(snapshot));
}

function handleStorageEvent(event: StorageEvent): void {
  if (event.key !== LOGBOOK_STORAGE_KEY) return;
  snapshot = readState();
  listeners.forEach((listener) => listener());
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', handleStorageEvent);
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): LogbookState {
  return snapshot;
}

export function findEntry(date: string): LogEntry | undefined {
  return snapshot.entries.find((entry) => entry.date === date);
}

export function getMonthlyGoal(month = monthKey()): MonthlyGoal | undefined {
  return snapshot.goals[month];
}

export function saveEntry(input: LogEntryInput): LogEntry {
  const existing = findEntry(input.date);
  const now = new Date().toISOString();
  const saved: LogEntry = {
    ...input,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  updateState((current) => ({
    ...current,
    entries: [...current.entries.filter((entry) => entry.date !== input.date), saved].sort((a, b) =>
      a.date.localeCompare(b.date),
    ),
  }));

  return saved;
}

export function removeEntry(date: string): void {
  updateState((current) => ({
    ...current,
    entries: current.entries.filter((entry) => entry.date !== date),
  }));
}

export function saveMonthlyGoal(text: string, month = monthKey()): MonthlyGoal {
  const trimmedText = text.trim();
  if (!trimmedText) throw new Error('A monthly goal needs a sentence.');

  const existing = getMonthlyGoal(month);
  if (existing?.locked) throw new Error('This month’s goal is already locked.');

  const goal: MonthlyGoal = {
    month,
    text: trimmedText,
    locked: true,
    resetDate: nextMonthDate(month),
  };

  updateState((current) => ({
    ...current,
    goals: { ...current.goals, [month]: goal },
  }));

  return goal;
}

export function calculateSummary(entries: LogEntry[], today = toDateKey(new Date())): LogbookSummary {
  const ordered = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const entryDates = new Set(ordered.map((entry) => entry.date));
  let cursor = ordered[0]?.date && ordered[0].date < today ? ordered[0].date : today;
  let currentStreak = 0;

  while (entryDates.has(cursor)) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  const totalIntensity = entries.reduce((total, entry) => total + entry.intensity, 0);
  return {
    currentStreak,
    activeDays: entries.length,
    totalEntries: entries.length,
    averageIntensity: entries.length ? Number((totalIntensity / entries.length).toFixed(1)) : 0,
    lastLoggedDate: ordered[0]?.date ?? null,
  };
}