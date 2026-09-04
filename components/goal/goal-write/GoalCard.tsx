import type { MonthlyGoal } from "@/lib/logbook/types";
import { GOAL_EDIT_WINDOW_DAYS } from "@/lib/logbook/date";

type GoalCardProps = {
  currentGoal?: MonthlyGoal | null;
  previousGoal?: MonthlyGoal | null;
  canEditGoal: boolean;
  needsReview: boolean;
  value: string;
  onChange: (value: string) => void;
  onSaveGoal: () => void;
  isSavingGoal?: boolean;
  goalError?: string;
  onMarkAchieved: (id: string, achieved: boolean) => void;
  isSavingAchieved?: boolean;
};

function formatMonth(monthKey: string): string {
  return new Intl.DateTimeFormat("en", { month: "long" }).format(
    new Date(`${monthKey}-01T12:00:00`),
  );
}

export function GoalCard({
  currentGoal,
  previousGoal,
  canEditGoal,
  needsReview,
  value,
  onChange,
  onSaveGoal,
  isSavingGoal,
  goalError,
  onMarkAchieved,
  isSavingAchieved,
}: GoalCardProps) {
  // Branch 1 — an unresolved previous goal blocks everything else.
  if (needsReview && previousGoal) {
    return (
      <section className="blotter-goal" data-testid="section-monthly-goal">
        <div className="blotter-goal-label">
          <span>{formatMonth(previousGoal.month)} goal — review</span>
        </div>
        <p className="blotter-goal-text" data-testid="text-previous-goal">
          {previousGoal.goalText}
        </p>
        <div className="mt-4 flex gap-2" data-testid="toggle-goal-achieved">
          <button
            type="button"
            onClick={() => onMarkAchieved(previousGoal.id, true)}
            disabled={isSavingAchieved}
            data-testid="button-mark-achieved"
            className="border border-secondary px-3 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-secondary hover:bg-secondary hover:text-secondary-foreground disabled:cursor-not-allowed disabled:opacity-45"
          >
            achieved
          </button>
          <button
            type="button"
            onClick={() => onMarkAchieved(previousGoal.id, false)}
            disabled={isSavingAchieved}
            data-testid="button-mark-not-achieved"
            className="border border-destructive px-3 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-45"
          >
            not achieved
          </button>
        </div>
      </section>
    );
  }

  const isGoalSet = Boolean(currentGoal?.goalText.trim());

  // Branch 2 — writing window open, nothing written yet, review is clear.
  if (canEditGoal && !isGoalSet) {
    return (
      <section className="blotter-goal" data-testid="section-monthly-goal">
        <div className="blotter-goal-label">
          <span>this month&apos;s goal</span>
          <span className="blotter-goal-lock">
            open · editable until day {GOAL_EDIT_WINDOW_DAYS}
          </span>
        </div>
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
          <span className={`font-mono text-[10px] ${value.length > 180 ? "text-primary" : "text-muted-foreground"}`}>
            {value.length}/200
          </span>
          <button
            type="button"
            onClick={onSaveGoal}
            disabled={Boolean(isSavingGoal || !value.trim())}
            data-testid="button-save-goal"
            className="bg-primary px-3 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isSavingGoal ? "saving" : "save intention"}
          </button>
        </div>
        {goalError && (
          <p className="mt-2 font-mono text-[10px] text-destructive" data-testid="status-goal-error">
            {goalError}
          </p>
        )}
      </section>
    );
  }

  // Branch 3 — read-only: either already set, or the writing window has closed.
  return (
    <section className="blotter-goal" data-testid="section-monthly-goal">
      <div className="blotter-goal-label">
        <span>this month&apos;s goal</span>
        <span className="blotter-goal-lock">
          {isGoalSet ? "set for the month" : "window closed for this month"}
        </span>
      </div>
      <p
        className={`blotter-goal-text ${!isGoalSet ? "text-[#6b7268] italic text-xs" : ""}`}
        data-testid="text-current-goal"
      >
        {currentGoal?.goalText || "No goal set for this month."}
      </p>
    </section>
  );
}