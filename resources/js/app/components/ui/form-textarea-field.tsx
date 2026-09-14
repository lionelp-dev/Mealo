import FieldInfo from './form-field-info';
import { useFieldContext } from '@/app/hooks/form-context';
import { cn } from '@/app/lib/';

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
    <div className={cn('flex min-w-0 flex-1 flex-col gap-3', className)}>
      {label && (
        <label
          htmlFor={field.name}
          className="min-w-0 text-base text-base-content"
        >
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
        style={{
          minHeight: `${rows * 1.5 + 1}rem`,
          overflow: 'auto',
          resize: 'vertical',
        }}
        className={cn(
          'textarea block h-auto w-full min-w-0 resize-y overflow-auto',
          className,
          !field.state.meta.isValid && 'textarea-error',
        )}
        placeholder={placeholder}
      />
      <FieldInfo />
    </div>
  );
}
