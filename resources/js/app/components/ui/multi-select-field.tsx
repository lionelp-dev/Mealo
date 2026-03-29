import FieldInfo from '@/app/components/ui/form-field-info';
import { useFieldContext } from '@/app/hooks/form-context';
import { cn } from '@/app/lib/';
import { useMemo } from 'react';
import Select from 'react-select';

interface SelectOption {
  value: number;
  label: string;
}

interface MultiSelectFieldProps {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
}

export function MultiSelectField({
  options,
  label,
  placeholder,
}: MultiSelectFieldProps) {
  const field = useFieldContext<Array<{ id?: number; name: string }>>();

  const selectedValues = useMemo(() => {
    const values = field.state.value ?? [];
    return values.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }, [field.state.value]);

  return (
    <div className="flex flex-col gap-4">
      {label && <label className="text-base text-base-content">{label}</label>}
      <Select
        isMulti
        name={field.name}
        value={selectedValues}
        options={options}
        placeholder={placeholder}
        className={cn(
          'basic-multi-select input w-full gap-0 px-0',
          !field.state.meta.isValid && 'input-error',
        )}
        classNames={{
          control: () => 'pl-1 !w-full !border-0 outline-0 !bg-transparent',
        }}
        classNamePrefix="select"
        onBlur={field.handleBlur}
        onChange={(selectedOptions) => {
          console.log(selectedOptions);
          const transformed = selectedOptions.map((opt) => ({
            id: opt.value,
            name: opt.label,
          }));
          field.handleChange(transformed);
        }}
      />
      <FieldInfo />
    </div>
  );
}
