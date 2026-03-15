export type BetaRequest = {
  id: number;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'converted' | 'expired';
  created_at: string;
  approved_at: string | null;
  token_expires_at: string | null;
  rejection_reason: string | null;
  approved_by: { id: number; name: string } | null;
};
