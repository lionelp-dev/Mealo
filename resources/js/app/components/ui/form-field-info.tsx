import { Typography } from '@/app/components/Typography';
import { useFieldContext } from '@/app/hooks/form-context';
import { useStore } from '@tanstack/react-form';
import { AlertTriangle } from 'lucide-react';

function FieldInfo() {
  const field = useFieldContext();
  const meta = useStore(field.store, (state) => state.meta);

  return meta.isTouched && !meta.isValid ? (
    <Typography
      as="em"
      variant="body-sm"
      tone="error"
      className="flex min-w-0 items-start gap-2"
    >
      <AlertTriangle size={14} className="flex-shrink-0" />
      <Typography
        as="span"
        variant="body-sm"
        tone="inherit"
        className="min-w-0 break-words"
      >
        {[...new Set(meta.errors.map((err) => err.message))].join(', ')}
      </Typography>
    </Typography>
  ) : undefined;
}

export default FieldInfo;
