import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { formatPrice } from '@/lib/utils'
import { authOptions } from '@/lib/auth'
import { trackFormFill, trackTikTokClick } from '@/lib/analytics'
import { momentSchema, validateRequest, validateTimeRange, validatePrice, sanitizeInput } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // 2. Parse and validate request body
    const body = await request.json()
    const validation = validateRequest(momentSchema, body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { startTime, endTime, dedication, isPublic, hasStarAddon, hasPremiumCert } = validation.data

    // 3. Validate time range
    const start = new Date(startTime)
    const end = new Date(endTime)
    const timeValidation = validateTimeRange(start, end)
    
    if (!timeValidation.valid) {
      return NextResponse.json(
        { error: timeValidation.error },
        { status: 400 }
      )
    }

    // 4. Calculate and validate price
    const basePrice = 299 // $2.99 in cents
    const priceValidation = validatePrice(basePrice, {
      star: hasStarAddon,
      premium: hasPremiumCert
    })

    if (!priceValidation.valid) {
      return NextResponse.json(
        { error: priceValidation.error },
        { status: 400 }
      )
    }

    const totalPrice = priceValidation.total

    // 5. Sanitize dedication text
    const sanitizedDedication = dedication ? sanitizeInput(dedication) : 'A special moment dedicated to eternity'

    // 6. Create moment in database with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create moment
      const moment = await tx.moment.create({
        data: {
          startTime: start,
          endTime: end,
          dedication: sanitizedDedication,
          isPublic: isPublic ?? true,
          userId: userId,
          hasStarAddon: hasStarAddon ?? false,
          hasPremiumCert: hasPremiumCert ?? false,
        },
      })

      // Create order
      const order = await tx.order.create({
        data: {
          momentId: moment.id,
          userId: userId,
          stripeSessionId: 'temp-session-id', // Will be updated after Stripe session creation
          amount: totalPrice,
          hasStarAddon: hasStarAddon ?? false,
          hasPremiumCert: hasPremiumCert ?? false,
        },
      })

      return { moment, order }
    })

    const { moment, order } = result

    // 7. Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Moment Dedication',
              description: `Dedication from ${start.toLocaleString()} to ${end.toLocaleString()}`,
              images: ['https://momentverse.com/certificate-preview.jpg'],
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
            unit_amount: 300, // Keep star addon at $3.00
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
            unit_amount: 400, // Premium cert now $4.00 to make total $9.99
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

    // 8. Update order with actual Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    })

    // 9. Track analytics events
    await Promise.all([
      trackFormFill('direct', userId),
      trackTikTokClick('moment_creation', userId)
    ]).catch(console.error) // Don't fail if analytics fail

    // 10. Return success response
    return NextResponse.json({
      success: true,
      momentId: moment.id,
      orderId: order.id,
      checkoutUrl: stripeSession.url,
      price: formatPrice(totalPrice / 100),
    })

  } catch (error) {
    console.error('Error creating moment:', error)
    
    // Enhanced error handling with specific error types
    if (error instanceof Error) {
      if (error.message.includes('Stripe')) {
        return NextResponse.json(
          { error: 'Payment processing error. Please try again.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('Database')) {
        return NextResponse.json(
          { error: 'Database error. Please try again.' },
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