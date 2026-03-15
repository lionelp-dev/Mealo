interface RangeInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  className?: string;
}

export function RangeInput({
  value,
  onChange,
  min,
  max,
  className = '',
}: RangeInputProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`range range-xs ${className}`}
    />
  );
}
