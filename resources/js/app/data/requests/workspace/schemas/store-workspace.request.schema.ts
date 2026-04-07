import { StoreWorkspaceRequestData } from '@/types/generated';
import z from 'zod';

export const storeWorkspaceRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom de l'espace de travail ne peut pas être vide")
    .max(255, 'Le nom ne doit pas dépasser 255 caractères'),
  is_personal: z.boolean(),
}) satisfies z.ZodType<StoreWorkspaceRequestData>;
