import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { generateCertificate, saveCertificate } from '@/lib/pdf'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event

  if (!stripe) {
    console.error('Stripe not configured')
    return NextResponse.json({ error: 'Payment processing not available' }, { status: 503 })
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    
    try {
      // Find the order
      const order = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
        include: {
          moment: {
            include: {
              user: true,
              star: true,
            },
          },
        },
      })

      if (!order) {
        console.error('Order not found for session:', session.id)
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // Update order status
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED' },
      })

      // Assign star if requested
      if (order.hasStarAddon && !order.moment.starId) {
        const availableStar = await prisma.star.findFirst({
          where: { isAssigned: false },
        })

        if (availableStar) {
          await prisma.star.update({
            where: { id: availableStar.id },
            data: { isAssigned: true },
          })

          await prisma.moment.update({
            where: { id: order.moment.id },
            data: { starId: availableStar.id },
          })
        }
      }

      // Generate certificate
      const doc = await generateCertificate({
        momentId: order.moment.id,
        startTime: order.moment.startTime,
        endTime: order.moment.endTime,
        ...(order.moment.dedication && { dedication: order.moment.dedication }),
        userName: order.moment.user.name || order.moment.user.email,
        ...(order.moment.star?.name && { starName: order.moment.star.name }),
        isPremium: order.hasPremiumCert,
      })

      const certificatePath = await saveCertificate(doc, order.moment.id)

      // Update moment with certificate path
      await prisma.moment.update({
        where: { id: order.moment.id },
        data: { 
          // Add certificate path to moment if needed
        },
      })

      console.log('Payment processed successfully for moment:', order.moment.id)
    } catch (error) {
      console.error('Error processing payment:', error)
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
} 