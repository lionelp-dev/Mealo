import { WorkspaceMemberRoleUpdateRequestData } from '@/types/generated';
import z from 'zod';

export const workspaceMemberRoleUpdateRequestSchema = z.object({
  user_id: z.number().positive("L'ID de l'utilisateur doit être positif"),
  role: z.enum(['editor', 'viewer'], {
    message: 'Le rôle doit être "editor" ou "viewer"',
  }),
}) satisfies z.ZodType<WorkspaceMemberRoleUpdateRequestData>;
