import type { MonthlyGoal } from '@/lib/logbook/types';

type GoalCardProps = {
  goal?: MonthlyGoal;
  canEditGoal: boolean;
  canMarkAchieved: boolean;
  value: string;
  onChange: (value: string) => void;
  onSaveGoal: () => void;
  isSavingGoal?: boolean;
  goalError?: string;
  onToggleAchieved: (achieved: boolean) => void;
  isSavingAchieved?: boolean;
};

export function GoalCard({
  goal,
  canEditGoal,
  canMarkAchieved,
  value,
  onChange,
  onSaveGoal,
  isSavingGoal,
  goalError,
  onToggleAchieved,
  isSavingAchieved,
}: GoalCardProps) {
  const monthLabel = goal?.month
    ? new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(`${goal.month}-01T12:00:00`))
    : 'this month';

  const isGoalSet = Boolean(goal?.text.trim());
  const showForm = canEditGoal && !isGoalSet;
  const statusText = isGoalSet ? 'set for the month' : canEditGoal ? 'open · editable until the 3rd' : 'window closed for this month';

  return (
    <section className="blotter-goal" data-testid="section-monthly-goal">
      <div className="blotter-goal-label">
        <span>{monthLabel} goal</span>
        <span className="blotter-goal-lock">{statusText}</span>
      </div>

      {showForm ? (
        <div>
          <label htmlFor="monthly-goal" className="sr-only">Monthly goal</label>
          <textarea
            id="monthly-goal"
            value={value}
            maxLength={200}
            onChange={(event) => onChange(event.target.value)}
            data-testid="input-monthly-goal"
            className="min-h-[92px] w-full resize-none border border-border bg-background/60 p-3 text-base leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
            placeholder="What deserves your attention this month?"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className={`font-mono text-[10px] ${value.length > 180 ? 'text-primary' : 'text-muted-foreground'}`}>
              {value.length}/200
            </span>
            <button
              type="button"
              onClick={onSaveGoal}
              disabled={Boolean(isSavingGoal || !value.trim())}
              data-testid="button-save-goal"
              className="bg-primary px-3 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSavingGoal ? 'saving' : 'save intention'}
            </button>
          </div>
          {goalError && (
            <p className="mt-2 font-mono text-[10px] text-destructive" data-testid="status-goal-error">
              {goalError}
            </p>
          )}
        </div>
      ) : (
        <p className={`blotter-goal-text ${!goal?.goal ? 'text-[#6b7268] italic text-xs' : ''}`} data-testid="text-current-goal">
          {goal?.goal || 'No goal set for this month.'}
        </p>
      )}

      {canMarkAchieved && isGoalSet && (
        <label
          className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.1em] text-muted-foreground"
          data-testid="toggle-goal-achieved"
        >
          <input type="checkbox" onChange={(event) => onToggleAchieved(event.target.checked)} disabled={isSavingAchieved} />
          mark this goal achieved
        </label>
      )}
    </section>
  );
}