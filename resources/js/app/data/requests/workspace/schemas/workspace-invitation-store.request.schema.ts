import { WorkspaceInvitationStoreRequestData } from '@/types/generated';
import z from 'zod';

export const workspaceInvitationStoreRequestSchema = z.object({
  workspace_id: z
    .number()
    .positive("L'ID de l'espace de travail doit être positif"),
  email: z
    .string()
    .email("L'email doit être valide")
    .min(1, "L'email ne peut pas être vide"),
  role: z.enum(['editor', 'viewer'], {
    message: 'Le rôle doit être "editor" ou "viewer"',
  }),
}) satisfies z.ZodType<WorkspaceInvitationStoreRequestData>;
