import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100)
}

export function calculatePrice(
  startTime: Date,
  endTime: Date,
  hasStarAddon: boolean = false,
  hasPremiumCert: boolean = false
): number {
  const durationMs = endTime.getTime() - startTime.getTime()
  const durationSeconds = Math.max(1, Math.floor(durationMs / 1000))
  const durationMinutes = Math.max(0, Math.floor(durationSeconds / 60) - 1)
  
  const basePrice = parseInt(process.env.BASE_SECOND_PRICE || '5') * 100 // Convert to cents
  const perMinuteExtra = parseInt(process.env.PER_MINUTE_EXTRA || '0.05') * 100
  const starAddon = parseInt(process.env.STAR_ADDON || '3') * 100
  const premiumCertAddon = parseInt(process.env.PREMIUM_CERT_ADDON || '5') * 100
  
  let total = basePrice
  if (durationMinutes > 0) {
    total += durationMinutes * perMinuteExtra
  }
  
  if (hasStarAddon) {
    total += starAddon
  }
  
  if (hasPremiumCert) {
    total += premiumCertAddon
  }
  
  return total
} 