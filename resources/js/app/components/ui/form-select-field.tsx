import FieldInfo from './form-field-info';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { useFieldContext } from '@/app/hooks/form-context';
import { cn } from '@/app/lib/';

interface SelectOption {
  value: string | number;
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
  const field = useFieldContext<string | number>();
  const selectedValue = String(field.state.value ?? '');
  const selectedOption = options.find(
    (option) => String(option.value) === selectedValue,
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex min-w-0 flex-col">
        {label && (
          <label
            htmlFor={field.name}
            className="min-w-0 text-left text-base leading-10 text-base-content"
          >
            {label}
          </label>
        )}
        <Select
          value={selectedValue}
          onValueChange={(value) => {
            const option = options.find(
              (option) => String(option.value) === value,
            );
            field.handleChange(option?.value ?? value);
          }}
        >
          <SelectTrigger
            id={field.name}
            onBlur={field.handleBlur}
            className={cn('w-full min-w-0 pr-9 pl-4.5', className)}
          >
            <SelectValue placeholder={placeholder}>
              <span className="block min-w-0 flex-1 truncate text-left">
                {selectedOption?.label ?? placeholder}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FieldInfo />
    </div>
  );
}
