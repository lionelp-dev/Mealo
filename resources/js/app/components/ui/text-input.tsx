import FieldInfo from './form-field-info';
import { useFieldContext } from '@/app/hooks/form-context';
import { cn } from '@/app/lib/';

type TextInputProps = {
  label?: string;
} & React.ComponentProps<'input'>;

export default function TextField({
  label,
  className,
  ...rest
}: TextInputProps) {
  const field = useFieldContext<string>();
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
        <input
          type="text"
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className={cn(
            'input w-full min-w-0',
            className,
            !field.state.meta.isValid && 'input-error',
          )}
          {...rest}
        />
      </div>
      <FieldInfo />
    </div>
  );
}
