"use client";
import { Check, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import {
  getGetEntryQueryKey,
  getGetSummaryQueryKey,
  getListEntriesQueryKey,
  useCreateEntry,
  useDeleteEntry,
  useGetEntry,
  useGetGoal,
  useUpdateEntry,
} from "@/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { EntryEditor } from "@/components/write/EntryEditor";
import { GoalCard } from "@/components/goal/GoalCard";
import { toDateKey } from "@/components/calender/ActivityHeatmap";

export default function WritePage() {
  const queryClient = useQueryClient();
  const today = useMemo(() => toDateKey(new Date()), []);
  const entryQuery = useGetEntry(today);
  const goalQuery = useGetGoal();
  const [savedNotice, setSavedNotice] = useState("");
  const createEntry = useCreateEntry();
  const updateEntry = useUpdateEntry();
  const deleteEntry = useDeleteEntry();
  const savingEntry = createEntry.isPending || updateEntry.isPending;
  const range = useMemo(() => {
    const date = new Date(`${today}T12:00:00`);
    return {
      from: toDateKey(new Date(date.getFullYear(), date.getMonth(), 1)),
      to: toDateKey(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
    };
  }, [today]);
  const invalidateRecords = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getListEntriesQueryKey(range),
      }),
      queryClient.invalidateQueries({ queryKey: getGetEntryQueryKey(today) }),
      queryClient.invalidateQueries({ queryKey: getGetSummaryQueryKey() }),
    ]);
  };
  const saveEntry = (data: {
    date: string;
    intensity: number;
    dsa: string;
    development: string;
    other: string;
  }) => {
    const done = () => {
      void invalidateRecords();
      setSavedNotice("record pressed into the blotter");
      window.setTimeout(() => setSavedNotice(""), 2800);
    };
    if (entryQuery.data)
      updateEntry.mutate({ date: today, data }, { onSuccess: done });
    else createEntry.mutate({ data }, { onSuccess: done });
  };
  const removeEntry = () => {
    if (!window.confirm("Remove today’s entry from the blotter?")) return;
    deleteEntry.mutate(
      { date: today },
      {
        onSuccess: () => {
          void invalidateRecords();
          setSavedNotice("record removed");
        },
      },
    );
  };
  const isLoading = entryQuery.isLoading || goalQuery.isLoading;
  // A missing entry is the normal first-run state for write mode; the editor creates it.
  const isError = goalQuery.isError;
  // fix the bimaari of unecessary animation on changing tab
  return (
    <div> 
      <div className="blotter-app">
        <div className="blotter-wrap">
          <div>
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
            {!isLoading && !isError && (
              <GoalCard goal={goalQuery.data} activeDays={0} />
            )}
            {isLoading ? (
              <div className="space-y-5">
                <div className="h-[100px] animate-pulse bg-card" />
                <div className="h-[465px] animate-pulse bg-card" />
              </div>
            ) : isError ? (
              <div className="blotter-panel" data-testid="status-write-error">
                <p className="text-[10px] uppercase tracking-[1px] text-destructive">
                  write mode / unavailable
                </p>
                <p className="mt-2 text-[11.5px] leading-7 text-[#6b7268]">
                  Today’s page could not be opened. Try the connection again
                  before writing.
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
            ) : (
              <EntryEditor
                date={today}
                entry={entryQuery.data}
                isSaving={savingEntry || deleteEntry.isPending}
                saveError={
                  createEntry.error || updateEntry.error || deleteEntry.error
                    ? "The record could not be saved. Check the connection and try again."
                    : undefined
                }
                onSave={saveEntry}
                onDelete={removeEntry}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
