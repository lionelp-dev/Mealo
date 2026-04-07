import { DeleteWorkspaceMemberRequestData } from '@/types/generated';
import z from 'zod';

export const deleteWorkspaceMemberRequestSchema = z.object({
  user_id: z.number().positive("L'ID de l'utilisateur doit être positif"),
}) satisfies z.ZodType<DeleteWorkspaceMemberRequestData>;
