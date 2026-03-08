import FieldInfo from './form-field-info';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { useFieldContext } from '@/hooks/form-context';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  className?: string;
  options: SelectOption[];
}

export default function SelectField({
  label,
  placeholder,
  className,
  options,
}: SelectFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className={cn('flex flex-col gap-3')}>
      {label && (
        <label htmlFor={field.name} className="text-base text-base-content">
          {label}
        </label>
      )}
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger className={cn('w-fit pr-9 pl-4.5', className)}>
          <SelectValue placeholder={placeholder}>
            {field.state.value
              ? options.find((opt) => opt.value === field.state.value)?.label
              : placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldInfo />
    </div>
  );
}
