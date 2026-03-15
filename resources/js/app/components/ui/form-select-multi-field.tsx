import FieldInfo from './form-field-info';
import { useFieldContext } from '@/app/hooks/form-context';
import { cn } from '@/app/lib/';

interface SelectMultiFieldProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function SelectMultiField({
  label,
  placeholder,
  rows = 6,
  className,
}: SelectMultiFieldProps) {
  const field = useFieldContext<string>();
  return (
    <div className={cn('flex flex-1 flex-col gap-3', className)}>
      {label && (
        <label htmlFor={field.name} className="text-base text-base-content">
          {label}
        </label>
      )}
      <textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        rows={rows}
        className={cn(
          'textarea w-full flex-1',
          className,
          !field.state.meta.isValid && 'textarea-error',
        )}
        placeholder={placeholder}
      />
      <FieldInfo />
    </div>
  );
}
