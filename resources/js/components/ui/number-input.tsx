import { useFieldContext } from '@/hooks/form-context';
import { cn } from '@/lib/utils';
import FieldInfo from './form-field-info';

type NumberInputProps = {
  label?: string;
} & React.ComponentProps<'input'>;

export default function NumberField({
  label,
  className,
  ...rest
}: NumberInputProps) {
  const field = useFieldContext<number>();

  return (
    <div className="flex flex-1 flex-col gap-4">
      {label && (
        <label
          htmlFor={field.name}
          className="text-base truncate text-left text-base-content"
        >
          {label}
        </label>
      )}
      <input
        type="number"
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(Number(e.target.value))}
        className={cn('input w-full', className)}
        {...rest}
      />
      <FieldInfo />
    </div>
  );
}
