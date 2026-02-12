import { useFieldContext } from '@/hooks/form-context';
import { cn } from '@/lib/utils';

type CheckboxFieldProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function CheckboxField({
  className,
  ...rest
}: CheckboxFieldProps) {
  const field = useFieldContext<string>();

  return (
    <input
      type="checkbox"
      id={field.name}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      className={cn('checkbox radio checkbox-sm', className)}
      {...rest}
    />
  );
}
