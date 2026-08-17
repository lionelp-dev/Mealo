import z from 'zod';

export const RECIPE_GENERATION_COUNT_OPTIONS = [1, 3, 5, 10] as const;

/**
 * Predefined prompt presets shown as buttons in the generation popover.
 * `labelKey` / `promptKey` resolve i18n strings (with the inline fallbacks).
 */
export const RECIPE_PROMPT_PRESETS = [
  {
    id: 'quick',
    labelKey: 'recipes.generate.presets.quick.label',
    labelFallback: 'Rapide & facile',
    promptKey: 'recipes.generate.presets.quick.prompt',
    promptFallback:
      'Des recettes rapides et faciles, prêtes en moins de 20 minutes',
  },
  {
    id: 'vegetarian',
    labelKey: 'recipes.generate.presets.vegetarian.label',
    labelFallback: 'Végétarien',
    promptKey: 'recipes.generate.presets.vegetarian.prompt',
    promptFallback: 'Des recettes végétariennes savoureuses et équilibrées',
  },
  {
    id: 'healthy',
    labelKey: 'recipes.generate.presets.healthy.label',
    labelFallback: 'Healthy',
    promptKey: 'recipes.generate.presets.healthy.prompt',
    promptFallback: 'Des recettes saines, légères et équilibrées',
  },
  {
    id: 'comfort',
    labelKey: 'recipes.generate.presets.comfort.label',
    labelFallback: 'Réconfortant',
    promptKey: 'recipes.generate.presets.comfort.prompt',
    promptFallback: 'Des plats réconfortants et gourmands',
  },
  {
    id: 'world',
    labelKey: 'recipes.generate.presets.world.label',
    labelFallback: 'Cuisine du monde',
    promptKey: 'recipes.generate.presets.world.prompt',
    promptFallback: 'Des recettes du monde, variées et dépaysantes',
  },
  {
    id: 'budget',
    labelKey: 'recipes.generate.presets.budget.label',
    labelFallback: 'Anti-gaspi',
    promptKey: 'recipes.generate.presets.budget.prompt',
    promptFallback: 'Des recettes économiques et anti-gaspillage',
  },
] as const;

export const recipeAIGenerateRequestSchema = z.object({
  prompt: z
    .string()
    .max(255)
    .refine((value) => value === '' || value.length >= 5, {
      message: 'Prompt must be at least 5 characters',
    }),
  context: z.object({
    meal_time: z.string().max(50).nullable(),
    count: z
      .number()
      .refine(
        (value) =>
          RECIPE_GENERATION_COUNT_OPTIONS.includes(value as 1 | 3 | 5 | 10),
        { message: 'Invalid recipe count' },
      ),
  }),
  image_generation: z.boolean(),
});

export type RecipeAIGenerateRequest = z.infer<
  typeof recipeAIGenerateRequestSchema
>;
