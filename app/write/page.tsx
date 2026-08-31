"use client";
import { Check, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getGetEntryQueryKey,
  getGetSummaryQueryKey,
  getListEntriesQueryKey,
  getGetGoalQueryKey,
  useCreateEntry,
  useGetEntry,
  useGetGoal,
  useCreateGoal,
} from "@/api-client";
import { LogEntryInput } from "@/lib/logbook/types";
import { useQueryClient } from "@tanstack/react-query";
import { EntryEditor } from "@/components/write/EntryEditor";
import { GoalCard } from "@/components/goal/GoalCard";
import { toDateKey, getMonthlyGoalWindows } from "@/lib/logbook/date";

export default function WritePage() {
  const queryClient = useQueryClient();
  const now = useMemo(() => new Date(), []);
  const today = useMemo(() => toDateKey(now), [now]);
  const { canEditGoal, canMarkAchieved } = useMemo(
    () => getMonthlyGoalWindows(now),
    [now],
  );

  const entryQuery = useGetEntry(today);
  const goalQuery = useGetGoal();
  const [savedNotice, setSavedNotice] = useState("");
  const [goalDraft, setGoalDraft] = useState("");

  // useEffect(() => {
  //   setGoalDraft(goalQuery.data?.goal ?? ""); 
  // }, [goalQuery.data]);

  const createEntry = useCreateEntry();
  const createGoal = useCreateGoal();

  const range = useMemo(() => {
    const date = new Date(`${today}T12:00:00`);
    return {
      startDate: toDateKey(new Date(date.getFullYear(), date.getMonth(), 1)),
      endDate: toDateKey(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
    };
  }, [today]);

  const flashNotice = (message: string) => {
    setSavedNotice(message);
    window.setTimeout(() => setSavedNotice(""), 2500);
  };

  const saveEntry = (data: LogEntryInput) => {
    createEntry.mutate(data, {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: getListEntriesQueryKey(range),
        });
        void queryClient.invalidateQueries({
          queryKey: getGetEntryQueryKey(today),
        });
        void queryClient.invalidateQueries({
          queryKey: getGetSummaryQueryKey(),
        });
        flashNotice("record pressed into the blotter");
      },
    });
  };

  const saveGoal = () => {
    const trimmed = goalDraft.trim();
    if (!trimmed) return;
    createGoal.mutate(
      { text: trimmed },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: getGetGoalQueryKey(),
          });
          flashNotice("intention set for the month");
        },
      },
    );
  };

  // TODO: MonthlyGoal/GoalInput don't have an `achieved` field yet — wire this
  // once that's added to the type + mock. For now the checkbox is inert.
  const toggleAchieved = (_achieved: boolean) => {};

  //const isLoading = entryQuery.isLoading || goalQuery.isLoading; // remove it for smooth loading
  const isLoading = false;
  const isError = goalQuery.isError;

  return (
    <div className="blotter-app">
      <div className="blotter-wrap">
        <div className="blotter-masthead">
          <h1>THE BLOTTER</h1>
          <div className="blotter-streak">write mode</div>
        </div>

        {savedNotice && (
          <div
            className="mb-5 flex items-center gap-2 border border-secondary/40 bg-secondary/10 px-4 py-3 font-mono text-[11px] text-secondary"
            data-testid="status-save-success"
          >
            <Check size={14} /> {savedNotice}
          </div>
        )}

        {isLoading && (
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[1px] text-[#6b7268]">
            opening today's page…
          </p>
        )}

        {!isLoading && isError && (
          <div className="blotter-panel" data-testid="status-write-error">
            <p className="text-[10px] uppercase tracking-[1px] text-destructive">
              write mode / unavailable
            </p>
            <p className="mt-2 text-[11.5px] leading-7 text-[#6b7268]">
              Today's page could not be opened. Try the connection again before
              writing.
            </p>
            <button
              type="button"
              onClick={() => {
                void entryQuery.refetch();
                void goalQuery.refetch();
              }}
              data-testid="button-retry-write"
              className="mt-5 border border-primary px-3 py-2 text-[10px] uppercase tracking-[1px] text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <RotateCcw size={13} className="mr-2 inline" /> retry
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <GoalCard
              goal={goalQuery.data}
              canEditGoal={canEditGoal}
              canMarkAchieved={canMarkAchieved}
              value={goalDraft}
              onChange={setGoalDraft}
              onSaveGoal={saveGoal}
              isSavingGoal={createGoal.isPending}
              goalError={
                createGoal.error ? "The goal could not be saved." : undefined
              }
              onToggleAchieved={toggleAchieved}
              isSavingAchieved={false}
            />
            <EntryEditor
              date={today}
              entry={entryQuery.data}
              isSaving={createEntry.isPending}
              saveError={
                createEntry.error
                  ? "The record could not be saved. Check the connection and try again."
                  : undefined
              }
              onSave={saveEntry}
            />
          </>
        )}
      </div>
    </div>
  );
}
