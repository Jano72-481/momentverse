import { prisma } from '@/lib/db'

export interface AnalyticsEvent {
  event: string
  source?: string
  userId?: string
  sessionId?: string
  metadata?: Record<string, any>
}

// Track analytics event
export const trackEvent = async (eventData: AnalyticsEvent) => {
  try {
    await prisma.analytics.create({
      data: {
        event: eventData.event,
        ...(eventData.source && { source: eventData.source }),
        ...(eventData.userId && { userId: eventData.userId }),
        ...(eventData.sessionId && { sessionId: eventData.sessionId }),
        metadata: eventData.metadata ? JSON.stringify(eventData.metadata) : null,
      },
    })
  } catch (error) {
    console.error('Error tracking analytics event:', error)
    // Don't throw error as analytics shouldn't break the app
  }
}

// Track page view
export const trackPageView = async (page: string, userId?: string, sessionId?: string) => {
  await trackEvent({
    event: 'page_view',
    metadata: { page },
    ...(userId && { userId }),
    ...(sessionId && { sessionId }),
  })
}

// Track form submission
export const trackFormSubmission = async (formName: string, userId?: string, sessionId?: string) => {
  await trackEvent({
    event: 'form_submission',
    metadata: { formName },
    ...(userId && { userId }),
    ...(sessionId && { sessionId }),
  })
}

// Track moment creation
export const trackMomentCreation = async (momentId: string, userId: string, hasStarAddon: boolean, hasPremiumCert: boolean) => {
  await trackEvent({
    event: 'moment_created',
    userId,
    metadata: {
      momentId,
      hasStarAddon,
      hasPremiumCert,
    },
  })
}

// Track purchase
export const trackPurchase = async (orderId: string, userId: string, amount: number, currency: string) => {
  await trackEvent({
    event: 'purchase',
    userId,
    metadata: {
      orderId,
      amount,
      currency,
    },
  })
}

// Track social share
export const trackSocialShare = async (platform: string, momentId: string, userId?: string) => {
  await trackEvent({
    event: 'social_share',
    source: platform,
    ...(userId && { userId }),
    metadata: {
      momentId,
      platform,
    },
  })
}

// Track certificate download
export const trackCertificateDownload = async (momentId: string, userId: string) => {
  await trackEvent({
    event: 'certificate_download',
    userId,
    metadata: {
      momentId,
    },
  })
}

// Track user registration
export const trackUserRegistration = async (userId: string, source?: string) => {
  await trackEvent({
    event: 'user_registration',
    ...(source && { source }),
    userId,
  })
}

// Track user login
export const trackUserLogin = async (userId: string, method: string = 'credentials') => {
  await trackEvent({
    event: 'user_login',
    userId,
    metadata: {
      method,
    },
  })
}

// Track form fill (legacy function)
export const trackFormFill = async (source?: string, userId?: string) => {
  await trackEvent({
    event: 'form_fill',
    ...(source && { source }),
    ...(userId && { userId }),
    metadata: { timestamp: new Date().toISOString() }
  })
}

// Track TikTok click (legacy function)
export const trackTikTokClick = async (source: string, userId?: string) => {
  await trackEvent({
    event: 'tiktok_click',
    source: 'tiktok',
    ...(userId && { userId }),
    metadata: { source }
  })
}

// Get analytics summary
export const getAnalyticsSummary = async (days: number = 30) => {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const events = await prisma.analytics.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    const summary = {
      totalEvents: events.length,
      uniqueUsers: new Set(events.filter(e => e.userId).map(e => e.userId)).size,
      pageViews: events.filter(e => e.event === 'page_view').length,
      registrations: events.filter(e => e.event === 'user_registration').length,
      logins: events.filter(e => e.event === 'user_login').length,
      momentCreations: events.filter(e => e.event === 'moment_created').length,
      purchases: events.filter(e => e.event === 'purchase').length,
      socialShares: events.filter(e => e.event === 'social_share').length,
      certificateDownloads: events.filter(e => e.event === 'certificate_download').length,
    }

    return summary
  } catch (error) {
    console.error('Error getting analytics summary:', error)
    return null
  }
}

// Get top sources
export const getTopSources = async (days: number = 30) => {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const events = await prisma.analytics.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        source: {
          not: null,
        },
      },
      select: {
        source: true,
      },
    })

    const sourceCounts = events.reduce((acc, event) => {
      const source = event.source || 'unknown'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(sourceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }))
  } catch (error) {
    console.error('Error getting top sources:', error)
    return []
  }
}

// Get user journey
export const getUserJourney = async (userId: string) => {
  try {
    const events = await prisma.analytics.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return events.map(event => ({
      event: event.event,
      timestamp: event.createdAt,
      metadata: event.metadata ? JSON.parse(event.metadata) : null,
    }))
  } catch (error) {
    console.error('Error getting user journey:', error)
    return []
  }
} 