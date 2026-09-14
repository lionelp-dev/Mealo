import FieldInfo from '@/app/components/ui/form-field-info';
import { useFieldContext } from '@/app/hooks/form-context';
import { cn } from '@/app/lib/';
import { CheckIcon } from 'lucide-react';

interface MealTimeOption {
  value: number;
  label: string;
  slug: string;
}

interface MealTimesCheckboxFieldProps {
  options: MealTimeOption[];
  label?: string;
}

export function MealTimesCheckboxField({
  options,
  label,
}: MealTimesCheckboxFieldProps) {
  const field = useFieldContext<Array<{ id: number; slug: string }>>();
  const selectedMealTimes = field.state.value ?? [];

  const toggleMealTime = (option: MealTimeOption) => {
    const isSelected = selectedMealTimes.some(
      (mealTime) => mealTime.id === option.value,
    );

    if (isSelected) {
      field.handleChange(
        selectedMealTimes.filter((mealTime) => mealTime.id !== option.value),
      );
      return;
    }

    field.handleChange([
      ...selectedMealTimes,
      {
        id: option.value,
        slug: option.slug,
      },
    ]);
  };

  return (
    <div
      className="flex w-full min-w-0 flex-col gap-4"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          field.handleBlur();
        }
      }}
    >
      {label && (
        <label className="min-w-0 text-base text-base-content">{label}</label>
      )}

      <div className={cn('flex min-w-0 flex-wrap gap-2 rounded-lg p-0.5')}>
        {options.map((option) => {
          const isSelected = selectedMealTimes.some(
            (mealTime) => mealTime.id === option.value,
          );

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggleMealTime(option)}
              className={cn(
                'btn min-h-0 min-w-0 flex-1 border-base-300 px-1.75 pl-6.25 font-medium btn-sm md:btn-md',

                !field.state.meta.isValid && 'border-error',
                isSelected
                  ? 'border-secondary bg-secondary text-secondary-content hover:border-secondary hover:bg-secondary'
                  : 'bg-base-100 text-base-content hover:border-secondary/40 hover:bg-secondary/10',
              )}
            >
              <span className="min-w-0 truncate">{option.label}</span>
              <CheckIcon
                className={cn('h-4 w-4', !isSelected && 'opacity-0')}
              />
            </button>
          );
        })}
      </div>

      <FieldInfo />
    </div>
  );
}
