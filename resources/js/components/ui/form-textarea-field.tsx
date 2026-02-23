import { useFieldContext } from '@/hooks/form-context';
import { cn } from '@/lib/utils';
import FieldInfo from './form-field-info';

interface TextAreaFieldProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function TextAreaField({
  label,
  placeholder,
  rows = 6,
  className,
}: TextAreaFieldProps) {
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
        className="textarea w-full flex-1"
        placeholder={placeholder}
      />
      <FieldInfo />
    </div>
  );
}
