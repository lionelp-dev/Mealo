import { WorkspaceMemberDeleteRequestData } from '@/types/generated';
import z from 'zod';

export const workspaceDeleteMemberRequestSchema = z.object({
  user_id: z.number().positive("L'ID de l'utilisateur doit être positif"),
}) satisfies z.ZodType<WorkspaceMemberDeleteRequestData>;
