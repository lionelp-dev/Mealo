import { useFieldContext } from '@/app/hooks/form-context';
import { cn } from '@/app/lib/';

type RadioFieldProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function RadioField({ className, ...rest }: RadioFieldProps) {
  const field = useFieldContext<string>();

  return (
    <input
      type="radio"
      id={field.name}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      className={cn('radio radio-sm', className)}
      {...rest}
    />
  );
}
