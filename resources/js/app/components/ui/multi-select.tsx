import { cn } from '@/app/lib/';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Popover from '@radix-ui/react-popover';
import { CheckIcon, X } from 'lucide-react';
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
  className = '',
  placeholder = '',
}) => {
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onValueChange([...value, optionValue]);
    } else {
      onValueChange(value.filter((v) => v !== optionValue));
    }
  };

  const selectedLabels = options.filter((option) =>
    value.includes(option.value),
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn('select w-full appearance-none', className)}
          aria-expanded={open}
        >
          <span className="flex gap-2 truncate text-left">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleCheckboxChange(option.value, false)}
                  className="badge badge-secondary"
                >
                  {option.label}
                  <X size={14} />
                </div>
              ))
            ) : (
              <span className="text-base-content/50">{placeholder}</span>
            )}
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 max-h-60 w-[var(--radix-popover-trigger-width)] overflow-auto rounded-md border border-base-300 bg-base-100 p-2 shadow-lg"
          sideOffset={4}
        >
          <div className="space-y-2">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 rounded p-1 hover:bg-base-200"
              >
                <label className="flex flex-1 cursor-pointer items-center gap-3 text-sm text-base-content select-none">
                  <Checkbox.Root
                    checked={value.includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(option.value, checked === true)
                    }
                    className="flex h-4 w-4 items-center justify-center rounded border border-base-300 focus:outline-none data-[state=checked]:border-success data-[state=checked]:bg-success"
                  >
                    <Checkbox.Indicator>
                      <CheckIcon className="h-3 w-3 text-success-content" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
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
