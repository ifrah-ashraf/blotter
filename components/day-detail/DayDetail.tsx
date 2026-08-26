import { Link } from 'wouter';
import type { LogEntry } from '@/lib/logbook/types';

type DayDetailProps = {
  date: string;
  entry?: LogEntry;
  isLoading?: boolean;
  isError?: boolean;
  onDelete?: () => void;
};

const displayDate = (date: string) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`)).toUpperCase();
const Field = ({ label, value, testId }: { label: string; value: string; testId: string }) => (
  <div className="log-item mb-3 last:mb-0" data-testid={testId}>
    <p className="mb-[3px] text-[9px] uppercase tracking-[1.5px] text-[#8a5f00]">{label}</p>
    <p className={`whitespace-pre-wrap text-[12.5px] leading-[1.5] text-[#d8dcd4] ${!value ? 'italic text-[#454b41]' : ''}`}>{value || '-'}</p>
  </div>
);

export function DayDetail({ date, entry, isLoading, isError, onDelete }: DayDetailProps) {
  return (
    <section className="blotter-panel" data-testid="section-day-detail">
      <div className="mb-[14px] flex items-center justify-between">
        <span className="blotter-panel-label mb-0" data-testid="text-selected-date">{isLoading || isError ? 'selected day' : displayDate(date)}</span>
        <span className="text-[9px] text-[#454b41]">{date}</span>
      </div>
      {isLoading ? (
        <div className="space-y-6" data-testid="status-day-loading">
          <div className="space-y-3"><div className="h-2 w-16 animate-pulse bg-muted" /><div className="h-3 w-full animate-pulse bg-muted" /><div className="h-2 w-3/4 animate-pulse bg-muted" /></div>
        </div>
      ) : isError ? (
        <div data-testid="status-day-error">
          <p className="text-[11.5px] text-[#6b7268]">The selected day could not be read. Try selecting it again.</p>
        </div>
      ) : entry ? (
        <div>
          <Field label="dsa" value={entry.dsa} testId="field-day-dsa" />
          <Field label="development" value={entry.development} testId="field-day-development" />
          <Field label="maths / other" value={entry.other} testId="field-day-other" />
        </div>
      ) : (
        <div className="py-[6px]" data-testid="status-day-empty">
          <p className="text-[11.5px] text-[#6b7268]">No entry logged for this day.</p>
          <Link href="/write" data-testid="link-write-empty-day" className="mt-4 inline-block text-[10px] uppercase tracking-[1px] text-[#ffb000] hover:underline">write today</Link>
        </div>
      )}
    </section>
  );
}