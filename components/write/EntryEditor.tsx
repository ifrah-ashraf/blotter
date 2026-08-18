import type { EntryIntensity, LogEntry, LogEntryInput } from '@/lib/logbook/types';
import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';

type EntryEditorProps = {
  date: string;
  entry?: LogEntry;
  isSaving: boolean;
  saveError?: string;
  onSave: (data: LogEntryInput) => void;
  onDelete: () => void;
};

const blank: Omit<LogEntryInput, 'date'> = { intensity: 3, dsa: '', development: '', other: '' };

export function EntryEditor({ date, entry, isSaving, saveError, onSave, onDelete }: EntryEditorProps) {
  const initialForm = entry ? { intensity: entry.intensity, dsa: entry.dsa, development: entry.development, other: entry.other } : blank;
  const [form, setForm] = useState(initialForm);
  const [validation, setValidation] = useState('');

  const update = (field: keyof typeof form, value: string | EntryIntensity) =>
    setForm((current) => ({ ...current, [field]: value }));
  
  const submit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.dsa.trim() && !form.development.trim() && !form.other.trim()) { 
      setValidation('Leave one trace before saving. One sentence is enough.'); 
      return; 
    }
    setValidation('');
    onSave({ date, ...form });
  };
  
  return (
    <form onSubmit={submit} className="blotter-panel" data-testid="form-entry-editor">
      <div className="blotter-panel-label">today's log</div>
      <div>
        {[
          { key: 'dsa' as const, label: 'dsa', hint: 'What you worked through today...' },
          { key: 'development' as const, label: 'development', hint: 'What you built or fixed...' },
          { key: 'other' as const, label: 'maths / other', hint: 'What you drilled...' },
        ].map((field) => (
          <div key={field.key} className="mb-4 last:mb-0">
            <label htmlFor={`entry-${field.key}`} className="mb-[6px] block text-[9px] uppercase tracking-[1.5px] text-[#6b7268]">
              {field.label}
            </label>
            <textarea 
              id={`entry-${field.key}`} 
              value={form[field.key]} 
              onChange={(event) => update(field.key, event.target.value)} 
              placeholder={field.hint} 
              data-testid={`input-entry-${field.key}`} 
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
                onClick={() => update('intensity', level)} 
                data-testid={`button-intensity-${level}`} 
                className={`min-w-0 flex-1 border px-1 py-[9px] text-center text-[10px] uppercase tracking-[.5px] transition-colors ${
                  form.intensity === level 
                    ? (level === 3 
                        ? 'border-[#4fa63f] bg-[#4fa63f] font-bold text-black' 
                        : level === 4 
                          ? 'border-[#ffb000] bg-[#ffb000] font-bold text-black' 
                          : 'border-[#3d6b34] bg-[#3d6b34] text-[#d8dcd4]'
                      ) 
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
      {entry && (
        <button 
          type="button" 
          onClick={onDelete} 
          data-testid="button-delete-today-entry" 
          className="mt-3 block w-full text-center text-[9px] uppercase tracking-[1px] text-[#454b41] hover:text-destructive"
        >
          remove entry
        </button>
      )}
    </form>
  );
}