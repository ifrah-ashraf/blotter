import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { MonthlyGoal } from '@/lib/logbook/types';

type GoalCardProps = {
  data: MonthlyGoal[] | undefined;  // allow undefined while loading
  currentMonth: string;
  onMonthChange: (month: string) => void;
};

export function GoalCard({ data, currentMonth, onMonthChange }: GoalCardProps) {
  // Safely get current month's goal
  const currentMonthData = useMemo(() => {
    return data?.find(item => item.month === currentMonth);
  }, [data, currentMonth]);

  // Available months for navigation
  const availableMonths = useMemo(() => {
    if (!data) return [];
    return data.map(item => item.month).sort();
  }, [data]);

  const currentIndex = availableMonths.indexOf(currentMonth);
  const isPrevDisabled = currentIndex <= 0;
  const isNextDisabled = currentIndex >= availableMonths.length - 1;

  const monthDate = new Date(`${currentMonth}-01T12:00:00`);
  const monthLabel = new Intl.DateTimeFormat('en', { month: 'long' }).format(monthDate);
  const yearLabel = monthDate.getFullYear();

  const handlePrevMonth = () => {
    if (isPrevDisabled) return;
    onMonthChange(availableMonths[currentIndex - 1]);
  };

  const handleNextMonth = () => {
    if (isNextDisabled) return;
    onMonthChange(availableMonths[currentIndex + 1]);
  };

  return (
    <section className="blotter-goal" data-testid="section-monthly-goal">
      <div className="blotter-goal-label">
        <span>{monthLabel} {yearLabel} goal</span>
        <div className="flex items-center gap-1">
          <button 
            type="button" 
            onClick={handlePrevMonth} 
            disabled={isPrevDisabled}
            className="p-1 text-[#6b7268] transition-colors hover:text-[#ffb000] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-[#6b7268]"
            aria-label="Previous month"
          >
            <ChevronLeft size={14} />
          </button>
          <button 
            type="button" 
            onClick={handleNextMonth} 
            disabled={isNextDisabled}
            className="p-1 text-[#6b7268] transition-colors hover:text-[#ffb000] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-[#6b7268]"
            aria-label="Next month"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      
      {currentMonthData ? (
        <p className="blotter-goal-text">
          {currentMonthData.goalText}
        </p>
      ) : (
        <p className="blotter-goal-text text-[#6b7268] italic text-xs">
          No goal set for this month.
        </p>
      )}
    </section>
  );
}