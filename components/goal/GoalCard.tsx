import type { MonthlyGoal } from '@/lib/logbook/types';

type GoalCardProps = {
  goal?: MonthlyGoal;
  activeDays: number;
  editable?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
  error?: string;
};

export function GoalCard({ goal, activeDays, editable = false, value = '', onChange, onSave, isSaving, error }: GoalCardProps) {
  const monthLabel = goal?.month ? new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(`${goal.month}-01T12:00:00`)) : 'this month';
  const resetDate = goal?.month ? new Date(`${goal.month}-01T12:00:00`) : new Date();
  resetDate.setMonth(resetDate.getMonth() + 1);
  const resetText = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(resetDate);
  return (
    <section className="blotter-goal" data-testid="section-monthly-goal">
      <div className="blotter-goal-label">
        <span>{monthLabel} goal</span>
        <span className="blotter-goal-lock">{goal?.locked ? `locked · resets ${resetText}` : `unlocked · resets ${resetText}`}</span>
      </div>
      <div>
        {editable ? (
          <div>
            <label htmlFor="monthly-goal" className="sr-only">Monthly goal</label>
            <textarea id="monthly-goal" value={value} maxLength={200} onChange={(event) => onChange?.(event.target.value)} disabled={goal?.locked} data-testid="input-monthly-goal" className="min-h-[92px] w-full resize-none border border-border bg-background/60 p-3 text-base leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50" placeholder="What deserves your attention this month?" />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className={`font-mono text-[10px] ${value.length > 180 ? 'text-primary' : 'text-muted-foreground'}`}>{value.length}/200</span>
               <button type="button" onClick={onSave} disabled={Boolean(isSaving || goal?.locked || !value.trim())} data-testid="button-save-goal" className="bg-primary px-3 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45">
                 {isSaving ? 'saving' : 'save intention'}
              </button>
            </div>
            {error && <p className="mt-2 font-mono text-[10px] text-destructive" data-testid="status-goal-error">{error}</p>}
          </div>
        ) : (
          <p className={`blotter-goal-text ${!goal?.text ? 'text-[#6b7268] italic text-xs' : ''}`} data-testid="text-current-goal">{goal?.text || 'No goal set for this month.'}</p>
        )}
      </div>
    </section>
  );
}