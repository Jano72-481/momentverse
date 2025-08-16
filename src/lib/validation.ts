import { z } from 'zod'

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// Moment creation schema
export const momentSchema = z.object({
  startTime: z.string().datetime('Please enter a valid start time'),
  endTime: z.string().datetime('Please enter a valid end time'),
  dedication: z.string().optional(),
  isPublic: z.boolean().default(true),
  hasStarAddon: z.boolean().default(false),
  hasPremiumCert: z.boolean().default(false),
})

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Password reset schema
export const passwordResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

// New password schema
export const newPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// Email verification schema
export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
})

// Star assignment schema
export const starAssignmentSchema = z.object({
  momentId: z.string().min(1, 'Moment ID is required'),
  starId: z.string().optional(),
})

// Analytics event schema
export const analyticsEventSchema = z.object({
  event: z.string().min(1, 'Event name is required'),
  source: z.string().optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

// Order status update schema
export const orderStatusSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']),
  stripePaymentIntentId: z.string().optional(),
})

// Certificate generation schema
export const certificateSchema = z.object({
  momentId: z.string().min(1, 'Moment ID is required'),
  forceRegenerate: z.boolean().default(false),
})

// Search/filter schema
export const searchSchema = z.object({
  query: z.string().optional(),
  userId: z.string().optional(),
  isPublic: z.boolean().optional(),
  hasStarAddon: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

// Rate limiting schema
export const rateLimitSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  action: z.string().min(1, 'Action is required'),
  windowMs: z.number().min(1000).default(60000), // 1 minute default
  maxRequests: z.number().min(1).default(100),
})

// Webhook signature verification schema
export const webhookSchema = z.object({
  signature: z.string().min(1, 'Signature is required'),
  payload: z.string().min(1, 'Payload is required'),
  secret: z.string().min(1, 'Secret is required'),
})

// Error response schema
export const errorResponseSchema = z.object({
  error: z.string().min(1, 'Error message is required'),
  code: z.string().optional(),
  details: z.record(z.any()).optional(),
})

// Success response schema
export const successResponseSchema = z.object({
  success: z.boolean().default(true),
  message: z.string().optional(),
  data: z.record(z.any()).optional(),
})

// Validation helper functions
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } => {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return { success: false, error: firstError?.message || 'Validation failed' }
    }
    return { success: false, error: 'Validation failed' }
  }
}

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000) // Limit length
}

// Validate time range
export const validateTimeRange = (startTime: Date, endTime: Date): { valid: boolean; error?: string } => {
  const now = new Date()
  const durationMs = endTime.getTime() - startTime.getTime()
  const maxDurationMs = 24 * 60 * 60 * 1000 // 24 hours

  if (startTime >= endTime) {
    return { valid: false, error: 'End time must be after start time' }
  }

  if (endTime <= now) {
    return { valid: false, error: 'Cannot dedicate moments in the past' }
  }

  if (durationMs > maxDurationMs) {
    return { valid: false, error: 'Duration cannot exceed 24 hours' }
  }

  return { valid: true }
}

// Validate price calculation
export const validatePrice = (basePrice: number, addons: { star?: boolean; premium?: boolean }): { valid: boolean; total: number; error?: string } => {
  let total = basePrice

  if (addons.star) {
    total += 300 // $3.00
  }

  if (addons.premium) {
    total += 400 // $4.00 (changed from $5.00 to maintain $9.99 total)
  }

  if (total < 299 || total > 5000) { // $2.99 to $50 range (updated minimum)
    return { valid: false, total: 0, error: 'Invalid price calculation' }
  }

  return { valid: true, total }
} 