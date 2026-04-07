import { UpdateWorkspaceRequestData } from '@/types/generated';
import z from 'zod';

export const updateWorkspaceRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom de l'espace de travail ne peut pas être vide")
    .max(255, 'Le nom ne doit pas dépasser 255 caractères')
    .nullable(),
  is_personal: z.boolean().nullable(),
}) satisfies z.ZodType<UpdateWorkspaceRequestData>;
