"use client";
import { useMemo, useState } from "react";
import { ActivityHeatmap } from "@/components/calender/ActivityHeatmap";
import { toDateKey } from "@/lib/logbook/date";
import { DayDetail } from "@/components/day-detail/DayDetail";
import { GoalCard } from "@/components/goal/goal-read/GoalCard";
import { useListGoals, useListLogs } from "@/api-client";
import { LogEntry } from "@/lib/logbook/types";
import { useStreak } from "@/hooks/useStreak";

export default function ReadPage() {
  const todayKey = useMemo(() => toDateKey(new Date()), []);

  // null = "nothing explicitly clicked yet" distinct from "today was clicked."
  // Collapsing these into one string field is what caused the fallback to
  // hijack real clicks.
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(todayKey.slice(0, 7));

  const goalQuery = useListGoals();
  const logsQuery = useListLogs();

  // to calculate the streak of user
  const streak = useStreak(logsQuery.data)

  const latestEntryDate = useMemo(() => {
    if (!logsQuery.data?.length) return null;
    return [...logsQuery.data].sort((a, b) => b.date.localeCompare(a.date))[0].date.slice(0, 10);
  }, [logsQuery.data]);

  // Only used before the user has clicked anything: prefer today if today
  // has a log, otherwise fall back to the most recent logged day.
  const defaultDate = useMemo(() => {
    if (!logsQuery.data?.length) return todayKey;
    const todayHasEntry = logsQuery.data.some((entry: LogEntry) => entry.date.slice(0, 10) === todayKey);
    return todayHasEntry ? todayKey : (latestEntryDate ?? todayKey);
  }, [logsQuery.data, todayKey, latestEntryDate]);

  // Once the user has clicked, this is final — no silent override, even if
  // the clicked day has no entry.
  const effectiveDate = selectedDate ?? defaultDate;

  const displayedEntry = logsQuery.data?.find(
    (entry: LogEntry) => entry.date.slice(0, 10) === effectiveDate
  );

  if (logsQuery.isLoading) return <p>Loading logs...</p>;
  if (logsQuery.isError) return <p>Error loading logs</p>;

  return (
    <div className="page-enter">
      <div className="blotter-app">
        <div className="blotter-wrap">
          <div>
            <div className="blotter-masthead">
              <h1>THE BLOTTER</h1>
              <div className="blotter-streak">
                <b>{streak}</b> day streak
              </div>
            </div>
            <GoalCard
              data={goalQuery.data}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
            />
            <ActivityHeatmap
              entries={logsQuery.data}
              selectedDate={effectiveDate}
              onSelect={setSelectedDate}
            />
            <DayDetail date={effectiveDate} entry={displayedEntry} />
          </div>
        </div>
      </div>
    </div>
  );
}