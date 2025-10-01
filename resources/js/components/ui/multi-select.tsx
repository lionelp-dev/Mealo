import { cn } from '@/lib/utils';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Popover from '@radix-ui/react-popover';
import { CheckIcon } from 'lucide-react';
import React, { useState } from 'react';

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
  placeholder = 'Sélectionnez des options...',
  className = '',
}) => {
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onValueChange([...value, optionValue]);
    } else {
      onValueChange(value.filter((v) => v !== optionValue));
    }
  };

  const getSelectedLabels = () => {
    return options
      .filter((option) => value.includes(option.value))
      .map((option) => option.label);
  };

  const displayValue = getSelectedLabels().join(', ') || placeholder;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className={cn('select', className)} aria-expanded={open}>
          <span className="truncate text-left">{displayValue}</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 max-h-60 w-[var(--radix-popover-trigger-width)] overflow-auto rounded-md border border-gray-200 bg-white p-2 shadow-lg"
          sideOffset={4}
        >
          <div className="space-y-2">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 rounded p-1 hover:bg-gray-50"
              >
                <Checkbox.Root
                  id={`${option.value}-checkbox`}
                  checked={value.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(option.value, checked === true)
                  }
                  className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                >
                  <Checkbox.Indicator>
                    <CheckIcon className="h-3 w-3 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label
                  htmlFor={`${option.value}-checkbox`}
                  className="flex-1 cursor-pointer text-sm select-none"
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

export type { MultiSelectProps, Option };
