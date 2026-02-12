import { cn } from '@/lib/utils';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  className = '',
}: NumberInputProps) {
  return (
    <div className={`flex items-center gap-1`}>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn('input text-center', className)}
      />
    </div>
  );
}
