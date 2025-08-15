import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { generateAndSaveCertificate } from '@/lib/certificate'
import { sendCertificateReadyEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const { momentId, orderId } = session.metadata

  if (!momentId || !orderId) {
    console.error('Missing momentId or orderId in session metadata')
    return
  }

  try {
    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        stripePaymentIntentId: session.payment_intent
      }
    })

    // Update moment status
    await prisma.moment.update({
      where: { id: momentId },
      data: {
        // Add any moment-specific updates here
      }
    })

    // Generate certificate
    const certificateUrl = await generateAndSaveCertificate(momentId)

    // Get moment details for email
    const moment = await prisma.moment.findUnique({
      where: { id: momentId },
      include: {
        user: true,
        order: true
      }
    })

    if (moment?.user?.email) {
      // Send certificate email
      await sendCertificateReadyEmail(
        moment.user.email,
        moment.user.name || 'Friend',
        moment.id,
        moment.dedication || ''
      );
    }

    console.log(`Certificate generated for moment ${momentId}: ${certificateUrl}`)
  } catch (error) {
    console.error('Error processing checkout session completion:', error)
    throw error
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  // Find order by payment intent ID
  const order = await prisma.order.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id }
  })

  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'COMPLETED' }
    })
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  // Find order by payment intent ID
  const order = await prisma.order.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id }
  })

  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'FAILED' }
    })
  }
} 