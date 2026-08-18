import { useEffect, useMemo, useState } from 'react';
import { ActivityHeatmap, getRollingYearRange, toDateKey } from '@/components/calendar/ActivityHeatmap';
import { DayDetail } from '@/components/day-detail/DayDetail';
import { GoalCard } from '@/components/goal/GoalCard';
import { useLogbook } from '@/hooks/use-logbook';

export function ReadPage() {
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));
  const { entries, goal, summary } = useLogbook();
  useMemo(getRollingYearRange, []);

  useEffect(() => {
    if (entries.length && !entries.some((entry) => entry.date.slice(0, 10) === selectedDate)) {
      const latest = [...entries].sort((a, b) => b.date.localeCompare(a.date))[0];
      if (latest) setSelectedDate(latest.date.slice(0, 10));
    }
  }, [entries, selectedDate]);
  const selectedEntry = entries.find((entry) => entry.date.slice(0, 10) === selectedDate);
  return (
    <div className="page-enter">
      <div>
        <div className="blotter-masthead">
          <h1>THE BLOTTER</h1>
          <div className="blotter-streak"><b>{summary.currentStreak}</b> day streak</div>
        </div>
        <GoalCard goal={goal} activeDays={summary.activeDays} />
        <ActivityHeatmap entries={entries} selectedDate={selectedDate} onSelect={setSelectedDate} />
        <DayDetail date={selectedDate} entry={selectedEntry} />
      </div>
    </div>
  );
}