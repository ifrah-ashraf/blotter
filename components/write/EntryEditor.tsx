import type { EntryIntensity, LogEntry } from '@/lib/logbook/types';
import { useState } from 'react';
import type { SyntheticEvent } from 'react';

type EntryEditorProps = {
  date: string;
  entry?: LogEntry;
  isSaving: boolean;
  saveError?: string;
  onSave: (data: LogEntry) => void;
};

const SECTIONS = [
  { key: 'dsa' as const, label: 'dsa' },
  { key: 'development' as const, label: 'development' },
  { key: 'mathsOther' as const, label: 'maths / other' },
];

const blank = { dayIntensity: 3 as EntryIntensity, dsa: '', development: '', mathsOther: '' };

export function EntryEditor({ date, entry, isSaving, saveError, onSave }: EntryEditorProps) {
  const [form, setForm] = useState(blank);
  const [validation, setValidation] = useState('');

  if (entry) {
    return (
      <section className="blotter-panel" data-testid="panel-entry-logged">
        <div className="blotter-panel-label">today&apos;s log</div>
        <p className="mb-4 text-[11px] leading-6 text-[#6b7268]">
          Logged for today. Come back tomorrow to write the next page.
        </p>
        {SECTIONS.map(({ key, label }) =>
          entry[key] ? (
            <div key={key} className="mb-4 last:mb-0">
              <div className="mb-[6px] text-[9px] uppercase tracking-[1.5px] text-[#6b7268]">{label}</div>
              <p className="whitespace-pre-wrap text-[13px] leading-[1.5] text-[#d8dcd4]">{entry[key]}</p>
            </div>
          ) : null,
        )}
      </section>
    );
  }

  const updateContent = (key: 'dsa' | 'development' | 'mathsOther', value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const updateIntensity = (value: EntryIntensity) =>
    setForm((current) => ({ ...current, dayIntensity: value }));

  const submit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.dsa.trim() && !form.development.trim() && !form.mathsOther.trim()) {
      setValidation('Leave one trace before saving. One sentence is enough.');
      return;
    }
    setValidation('');
    onSave({
      date,
      dayIntensity: form.dayIntensity,
      dsa: form.dsa,
      development: form.development,
      mathsOther: form.mathsOther,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={submit} className="blotter-panel" data-testid="form-entry-editor">
      <div className="blotter-panel-label">today&apos;s log</div>
      <div>
        {SECTIONS.map(({ key, label }) => (
          <div key={key} className="mb-4 last:mb-0">
            <label htmlFor={`entry-${key}`} className="mb-[6px] block text-[9px] uppercase tracking-[1.5px] text-[#6b7268]">
              {label}
            </label>
            <textarea
              id={`entry-${key}`}
              value={form[key]}
              onChange={(event) => updateContent(key, event.target.value)}
              placeholder="What did you work through today..."
              data-testid={`input-entry-${key}`}
              className="min-h-[60px] w-full resize-y border border-[#262b23] bg-black p-[10px] text-[13px] leading-[1.5] text-[#d8dcd4] outline-none placeholder:text-[#6b7268] focus:border-[#8a5f00]"
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <fieldset>
          <legend className="mb-[6px] text-[9px] uppercase tracking-[1.5px] text-[#6b7268]">day intensity</legend>
          <div className="flex gap-[6px]">
            {[
              { level: 1, label: 'light' },
              { level: 2, label: 'moderate' },
              { level: 3, label: 'solid' },
              { level: 4, label: 'grind' },
            ].map(({ level, label }) => (
              <button
                key={level}
                type="button"
                onClick={() => updateIntensity(level as EntryIntensity)}
                data-testid={`button-intensity-${level}`}
                className={`min-w-0 flex-1 border px-1 py-[9px] text-center text-[10px] uppercase tracking-[.5px] transition-colors ${
                  form.dayIntensity === level
                    ? level === 3
                      ? 'border-[#4fa63f] bg-[#4fa63f] font-bold text-black'
                      : level === 4
                        ? 'border-[#ffb000] bg-[#ffb000] font-bold text-black'
                        : 'border-[#3d6b34] bg-[#3d6b34] text-[#d8dcd4]'
                    : 'border-[#262b23] bg-transparent text-[#6b7268] hover:border-[#8a5f00] hover:text-[#d8dcd4]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      {(validation || saveError) && (
        <p className="mt-4 text-[11px] leading-5 text-destructive" data-testid="status-entry-validation">
          {validation || saveError}
        </p>
      )}
      <button
        type="submit"
        disabled={isSaving}
        data-testid="button-save-entry"
        className="mt-[22px] w-full bg-[#ffb000] px-4 py-3 text-[11.5px] font-bold uppercase tracking-[1.5px] text-black transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        {isSaving ? 'saving' : 'log today'}
      </button>
    </form>
  );
}