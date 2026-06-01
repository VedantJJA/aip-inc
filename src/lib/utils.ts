import { type ClassValue, clsx } from "clsx";

/**
 * Merge Tailwind CSS classes without conflicts.
 * We use clsx for conditional classes (shadcn/ui compatibility).
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format price from cents to a display string.
 * e.g., 49900 → "$499.00"  |  49900 → "$499" (no decimals)
 */
export function formatPrice(
  priceInCents: number,
  options?: { showDecimals?: boolean; currency?: string }
): string {
  const dollars = priceInCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: options?.currency || "USD",
    minimumFractionDigits: options?.showDecimals ? 2 : 0,
    maximumFractionDigits: options?.showDecimals ? 2 : 0,
  }).format(dollars);
}

/**
 * Convert a string to a URL-safe slug.
 * e.g., "Website Development" → "website-development"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Format a date to a readable string.
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Get human-readable budget range label.
 */
export function getBudgetLabel(budget: string): string {
  const labels: Record<string, string> = {
    UNDER_1K: "Under $1,000",
    ONE_TO_5K: "$1,000 – $5,000",
    FIVE_TO_10K: "$5,000 – $10,000",
    TEN_TO_25K: "$10,000 – $25,000",
    ABOVE_25K: "$25,000+",
  };
  return labels[budget] ?? budget;
}

/**
 * Get human-readable timeline label.
 */
export function getTimelineLabel(timeline: string): string {
  const labels: Record<string, string> = {
    ASAP: "As soon as possible",
    ONE_MONTH: "Within 1 month",
    ONE_TO_3_MONTHS: "1 – 3 months",
    THREE_PLUS_MONTHS: "3+ months",
    FLEXIBLE: "Flexible",
  };
  return labels[timeline] ?? timeline;
}

/**
 * Get human-readable quote status label and color.
 */
export function getStatusInfo(status: string): {
  label: string;
  color: string;
} {
  const info: Record<string, { label: string; color: string }> = {
    NEW: { label: "New", color: "bg-blue-500/20 text-blue-400" },
    REVIEWED: { label: "Reviewed", color: "bg-yellow-500/20 text-yellow-400" },
    CONTACTED: {
      label: "Contacted",
      color: "bg-emerald-500/20 text-emerald-400",
    },
    CLOSED: { label: "Closed", color: "bg-neutral-500/20 text-neutral-400" },
  };
  return info[status] ?? { label: status, color: "bg-neutral-500/20 text-neutral-400" };
}

/**
 * Parse features stored as a JSON string (SQLite) or return array directly (PostgreSQL).
 */
export function parseFeatures(features: string | string[]): string[] {
  if (Array.isArray(features)) return features;
  try {
    return JSON.parse(features);
  } catch {
    return [];
  }
}
