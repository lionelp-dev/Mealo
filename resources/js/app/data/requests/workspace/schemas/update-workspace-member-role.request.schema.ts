import { UpdateWorkspaceMemberRoleRequestData } from '@/types/generated';
import z from 'zod';

export const updateWorkspaceMemberRoleRequestSchema = z.object({
  user_id: z.number().positive("L'ID de l'utilisateur doit être positif"),
  role: z.enum(['editor', 'viewer'], {
    message: 'Le rôle doit être "editor" ou "viewer"',
  }),
}) satisfies z.ZodType<UpdateWorkspaceMemberRoleRequestData>;
