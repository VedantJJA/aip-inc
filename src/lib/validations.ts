import { z } from "zod/v4";

// ─── Service Validation ─────────────────────────────────────────────────────────

export const serviceSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly (lowercase, hyphens only)"),
  category: z.enum(["SOFTWARE", "HARDWARE"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters").max(200),
  startingPrice: z.number().int().min(0, "Price must be a positive number"),
  features: z.string().min(2, "Features JSON is required"),
  iconName: z.string().min(1, "Icon name is required"),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

// ─── Quote Request Validation ────────────────────────────────────────────────────

export const quoteRequestSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  clientEmail: z.email("Please enter a valid email address"),
  clientPhone: z.string().optional(),
  companyName: z.string().optional(),
  serviceId: z.string().min(1, "Please select a service"),
  projectDetails: z.string().min(20, "Please provide at least 20 characters of detail"),
  budget: z.enum(["UNDER_1K", "ONE_TO_5K", "FIVE_TO_10K", "TEN_TO_25K", "ABOVE_25K"]),
  timeline: z.enum(["ASAP", "ONE_MONTH", "ONE_TO_3_MONTHS", "THREE_PLUS_MONTHS", "FLEXIBLE"]),
  customerId: z.string().optional(),
});

export type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>;

// ─── Settings Validation ─────────────────────────────────────────────────────────

export const settingUpdateSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export const settingsUpdateSchema = z.object({
  settings: z.array(settingUpdateSchema),
});

export type SettingsUpdateData = z.infer<typeof settingsUpdateSchema>;

// ─── Auth Validation ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Quote Status Update ─────────────────────────────────────────────────────────

export const quoteStatusUpdateSchema = z.object({
  status: z.enum(["NEW", "REVIEWED", "CONTACTED", "ACCEPTED", "REJECTED", "CLOSED"]).optional(),
  adminNotes: z.string().optional(),
  assignedToId: z.string().nullable().optional(),
  assignedTeamId: z.string().nullable().optional(),
  currentMilestone: z.enum(["SUBMITTED", "UNDER_REVIEW", "PROPOSAL_SENT", "IN_PROGRESS", "TESTING", "DELIVERED", "CLOSED"]).optional(),
  progressPercent: z.number().int().min(0).max(100).optional(),
});

export type QuoteStatusUpdateData = z.infer<typeof quoteStatusUpdateSchema>;
