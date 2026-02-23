import { useFormContext } from '@/hooks/form-context';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SubmitButtonProps {
  label?: string;
  loadingLabel?: string;
  className?: string;
  children?: ReactNode;
}

export default function SubmitButton({
  label,
  loadingLabel = '...',
  className,
  children,
}: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(`btn btn-secondary`, className)}
        >
          {children}
          {isSubmitting ? loadingLabel : label}
        </button>
      )}
    </form.Subscribe>
  );
}
