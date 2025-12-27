import { useFieldContext } from '@/hooks/form-context';
import { cn } from '@/lib/utils';
import FieldInfo from './form-field-info';

type InputFieldProps = {
  label?: string;
} & React.ComponentProps<'input'>;

export default function InputField({
  label,
  className,
  ...rest
}: InputFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-1 flex-col gap-4">
      {label && (
        <label
          htmlFor={field.name}
          className="text-md text-left text-base-content"
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
        className={cn('input w-full', className)}
        {...rest}
      />
      <FieldInfo />
    </div>
  );
}
