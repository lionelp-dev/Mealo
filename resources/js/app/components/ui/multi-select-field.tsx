import FieldInfo from '@/app/components/ui/form-field-info';
import { useFieldContext } from '@/app/hooks/form-context';
import { cn } from '@/app/lib/';
import { useMemo } from 'react';
import Select from 'react-select';

interface SelectOption {
  value: number;
  label: string;
  slug: string;
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
  const field = useFieldContext<Array<{ id: number; slug: string }>>();

  const selectedValues = useMemo(() => {
    const values = field.state.value ?? [];
    return values.map((item) => ({
      value: item.id,
      label: options.find((option) => option.value === item.id)?.label ?? '',
      slug: item.slug,
    }));
  }, [field.state.value, options]);

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
          const transformed = selectedOptions.map((opt) => ({
            id: opt.value,
            slug: opt.slug,
          }));
          field.handleChange(transformed);
        }}
      />
      <FieldInfo />
    </div>
  );
}
