# MomentVerse - Where Time Meets Eternity

A revolutionary platform that allows users to dedicate moments in time to eternity, with optional star pairing from the cosmos. Perfect for TikTok marketing and viral content creation.

## 🌟 Features

### Core Functionality
- **Moment Dedication**: Dedicate time periods from 1 second to 24 hours
- **Star Pairing**: Optionally pair moments with real stars from the Hipparcos catalog
- **Premium Certificates**: Beautiful PDF certificates with QR codes and embossed seals
- **Timeline Visualization**: Interactive timeline of all public moments
- **Social Sharing**: Built-in sharing functionality for viral growth

### Authentication & User Management
- **Secure Registration**: Email/password registration with bcrypt hashing
- **User Profiles**: Personal dashboard with moment history
- **Account Management**: Password reset and email verification
- **Session Management**: JWT-based authentication with NextAuth.js

### Payment & E-commerce
- **Stripe Integration**: Secure payment processing
- **Multiple Pricing Tiers**: Basic ($5) and Premium ($13) packages
- **Add-on System**: Star pairing (+$3) and premium certificates (+$5)
- **Webhook Handling**: Automated certificate generation on payment completion

### Analytics & Marketing
- **Conversion Tracking**: Complete funnel tracking from TikTok to purchase
- **TikTok Pixel**: Built-in TikTok attribution and event tracking
- **A/B Testing**: Framework for testing different conversion strategies
- **Social Proof**: Viral stats and testimonials

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- SQLite (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/momentverse.git
   cd momentverse
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="file:./prisma/dev.db"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Stripe
   STRIPE_PUBLISHABLE_KEY="pk_test_your_key"
   STRIPE_SECRET_KEY="sk_test_your_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
   
   # Email (for notifications)
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="noreply@momentverse.com"
   ```

4. **Set up the database**
   ```bash
   DATABASE_URL="file:./prisma/dev.db" npx prisma db push
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 TikTok Marketing Strategy

### Viral Content Ideas
1. **"I dedicated my graduation to a star"** - Emotional milestone content
2. **"My baby's first breath is now eternal"** - Family milestone content  
3. **"This star represents my wedding moment"** - Romance content
4. **"I made my TikTok moment permanent"** - Meta content
5. **"Watch me dedicate my success to the cosmos"** - Achievement content

### Conversion Funnel
- **TikTok Views** → Website Clicks (2% target)
- **Website Clicks** → Form Fill (15% target)
- **Form Fill** → Purchase (20% target)
- **Purchase** → Share (30% target)

### Revenue Projections
- **Conservative**: $540/month (100K views)
- **Optimistic**: $5,400/month (1M views)
- **Viral**: $54,000/month (10M views)

## 🛠️ Production Deployment

### Environment Setup
1. **Database**: Use PostgreSQL in production
2. **File Storage**: Use AWS S3 or similar for certificate storage
3. **Email**: Configure production email service
4. **Analytics**: Set up Google Analytics and TikTok Pixel

### Deployment Steps
1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Set up production environment variables**
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_URL="https://yourdomain.com"
   STRIPE_PUBLISHABLE_KEY="pk_live_..."
   STRIPE_SECRET_KEY="sk_live_..."
   ```

3. **Deploy to your preferred platform**
   - Vercel (recommended)
   - Netlify
   - AWS
   - DigitalOcean

4. **Set up Stripe webhooks**
   - Point to: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

## 📁 Project Structure

```
MomentVerse/
├── src/
│   ├── app/                    # Next.js 14 app router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── moments/       # Moment management
│   │   │   └── webhooks/      # Stripe webhooks
│   │   ├── profile/           # User profile page
│   │   └── moment/            # Individual moment pages
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   └── ClaimMomentForm.tsx
│   └── lib/                  # Utility libraries
│       ├── auth.ts           # NextAuth configuration
│       ├── certificate.ts    # PDF generation
│       ├── analytics.ts      # Tracking and analytics
│       ├── email.ts          # Email services
│       └── stripe.ts         # Stripe integration
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts              # Database seeding
└── public/                  # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/session` - Get current session

### Moments
- `POST /api/moments/create` - Create new moment
- `GET /api/moments/public` - Get public moments
- `GET /api/moments/user` - Get user's moments

### Webhooks
- `POST /api/webhooks/stripe` - Stripe payment webhooks

## 🎨 Customization

### Styling
The app uses Tailwind CSS with custom cosmic theme. Key classes:
- `.cosmic-bg` - Animated cosmic background
- `.glass-card` - Glass morphism effect
- `.premium-button` - Gradient button styling
- `.gradient-text` - Animated gradient text

### Certificate Design
Certificates are generated using Puppeteer with custom HTML/CSS. Modify `src/lib/certificate.ts` to customize the design.

### Analytics
Track custom events using the analytics service:
```typescript
import { trackEvent } from '@/lib/analytics'

await trackEvent({
  event: 'custom_event',
  source: 'tiktok',
  userId: 'user_id',
  metadata: { custom: 'data' }
})
```

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### Integration Tests
```bash
pnpm test:integration
```

### E2E Tests
```bash
pnpm test:e2e
```

## 📈 Analytics Dashboard

Access analytics data via API:
- `GET /api/analytics/conversion` - Conversion stats
- `GET /api/analytics/revenue` - Revenue metrics
- `GET /api/analytics/sources` - Traffic sources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: [docs.momentverse.com](https://docs.momentverse.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/momentverse/issues)
- **Discord**: [Join our community](https://discord.gg/momentverse)

---

**Made with ❤️ for the cosmos** 