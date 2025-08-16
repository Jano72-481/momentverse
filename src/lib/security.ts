import crypto from 'crypto'
import { NextRequest } from 'next/server'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100 // requests per window

// Rate limiting function
export const checkRateLimit = (identifier: string): { allowed: boolean; remaining: number; resetTime: number } => {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime: now + RATE_LIMIT_WINDOW }
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }
  
  record.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count, resetTime: record.resetTime }
}

// Clean up old rate limit entries
export const cleanupRateLimitStore = () => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000) // Limit length
}

// Generate secure random token
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex')
}

// Hash sensitive data
export const hashData = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex')
}

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export const validatePasswordStrength = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Get client IP address
export const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    const parts = forwarded.split(',')
    if (parts.length > 0 && parts[0]) {
      return parts[0].trim()
    }
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return 'unknown'
}

// Validate CSRF token
export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  if (!token || !sessionToken) {
    return false
  }
  
  // In a real implementation, you'd validate against the session token
  // For now, we'll do a simple comparison
  return token === sessionToken
}

// Generate CSRF token
export const generateCSRFToken = (): string => {
  return generateSecureToken(32)
}

// Validate file upload
export const validateFileUpload = (file: File, maxSize: number = 5 * 1024 * 1024): { valid: boolean; error?: string } => {
  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large' }
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' }
  }
  
  return { valid: true }
}

// Sanitize filename
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(0, 100)
}

// Validate URL
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Escape HTML
export const escapeHTML = (str: string): string => {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

// Validate date range
export const validateDateRange = (startDate: Date, endDate: Date, maxDurationHours: number = 24): { valid: boolean; error?: string } => {
  const now = new Date()
  const durationMs = endDate.getTime() - startDate.getTime()
  const maxDurationMs = maxDurationHours * 60 * 60 * 1000

  if (startDate >= endDate) {
    return { valid: false, error: 'End date must be after start date' }
  }

  if (endDate <= now) {
    return { valid: false, error: 'Cannot create moments in the past' }
  }

  if (durationMs > maxDurationMs) {
    return { valid: false, error: `Duration cannot exceed ${maxDurationHours} hours` }
  }

  return { valid: true }
}

// Set security headers
export const setSecurityHeaders = (response: Response): Response => {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  
  return response
} 