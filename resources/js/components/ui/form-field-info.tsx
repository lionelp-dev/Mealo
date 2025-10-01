import { useFieldContext } from '@/hooks/form-context';
import { useStore } from '@tanstack/react-form';
import { AlertTriangle } from 'lucide-react';

function FieldInfo() {
  const field = useFieldContext();
  const meta = useStore(field.store, (state) => state.meta);

  return meta.isTouched && !meta.isValid ? (
    <em className="flex items-end gap-1 text-xs text-red-700">
      <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
      <span className="break-words">
        {meta.errors.map((err) => err.message).join(', ')}
      </span>
    </em>
  ) : undefined;
}

export default FieldInfo;
