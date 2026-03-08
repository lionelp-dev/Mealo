import FieldInfo from '@/components/ui/form-field-info';
import { cn } from '@/lib/utils';
import { MealTime } from '@/types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

interface MealTimeSelectFieldProps {
  field: {
    state: {
      value: MealTime[];
      meta: {
        isValid: boolean;
      };
    };
    handleBlur: () => void;
    handleChange: (value: MealTime[]) => void;
  };
  mealTimes: MealTime[];
}

export function MealTimeSelectField({
  field,
  mealTimes,
}: MealTimeSelectFieldProps) {
  const { t } = useTranslation();

  const options = useMemo(
    () => mealTimes.map((mt) => ({ value: mt.name, label: mt.name })),
    [mealTimes],
  );

  const selectedValues = useMemo(
    () =>
      (field.state.value as MealTime[])?.map((mt) => ({
        value: mt.name,
        label: mt.name,
      })) ?? [],
    [field.state.value],
  );

  return (
    <div className="flex flex-col gap-4">
      <label className="text-base text-base-content">
        {t('recipes.form.mealTimesTitle', 'Meal times')}
      </label>
      <Select
        isMulti
        name="meal_times"
        value={selectedValues}
        options={options}
        className={cn(
          'basic-multi-select input w-full gap-0 px-0',
          !field.state.meta.isValid && 'input-error',
        )}
        classNames={{
          control: () => 'pl-1 !w-full !border-0 outline-0 !bg-transparent',
        }}
        classNamePrefix="select"
        onBlur={field.handleBlur}
        onChange={(values) =>
          field.handleChange(
            values.flatMap((v: { value: string; label: string }) =>
              mealTimes.filter((m: MealTime) => m.name === v.value),
            ),
          )
        }
      />
      <FieldInfo />
    </div>
  );
}
