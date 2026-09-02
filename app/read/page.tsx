"use client";
import { useMemo, useState } from "react";
import { ActivityHeatmap } from "@/components/calender/ActivityHeatmap";
import { toDateKey } from "@/lib/logbook/date";
import { DayDetail } from "@/components/day-detail/DayDetail";
import { GoalCard } from "@/components/goal/goal-read/GoalCard";
import { DUMMY_LOG_ENTRIES, MONTHLY_GOAL_DUMMY_DATA } from "@/api-client/dummy-data";

export default function ReadPage() {
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));
  const [currentMonth, setCurrentMonth] = useState("2026-08");
  const [data] = useState(MONTHLY_GOAL_DUMMY_DATA); // Replace with API fetch

  // Single source of truth for entries — swap this line back to
  // `useLogbook().entries` once the real API is wired in.
  const entries = DUMMY_LOG_ENTRIES;

  // Derived, not synced: no effect, no cascading render.
  // If selectedDate isn't in entries, fall back to the latest entry —
  // computed during render instead of pushed back into state.
  const effectiveDate = useMemo(() => {
    if (!entries.length) return selectedDate;
    const exists = entries.some((entry) => entry.date.slice(0, 10) === selectedDate);
    if (exists) return selectedDate;
    const latest = [...entries].sort((a, b) => b.date.localeCompare(a.date))[0];
    return latest ? latest.date.slice(0, 10) : selectedDate;
  }, [entries, selectedDate]);

  const selectedEntry = entries.find(
    (entry) => entry.date.slice(0, 10) === effectiveDate,
  );

  return (
    <div className="page-enter">
      <div className="blotter-app">
        <div className="blotter-wrap">
          <div>
            <div className="blotter-masthead">
              <h1>THE BLOTTER</h1>
              <div className="blotter-streak">
                <b>69</b> day streak
              </div>
            </div>
            <GoalCard data={data} currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
            <ActivityHeatmap
              entries={entries}
              selectedDate={effectiveDate}
              onSelect={setSelectedDate}
            />
            <DayDetail date={effectiveDate} entry={selectedEntry} />
          </div>
        </div>
      </div>
    </div>
  );
}