import type { MealTimeRequestData } from '@laravel-types/generated'
import z from 'zod'
import { mealTimeSchema } from './meal_time.schema.ts'

export const mealTimeRequestSchema = z.object({
  name: mealTimeSchema,
}) satisfies z.ZodType<MealTimeRequestData>
