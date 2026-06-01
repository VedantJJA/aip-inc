import type {
  Service,
  QuoteRequest,
  SiteSetting,
  AdminUser,
} from "@prisma/client";

// Re-export Prisma types for convenience
export type { Service, QuoteRequest, SiteSetting, AdminUser };

// ─── API Response Types ──────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── Quote with Service (joined) ─────────────────────────────────────────────

export interface QuoteWithService extends QuoteRequest {
  service: Service;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export interface DashboardStats {
  totalQuotes: number;
  newQuotes: number;
  activeServices: number;
  recentQuotes: QuoteWithService[];
}

// ─── Settings Map (key → value) ──────────────────────────────────────────────

export type SettingsMap = Record<string, string>;

// ─── Navigation Item ─────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}
