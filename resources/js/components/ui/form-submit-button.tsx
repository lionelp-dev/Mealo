import { useFormContext } from '@/hooks/form-context';

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  className?: string;
}

export default function SubmitButton({
  label,
  loadingLabel = '...',
  className,
}: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <button
          type="submit"
          disabled={!canSubmit}
          className={`btn btn-primary ${className || ''}`}
        >
          {isSubmitting ? loadingLabel : label}
        </button>
      )}
    </form.Subscribe>
  );
}
