import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon  } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Sélectionnez des options...",
  className = ""
}) => {
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onValueChange([...value, optionValue]);
    } else {
      onValueChange(value.filter(v => v !== optionValue));
    }
  };

  const getSelectedLabels = () => {
    return options
      .filter(option => value.includes(option.value))
      .map(option => option.label);
  };

  const displayValue = getSelectedLabels().join(', ') || placeholder;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn('select',className)}
          aria-expanded={open}
        >
          <span className="truncate text-left">{displayValue}</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="w-[var(--radix-popover-trigger-width)] max-h-60 overflow-auto p-2 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          sideOffset={4}
        >
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                <Checkbox.Root
                  id={`${option.value}-checkbox`}
                  checked={value.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(option.value, checked === true)
                  }
                  className="flex items-center justify-center w-4 h-4 border border-gray-300 rounded data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Checkbox.Indicator>
                    <CheckIcon className="w-3 h-3 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label
                  htmlFor={`${option.value}-checkbox`}
                  className="text-sm cursor-pointer select-none flex-1"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export type { Option, MultiSelectProps };
