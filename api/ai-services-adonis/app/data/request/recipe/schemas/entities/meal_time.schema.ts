import type { MealTimeEnum } from '@laravel-types/generated'
import z from 'zod'

export const mealTimes = [
  'breakfast',
  'lunch',
  'diner',
  'snack',
] as const satisfies readonly MealTimeEnum[]

export const mealTimeSchema = z.enum(mealTimes) satisfies z.ZodType<MealTimeEnum>
