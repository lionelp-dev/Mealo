import { useFieldContext } from '@/app/hooks/form-context';
import { useStore } from '@tanstack/react-form';
import { AlertTriangle } from 'lucide-react';

function FieldInfo() {
  const field = useFieldContext();
  const meta = useStore(field.store, (state) => state.meta);

  return meta.isTouched && !meta.isValid ? (
    <em className="flex items-center gap-2 text-sm text-error">
      <AlertTriangle size={14} className="flex-shrink-0" />
      <span className="whitespace-nowrap">
        {[...new Set(meta.errors.map((err) => err.message))].join(', ')}
      </span>
    </em>
  ) : undefined;
}

export default FieldInfo;
