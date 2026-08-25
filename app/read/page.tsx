"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityHeatmap,
} from "@/components/calender/ActivityHeatmap";
import { toDateKey, getRollingYearRange } from "@/lib/logbook/date";
import { DayDetail } from "@/components/day-detail/DayDetail";
//import { GoalCard } from "@/components/goal/GoalCard";
import { useLogbook } from "@/hooks/use-logbook";
import { GoalCard } from "@/components/goal/goal-read/GoalCard";
import { DUMMY_LOG_ENTRIES, MONTHLY_GOAL_DUMMY_DATA } from "@/api-client/dummy-data";

export default function ReadPage() {
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));
  const { goal, summary } = useLogbook(); // entries no longer pulled from here while testing dummy data
  useMemo(getRollingYearRange, []);

  const [currentMonth, setCurrentMonth] = useState("2026-08");
  const [data, setData] = useState(MONTHLY_GOAL_DUMMY_DATA); // Replace with API fetch

  // Single source of truth for entries - swap this one line back to
  // `useLogbook().entries` once the real API is wired in, everything
  // below reads from this only dear.
  const entries = DUMMY_LOG_ENTRIES;

  useEffect(() => {
    if (
      entries.length &&
      !entries.some((entry) => entry.date.slice(0, 10) === selectedDate)
    ) {
      const latest = [...entries].sort((a, b) =>
        b.date.localeCompare(a.date),
      )[0];
      if (latest) setSelectedDate(latest.date.slice(0, 10));
    }
  }, [entries, selectedDate]);

  const selectedEntry = entries.find(
    (entry) => entry.date.slice(0, 10) === selectedDate,
  );

  return (
    <div className="page-enter">
      <div className="blotter-app">
        <div className="blotter-wrap">
          <div>
            <div className="blotter-masthead">
              <h1>THE BLOTTER</h1>
              <div className="blotter-streak">
                <b>{summary.currentStreak}</b> day streak
              </div>
            </div>
            <GoalCard data={data} currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
            <ActivityHeatmap
              entries={entries}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
            <DayDetail date={selectedDate} entry={selectedEntry} />
          </div>
        </div>
      </div>
    </div>
  );
}