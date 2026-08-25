import type { IngredientCategoryEnum } from '@laravel-types/generated'
import z from 'zod'

export const ingredientCategories = [
  'fruits',
  'legumes-herbes-fraiches',
  'viandes',
  'charcuterie',
  'poissons-fruits-de-mer',
  'oeufs',
  'produits-laitiers',
  'alternatives-vegetales',
  'pains-produits-boulangerie',
  'pates-riz-cereales',
  'legumineuses',
  'farines-aides-patisserie',
  'noix-graines-fruits-secs',
  'conserves-bocaux',
  'huiles-vinaigres',
  'sauces-condiments',
  'herbes-sechees-epices',
  'epicerie-salee',
  'epicerie-sucree',
  'produits-surgeles',
  'boissons',
  'produits-prepares',
  'autres',
] as const satisfies readonly IngredientCategoryEnum[]

export const ingredientCategorySchema = z.enum(
  ingredientCategories
) satisfies z.ZodType<IngredientCategoryEnum>
