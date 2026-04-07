import { DeclineWorkspaceInvitationRequestData } from '@/types/generated';
import z from 'zod';

export const declineWorkspaceInvitationRequestSchema = z.object({
  token: z.string().trim().min(1, 'Le token ne peut pas être vide'),
}) satisfies z.ZodType<DeclineWorkspaceInvitationRequestData>;
