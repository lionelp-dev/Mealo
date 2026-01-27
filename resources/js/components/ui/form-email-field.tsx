import { useFieldContext } from '@/hooks/form-context';
import { cn } from '@/lib/utils';
import FieldInfo from './form-field-info';

interface EmailFieldProps {
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function EmailField({
  label,
  placeholder,
  className,
}: EmailFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className={cn('flex flex-1 flex-col gap-3', className)}>
      {label && (
        <label htmlFor={field.name} className="text-md text-base-content">
          {label}
        </label>
      )}
      <input
        type="email"
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className="input w-full"
        placeholder={placeholder}
      />
      <FieldInfo />
    </div>
  );
}
