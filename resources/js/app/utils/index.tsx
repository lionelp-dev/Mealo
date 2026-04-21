import { EggFried, Utensils, CookingPot, Cookie } from 'lucide-react';

export function capitalize(text: string | undefined) {
  if (!text) return;
  const firstChar = text.at(0);
  if (firstChar) return firstChar.toUpperCase() + text.slice(1);
}

export function pluralize(word: string, count?: number | null) {
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

export const base64ToFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};
