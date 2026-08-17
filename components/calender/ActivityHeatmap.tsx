import type { LogEntry } from '@/lib/logbook/types';
import { getRollingYearRange, toDateKey } from '@/lib/logbook/date';

export { getRollingYearRange, toDateKey };

type ActivityHeatmapProps = {
  entries: LogEntry[];
  selectedDate: string;
  onSelect: (date: string) => void;
};

type MonthMarker = {
  column: number;
  label: string;
};

const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];
const tierColors = ['#14170f', '#2b3a24', '#3d6b34', '#4fa63f', '#ffb000'];

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const daysSinceMonday = (day + 6) % 7;
  result.setDate(result.getDate() - daysSinceMonday);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfWeek(date: Date) {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  return result;
}

function buildWeeks(from: Date, to: Date) {
  const firstDay = startOfWeek(from);
  const lastDay = endOfWeek(to);
  const weekCount = Math.floor((lastDay.getTime() - firstDay.getTime()) / 604800000) + 1;

  return Array.from({ length: weekCount }, (_, column) =>
    Array.from({ length: 7 }, (_, row) => {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + column * 7 + row);
      return date;
    }),
  );
}

function buildMonthMarkers(weeks: Date[][], from: Date, to: Date): MonthMarker[] {
  const markers: MonthMarker[] = [];
  let lastMonth = '';

  weeks.forEach((week, column) => {
    const inRange = week.filter((date) => date >= from && date <= to);
    const firstOfMonth = inRange.find((date) => date.getDate() <= 7);
    const firstVisibleDate = inRange[0];
    const markerDate = firstOfMonth ?? (column === 0 ? firstVisibleDate : undefined);

    if (!markerDate) return;

    const monthKey = `${markerDate.getFullYear()}-${markerDate.getMonth()}`;
    if (monthKey === lastMonth) return;

    markers.push({
      column,
      label: new Intl.DateTimeFormat('en', { month: 'short' }).format(markerDate),
    });
    lastMonth = monthKey;
  });

  return markers;
}

export function ActivityHeatmap({ entries, selectedDate, onSelect }: ActivityHeatmapProps) {
  const range = getRollingYearRange();
  const from = new Date(`${range.from}T00:00:00`);
  const to = new Date(`${range.to}T23:59:59`);
  const weeks = buildWeeks(from, to);
  const monthMarkers = buildMonthMarkers(weeks, from, to);
  const entryByDate = new Map(entries.map((entry) => [entry.date.slice(0, 10), entry]));
  const gridColumns = `28px repeat(${weeks.length}, 11px)`;

  return (
    <section className="blotter-panel" data-testid="section-activity-heatmap">
      <div className="blotter-panel-label">activity</div>
      <div className="blotter-scroll overflow-x-auto pb-1" data-testid="heatmap-scroll">
        <div className="year-heatmap" style={{ minWidth: `${28 + weeks.length * 14}px` }}>
          <div className="year-heatmap-months" style={{ gridTemplateColumns: gridColumns }}>
            <span aria-hidden="true" />
            {monthMarkers.map((marker) => (
              <span
                key={`${marker.label}-${marker.column}`}
                className="year-heatmap-month"
                style={{ gridColumn: marker.column + 2 }}
              >
                {marker.label}
              </span>
            ))}
          </div>
          <div className="year-heatmap-grid" style={{ gridTemplateColumns: gridColumns }}>
            {DAY_LABELS.map((label, row) => (
              <span
                key={`weekday-${row}`}
                className="year-heatmap-weekday"
                style={{ gridColumn: 1, gridRow: row + 1 }}
              >
                {label}
              </span>
            ))}
            {weeks.flatMap((week, column) =>
              week.map((date, row) => {
                const dateKey = toDateKey(date);
                const entry = entryByDate.get(dateKey);
                const isInRange = date >= from && date <= to;
                const isSelected = dateKey === selectedDate;
                const tier = Math.max(0, Math.min(4, entry?.intensity ?? 0));
                const cellStyle = {
                  gridColumn: column + 2,
                  gridRow: row + 1,
                  backgroundColor: tierColors[tier],
                };

                if (!isInRange) {
                  return <span key={dateKey} className="year-heatmap-cell out-of-range" style={cellStyle} aria-hidden="true" />;
                }

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => onSelect(dateKey)}
                    data-testid={`button-heatmap-day-${dateKey}`}
                    aria-label={`${dateKey}${entry ? `, intensity ${entry.intensity}` : ', no entry'}`}
                    className={`year-heatmap-cell ${isSelected ? 'selected' : ''}`}
                    style={cellStyle}
                  />
                );
              }),
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-[6px] text-[9px] text-[#454b41]" data-testid="heatmap-legend">
        <span>Less</span>
        {tierColors.map((color, index) => (
          <span key={color} className="size-[9px] rounded-[2px]" style={{ backgroundColor: color }} aria-label={`intensity ${index}`} />
        ))}
        <span>Grind day</span>
      </div>
    </section>
  );
}