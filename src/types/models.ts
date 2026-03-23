export interface AppUser {
  id: string | number;
  full_name?: string | null;
  username?: string | null;
  balance_usd?: string | number | null;
  user_tag?: string | null;
  status?: string | null;
  referral_percent?: string | number | null;
  referrer_id?: string | number | null;
  created_at?: string | null;
}

export interface ProfitRow {
  id: string | number;
  worker_id: string | number;
  amount: string | number;
  net_profit?: string | number | null;
  service_name?: string | null;
  status?: string | null;
  created_at?: string | null;
  paid_at?: string | null;
  [key: string]: unknown;
}

export interface IdeaRow {
  id: string | number;
  user_id?: string | null;
  user_name?: string | null;
  category?: string | null;
  content?: string | null;
  votes_count?: number | null;
  liked_by?: string[] | null;
  created_at?: string | null;
}

export interface ServiceRow {
  id?: string | number;
  name?: string | null;
  icon?: string | null;
  description?: string | null;
  bot_link?: string | null;
  manual_link?: string | null;
  is_active?: boolean | null;
}

export interface ResourceRow {
  id?: string | number;
  title?: string | null;
  type?: string | null;
  content_link?: string | null;
  is_active?: boolean | null;
}

export interface ReferralUser {
  id: string | number;
  username?: string | null;
  full_name?: string | null;
  status?: string | null;
  created_at?: string | null;
}

export interface ReferralProfitRow {
  referral_id: string | number;
  amount: string | number;
}

export interface MentorRow {
  id: string | number;
  service_name?: string | null;
  percent?: string | number | null;
  user_id: string | number;
  is_active?: boolean | null;
  mu?: { full_name?: string | null; username?: string | null };
}

/** Активные наставники по сервисам (каталог для хаба и статистики). */
export interface MentorCatalogRow {
  id: string | number;
  user_id: string | number;
  service_name?: string | null;
  percent?: string | number | null;
  rating?: string | number | null;
  students_count?: number | null;
  total_earned?: string | number | null;
  is_active?: boolean | null;
  telegram_channel?: string | null;
  channel_invite_link?: string | null;
  mu?: { full_name?: string | null; username?: string | null };
}

export interface PollPayload {
  question: string;
  options: string[];
  votes: number[];
  voters: string[][];
}

