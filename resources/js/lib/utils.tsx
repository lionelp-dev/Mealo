import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Cookie, CookingPot, EggFried, Utensils } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(text: string | undefined) {
  if (!text) return;
  const firstChar = text.at(0);
  if (firstChar) return firstChar.toUpperCase() + text.slice(1);
}

export function pluralize(word: string, count?: number) {
  if (count) return count === 1 ? word : `${word}s`;
  return word;
}

export function getMealTimeIcon(
  expr: 'breakfast' | 'lunch' | 'diner' | 'snack',
) {
  switch (expr) {
    case 'breakfast': {
      return <EggFried className="h-4 w-4" />;
    }
    case 'lunch': {
      return <Utensils className="h-4 w-4" />;
    }
    case 'diner': {
      return <CookingPot className="h-4 w-4" />;
    }
    case 'snack': {
      return <Cookie className="h-4 w-4" />;
    }
    default:
      return <EggFried className="h-4 w-4" />;
  }
}
