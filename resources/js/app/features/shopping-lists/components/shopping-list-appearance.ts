const tones = {
  green: 'bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300',
  blue: 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300',
  amber: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300',
  violet:
    'bg-violet-50 text-violet-800 dark:bg-violet-950/40 dark:text-violet-300',
  teal: 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300',
  neutral: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

export type ShoppingListAppearance = {
  illustrationIndex: number;
  tone: keyof typeof tones;
};

// The illustration atlas has six columns and four rows, in reading order.
const categoryAppearances: Record<string, ShoppingListAppearance> = {
  fruits: { illustrationIndex: 4, tone: 'violet' },
  'legumes-herbes-fraiches': { illustrationIndex: 0, tone: 'green' },
  viandes: { illustrationIndex: 6, tone: 'rose' },
  charcuterie: { illustrationIndex: 7, tone: 'rose' },
  'poissons-fruits-de-mer': { illustrationIndex: 8, tone: 'blue' },
  oeufs: { illustrationIndex: 9, tone: 'amber' },
  'produits-laitiers': { illustrationIndex: 1, tone: 'blue' },
  'alternatives-vegetales': { illustrationIndex: 10, tone: 'green' },
  'pains-produits-boulangerie': { illustrationIndex: 11, tone: 'amber' },
  'pates-riz-cereales': { illustrationIndex: 12, tone: 'amber' },
  legumineuses: { illustrationIndex: 13, tone: 'green' },
  'farines-aides-patisserie': { illustrationIndex: 14, tone: 'rose' },
  'noix-graines-fruits-secs': { illustrationIndex: 15, tone: 'amber' },
  'conserves-bocaux': { illustrationIndex: 16, tone: 'teal' },
  'huiles-vinaigres': { illustrationIndex: 5, tone: 'teal' },
  'sauces-condiments': { illustrationIndex: 17, tone: 'amber' },
  'herbes-sechees-epices': { illustrationIndex: 2, tone: 'amber' },
  'epicerie-salee': { illustrationIndex: 18, tone: 'blue' },
  'epicerie-sucree': { illustrationIndex: 3, tone: 'rose' },
  'produits-surgeles': { illustrationIndex: 19, tone: 'blue' },
  boissons: { illustrationIndex: 20, tone: 'teal' },
  'produits-prepares': { illustrationIndex: 21, tone: 'violet' },
  autres: { illustrationIndex: 22, tone: 'neutral' },
};

export const recipeAppearance: ShoppingListAppearance = {
  illustrationIndex: 23,
  tone: 'blue',
};

export function getCategoryAppearance(slug: string): ShoppingListAppearance {
  return (
    categoryAppearances[slug] ?? { illustrationIndex: 22, tone: 'neutral' }
  );
}

export function getShoppingListTone(tone: ShoppingListAppearance['tone']) {
  return tones[tone];
}
