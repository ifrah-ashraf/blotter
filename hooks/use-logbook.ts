import { useSyncExternalStore } from 'react';
import { monthKey } from '@/lib/logbook/date';
import {
  calculateSummary,
  findEntry,
  getMonthlyGoal,
  getSnapshot,
  removeEntry,
  saveEntry,
  saveMonthlyGoal,
  subscribe,
  EMPTY_LOGBOOK_STATE,
} from '@/lib/logbook/storage';

export function useLogbook() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_LOGBOOK_STATE);

  return {
    state,
    entries: state.entries,
    goal: getMonthlyGoal(monthKey()),
    summary: calculateSummary(state.entries),
    findEntry,
    saveEntry,
    removeEntry,
    saveMonthlyGoal,
  };
}