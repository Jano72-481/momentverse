import { prisma } from '@/lib/db'

export interface AnalyticsEvent {
  event: string
  source?: string
  userId?: string
  sessionId?: string
  metadata?: Record<string, any>
}

export async function trackEvent(eventData: AnalyticsEvent) {
  try {
    await prisma.analytics.create({
      data: {
        event: eventData.event,
        source: eventData.source,
        userId: eventData.userId,
        sessionId: eventData.sessionId,
        metadata: eventData.metadata ? JSON.stringify(eventData.metadata) : null,
      }
    })
  } catch (error) {
    console.error('Error tracking analytics event:', error)
  }
}

// Predefined event tracking functions
export async function trackPageView(page: string, source?: string, userId?: string) {
  await trackEvent({
    event: 'page_view',
    source,
    userId,
    metadata: { page }
  })
}

export async function trackFormFill(source?: string, userId?: string) {
  await trackEvent({
    event: 'form_fill',
    source,
    userId,
    metadata: { timestamp: new Date().toISOString() }
  })
}

export async function trackPurchase(amount: number, source?: string, userId?: string) {
  await trackEvent({
    event: 'purchase',
    source,
    userId,
    metadata: { amount, currency: 'USD' }
  })
}

export async function trackShare(platform: string, source?: string, userId?: string) {
  await trackEvent({
    event: 'share',
    source,
    userId,
    metadata: { platform }
  })
}

export async function trackTikTokClick(source: string, userId?: string) {
  await trackEvent({
    event: 'tiktok_click',
    source: 'tiktok',
    userId,
    metadata: { source }
  })
}

// Analytics reporting functions
export async function getConversionStats(days: number = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const stats = await prisma.analytics.groupBy({
    by: ['event'],
    where: {
      createdAt: {
        gte: startDate
      }
    },
    _count: {
      event: true
    }
  })

  return stats.reduce((acc, stat) => {
    acc[stat.event] = stat._count.event
    return acc
  }, {} as Record<string, number>)
}

export async function getSourceStats(days: number = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const stats = await prisma.analytics.groupBy({
    by: ['source'],
    where: {
      createdAt: {
        gte: startDate
      },
      source: {
        not: null
      }
    },
    _count: {
      source: true
    }
  })

  return stats.reduce((acc, stat) => {
    if (stat.source) {
      acc[stat.source] = stat._count.source
    }
    return acc
  }, {} as Record<string, number>)
}

export async function getRevenueStats(days: number = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const purchases = await prisma.analytics.findMany({
    where: {
      event: 'purchase',
      createdAt: {
        gte: startDate
      }
    },
    select: {
      metadata: true
    }
  })

  const totalRevenue = purchases.reduce((sum, purchase) => {
    if (purchase.metadata) {
      const metadata = JSON.parse(purchase.metadata)
      return sum + (metadata.amount || 0)
    }
    return sum
  }, 0)

  return {
    totalRevenue,
    purchaseCount: purchases.length,
    averageOrderValue: purchases.length > 0 ? totalRevenue / purchases.length : 0
  }
}

// TikTok Pixel integration
export function getTikTokPixelScript() {
  return `
    !function (w, d, t) {
      w[t] = w[t] || [];
      w[t].push('ttq.load', 'YOUR_TIKTOK_PIXEL_ID');
      var s = d.createElement(t);
      s.src = 'https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=YOUR_TIKTOK_PIXEL_ID';
      var i = d.getElementsByTagName(t)[0];
      i.parentNode.insertBefore(s, i);
    }(window, document, 'ttq');
  `
}

export function trackTikTokEvent(eventName: string, parameters: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && (window as any).ttq) {
    (window as any).ttq.track(eventName, parameters)
  }
}

// A/B Testing hooks
export async function getABTestVariant(testName: string, userId?: string): Promise<string> {
  // Simple A/B testing implementation
  // In production, you'd use a proper A/B testing service
  if (userId) {
    // Consistent variant based on user ID
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    return hash % 2 === 0 ? 'A' : 'B'
  }
  
  // Random variant for anonymous users
  return Math.random() < 0.5 ? 'A' : 'B'
}

export async function trackABTestEvent(testName: string, variant: string, event: string, userId?: string) {
  await trackEvent({
    event: `ab_test_${event}`,
    userId,
    metadata: {
      testName,
      variant,
      event
    }
  })
} 