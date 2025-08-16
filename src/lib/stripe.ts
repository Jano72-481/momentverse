import Stripe from 'stripe';

// Development-friendly Stripe configuration
let stripe: Stripe | null = null;

export function getStripe() {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (secretKey && !secretKey.includes('your-stripe-secret-key')) {
      stripe = new Stripe(secretKey, {
        apiVersion: '2023-10-16',
      });
    } else {
      console.warn('⚠️ Stripe not configured - using mock mode for development');
      stripe = null;
    }
  }
  return stripe;
}

// Export stripe instance for compatibility
export { stripe };

// Mock payment functions for development
export async function createMockPaymentIntent(amount: number) {
  if (process.env.NODE_ENV === 'development') {
    console.log('💳 [DEV] Creating mock payment intent for:', amount);
    return {
      id: 'pi_mock_' + Date.now(),
      client_secret: 'pi_mock_secret_' + Date.now(),
      amount,
      currency: 'usd',
      status: 'requires_payment_method'
    };
  }
  
  const stripe = getStripe();
  if (!stripe) {
    throw new Error('Stripe not configured');
  }
  
  return stripe.paymentIntents.create({
    amount,
    currency: 'usd',
  });
}

export async function createMockCheckoutSession(data: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log('💳 [DEV] Creating mock checkout session:', data);
    return {
      id: 'cs_mock_' + Date.now(),
      url: `${process.env.NEXTAUTH_URL}/mock-payment-success?session_id=cs_mock_${Date.now()}`,
    };
  }
  
  const stripe = getStripe();
  if (!stripe) {
    throw new Error('Stripe not configured');
  }
  
  return stripe.checkout.sessions.create({
    ...data,
    success_url: `${process.env.NEXTAUTH_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/payment-cancelled`,
  });
}

export function getStripePublishableKey() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!key || key.includes('your-stripe-publishable-key')) {
    console.warn('⚠️ Stripe publishable key not configured');
    return null;
  }
  
  return key;
} 