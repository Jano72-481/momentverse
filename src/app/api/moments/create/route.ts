import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { formatPrice } from '@/lib/utils'
import { authOptions } from '@/lib/auth'
import { trackFormFill, trackTikTokClick } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions)
    
    // For now, allow anonymous users (we'll implement proper auth later)
    const userId = (authSession?.user as any)?.id || 'anonymous-user'
    
    const body = await request.json()
    const { startTime, endTime, dedication, isPublic, hasStarAddon, hasPremiumCert } = body

    // Enhanced validation
    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: 'Start time and end time are required' },
        { status: 400 }
      )
    }

    const start = new Date(startTime)
    const end = new Date(endTime)
    const now = new Date()

    // Validate time ranges
    if (start >= end) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      )
    }

    if (end <= now) {
      return NextResponse.json(
        { error: 'Cannot dedicate moments in the past' },
        { status: 400 }
      )
    }

    const durationMs = end.getTime() - start.getTime()
    const maxDurationMs = 24 * 60 * 60 * 1000 // 24 hours

    if (durationMs > maxDurationMs) {
      return NextResponse.json(
        { error: 'Duration cannot exceed 24 hours' },
        { status: 400 }
      )
    }

    // Calculate price
    const basePrice = 500 // $5.00 in cents
    let totalPrice = basePrice

    if (hasStarAddon) {
      totalPrice += 300 // $3.00
    }

    if (hasPremiumCert) {
      totalPrice += 500 // $5.00
    }

    // Create moment in database
    const moment = await prisma.moment.create({
      data: {
        startTime: start,
        endTime: end,
        dedication: dedication || 'A special moment dedicated to eternity',
        isPublic: isPublic ?? true,
        userId: userId,
        hasStarAddon: hasStarAddon ?? false,
        hasPremiumCert: hasPremiumCert ?? false,
      },
    })

    // Create order with addon information
    const order = await prisma.order.create({
      data: {
        momentId: moment.id,
        userId: userId,
        stripeSessionId: 'temp-session-id', // Will be updated after Stripe session creation
        amount: totalPrice,
        hasStarAddon: hasStarAddon ?? false,
        hasPremiumCert: hasPremiumCert ?? false,
      },
    })

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Moment Dedication',
              description: `Dedication from ${start.toLocaleString()} to ${end.toLocaleString()}`,
              images: ['https://momentverse.com/certificate-preview.jpg'], // Add your certificate preview image
            },
            unit_amount: totalPrice,
          },
          quantity: 1,
        },
        ...(hasStarAddon ? [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Star Pairing Add-on',
              description: 'Pair your moment with a real star from the cosmos',
            },
            unit_amount: 300,
          },
          quantity: 1,
        }] : []),
        ...(hasPremiumCert ? [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Certificate Add-on',
              description: 'Gold border and embossed seal design',
            },
            unit_amount: 500,
          },
          quantity: 1,
        }] : []),
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/moment/${moment.id}?success=true`,
      cancel_url: `${request.nextUrl.origin}?canceled=true`,
      metadata: {
        momentId: moment.id,
        orderId: order.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        hasStarAddon: hasStarAddon ? 'true' : 'false',
        hasPremiumCert: hasPremiumCert ? 'true' : 'false',
      },
    })

    // Update order with actual Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    })

    // Track analytics events
    await trackFormFill('direct', userId)
    await trackTikTokClick('moment_creation', userId)

    // Return success with checkout URL
    return NextResponse.json({
      success: true,
      momentId: moment.id,
      orderId: order.id,
      checkoutUrl: stripeSession.url,
      price: formatPrice(totalPrice / 100),
    })

  } catch (error) {
    console.error('Error creating moment:', error)
    
    // Enhanced error handling
    if (error instanceof Error) {
      if (error.message.includes('Stripe')) {
        return NextResponse.json(
          { error: 'Payment processing error. Please try again.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create moment. Please try again.' },
      { status: 500 }
    )
  }
} 