import { useStore } from '@tanstack/react-form';
import { AlertTriangle } from 'lucide-react';
import { useFieldContext } from '@/hooks/form-context';

function FieldInfo() {
  const field = useFieldContext();
  const meta = useStore(field.store, (state) => state.meta);

  return (meta.isTouched && !meta.isValid)? (
        <em className="text-xs flex items-start gap-1 text-red-700">
          <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
          <span className="break-words">
            {meta.errors.map((err) => err.message).join(', ')}
          </span>
        </em>
      ):undefined
}

export default FieldInfo;

