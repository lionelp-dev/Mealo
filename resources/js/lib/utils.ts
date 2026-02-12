import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(text: string | undefined) {
  if (!text) return;
  const firstChar = text.at(0);
  if (firstChar) return firstChar.toUpperCase() + text.slice(1);
}
