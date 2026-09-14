import { useFieldContext } from '@/app/hooks/form-context';
import { useStore } from '@tanstack/react-form';
import { AlertTriangle } from 'lucide-react';

function FieldInfo() {
  const field = useFieldContext();
  const meta = useStore(field.store, (state) => state.meta);

  return meta.isTouched && !meta.isValid ? (
    <em className="flex min-w-0 items-start gap-2 text-sm text-error">
      <AlertTriangle size={14} className="flex-shrink-0" />
      <span className="min-w-0 break-words">
        {[...new Set(meta.errors.map((err) => err.message))].join(', ')}
      </span>
    </em>
  ) : undefined;
}

export default FieldInfo;
