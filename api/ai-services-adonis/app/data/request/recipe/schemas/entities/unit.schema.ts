import type { Unit } from '@laravel-types/generated'
import z from 'zod'

export const units = [
  'ml',
  'cl',
  'dl',
  'l',
  'tsp',
  'tbsp',
  'fl oz',
  'cup',
  'pint',
  'quart',
  'gallon',
  'mg',
  'g',
  'kg',
  'oz',
  'lb',
  'piece',
  'pinch',
  'dash',
  'handful',
  'slice',
  'clove',
  'bunch',
  'package',
  'can',
  'jar',
  'bottle',
  'box',
  'bag',
  'to taste',
  'as needed',
] as const satisfies readonly Unit[]

export const unitSchema = z.enum(units) satisfies z.ZodType<Unit>
