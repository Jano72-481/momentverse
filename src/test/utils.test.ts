import { describe, it, expect } from 'vitest'
import { calculatePrice, formatPrice } from '@/lib/utils'

describe('Utils', () => {
  describe('calculatePrice', () => {
    it('should calculate base price for 60 seconds', () => {
      const startTime = new Date('2024-01-01T00:00:00Z')
      const endTime = new Date('2024-01-01T00:01:00Z') // 60 seconds later
      
      const price = calculatePrice(startTime, endTime)
      expect(price).toBe(500) // $5.00 in cents
    })

    it('should add extra for additional minutes', () => {
      const startTime = new Date('2024-01-01T00:00:00Z')
      const endTime = new Date('2024-01-01T00:02:00Z') // 2 minutes later
      
      const price = calculatePrice(startTime, endTime)
      expect(price).toBe(505) // $5.00 + $0.05 = $5.05 in cents
    })

    it('should add star addon price', () => {
      const startTime = new Date('2024-01-01T00:00:00Z')
      const endTime = new Date('2024-01-01T00:00:30Z') // 30 seconds later
      
      const price = calculatePrice(startTime, endTime, true, false)
      expect(price).toBe(800) // $5.00 + $3.00 = $8.00 in cents
    })

    it('should add premium certificate price', () => {
      const startTime = new Date('2024-01-01T00:00:00Z')
      const endTime = new Date('2024-01-01T00:00:30Z') // 30 seconds later
      
      const price = calculatePrice(startTime, endTime, false, true)
      expect(price).toBe(1000) // $5.00 + $5.00 = $10.00 in cents
    })

    it('should add both addons', () => {
      const startTime = new Date('2024-01-01T00:00:00Z')
      const endTime = new Date('2024-01-01T00:00:30Z') // 30 seconds later
      
      const price = calculatePrice(startTime, endTime, true, true)
      expect(price).toBe(1300) // $5.00 + $3.00 + $5.00 = $13.00 in cents
    })
  })

  describe('formatPrice', () => {
    it('should format price correctly', () => {
      expect(formatPrice(500)).toBe('$5.00')
      expect(formatPrice(1000)).toBe('$10.00')
      expect(formatPrice(1050)).toBe('$10.50')
      expect(formatPrice(0)).toBe('$0.00')
    })
  })
}) 