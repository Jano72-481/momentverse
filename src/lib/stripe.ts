import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export async function createCheckoutSession({
  momentId,
  amount,
  successUrl,
  cancelUrl,
}: {
  momentId: string
  amount: number
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Moment Dedication',
            description: `Dedicated moment: ${momentId}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      momentId,
    },
  })

  return session
} 