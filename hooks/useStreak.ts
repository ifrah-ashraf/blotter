import { useMemo } from "react";
import { calculateStreak } from "@/lib/logbook/streak";
import { LogEntry } from "@/lib/logbook/types";

export function useStreak(logs: LogEntry[] | undefined): number {
  return useMemo(() => calculateStreak(logs ?? []), [logs]);
}