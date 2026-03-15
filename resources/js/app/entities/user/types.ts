export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  avatar?: string;
  local?: string;
  two_factor_enabled?: boolean;
  is_beta_user?: boolean;
  beta_expires_at?: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
};

export type Auth = {
  user: User;
};
