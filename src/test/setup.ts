import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.STRIPE_SECRET_KEY = 'sk_test_test'
process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_test'
process.env.BASE_SECOND_PRICE = '5'
process.env.PER_MINUTE_EXTRA = '0.05'
process.env.STAR_ADDON = '3'
process.env.PREMIUM_CERT_ADDON = '5' 