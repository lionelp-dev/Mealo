import { useFieldContext } from '@/hooks/form-context'
import FieldInfo from './form-field-info'
import { cn } from '@/lib/utils'

interface TextAreaFieldProps {
  label?: string
  placeholder?: string
  rows?: number
  className?: string
}

export default function TextAreaField({ label, placeholder, rows = 3, className }: TextAreaFieldProps) {
  const field = useFieldContext<string>()

  return (
    <div className={cn("flex flex-1 flex-col gap-2",className)}>
    {label && <label
        htmlFor={field.name}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>}
      <textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        rows={rows}
        className="textarea w-full flex-1"
        placeholder={placeholder}
      />
      <FieldInfo />
    </div>
  )
}
