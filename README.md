# 🌟 MomentVerse - Where Time Meets Eternity

A revolutionary platform that allows users to dedicate moments in time to eternity, with optional star pairing from the cosmos. Perfect for TikTok marketing and viral content creation.

## ✨ What's New (Latest Updates)

### ✅ **Fully Implemented Features**

**🔐 Complete Authentication System**
- Beautiful sign-in/sign-up pages with cosmic theme
- Secure password hashing with bcrypt
- Email verification system (ready for production)
- Protected routes with middleware
- Session management with NextAuth.js
- 

**🎨 Enhanced User Experience**
- Stunning cosmic UI with animated star field
- Responsive navigation with authentication status
- Loading states and error boundaries
- Form validation with Zod schemas
- Professional certificate generation

**💳 Complete Payment Flow**
- Stripe integration with webhook handling
- Multiple pricing tiers ($5 Basic, $13 Premium)
- Add-ons: Star pairing (+$3), Premium certificates (+$5)
- Order management and status tracking

**📄 Certificate System**
- Beautiful PDF certificates with QR codes
- Premium designs with gold borders
- Certificate download API with authentication
- Star pairing integration

**👤 User Dashboard**
- Personal profile with moment history
- Real-time stats and analytics
- Certificate download functionality
- Social sharing capabilities

**🛡️ Security & Performance**
- Rate limiting and CORS protection
- Input validation and sanitization
- Error boundaries and loading states
- Database transactions and proper indexing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- SQLite (for development)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd momentverse
   pnpm install
   ```

2. **Set up environment variables**
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
   
   # Stripe (for production)
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

3. **Set up the database**
   ```bash
   export DATABASE_URL="file:./prisma/dev.db"
   pnpm db:push
   pnpm db:seed
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Credentials

For testing the application:
- **Email**: `demo@momentverse.com`
- **Password**: `password123`

## 🎯 Core Features

### **Moment Dedication**
- Dedicate time periods from 1 second to 24 hours
- Beautiful form with real-time validation
- Privacy settings (public/private)
- Dedication text and personalization

### **Star Pairing**
- Real stars from the Hipparcos catalog
- Automatic star assignment
- Star information display
- Premium star pairing add-on

### **Certificate Generation**
- Professional PDF certificates
- QR code verification
- Premium designs with gold borders
- Download and sharing functionality

### **Payment Processing**
- Stripe integration
- Multiple pricing tiers
- Add-on system
- Order management

### **User Management**
- Secure authentication
- User profiles and dashboards
- Moment history and statistics
- Social sharing capabilities

## 📊 TikTok Marketing Strategy

### **Viral Content Ideas**
1. **"I dedicated my graduation to a star"** - Emotional milestone content
2. **"My baby's first breath is now eternal"** - Family milestone content  
3. **"This star represents my wedding moment"** - Romance content
4. **"I made my TikTok moment permanent"** - Meta content
5. **"Watch me dedicate my success to the cosmos"** - Achievement content

### **Conversion Funnel**
- **TikTok Views** → Website Clicks (2% target)
- **Website Clicks** → Form Fill (15% target)
- **Form Fill** → Purchase (20% target)
- **Purchase** → Share (30% target)

## 🛠️ Technical Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom cosmic theme
- **Authentication**: NextAuth.js with bcrypt
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Payments**: Stripe integration
- **PDF Generation**: Puppeteer
- **Email**: Nodemailer with templates
- **Validation**: Zod schemas
- **Testing**: Vitest

## 📁 Project Structure

```
MomentVerse/
├── src/
│   ├── app/                    # Next.js 14 app router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── moments/       # Moment management
│   │   │   ├── certificates/  # Certificate downloads
│   │   │   └── webhooks/      # Stripe webhooks
│   │   ├── auth/              # Authentication pages
│   │   ├── profile/           # User profile page
│   │   └── moment/            # Individual moment pages
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── Navigation.tsx    # Navigation component
│   │   ├── LoadingSpinner.tsx # Loading states
│   │   └── ErrorBoundary.tsx # Error handling
│   └── lib/                  # Utility libraries
│       ├── auth.ts           # NextAuth configuration
│       ├── certificate.ts    # PDF generation
│       ├── validation.ts     # Zod schemas
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

### Certificates
- `GET /api/certificates/[id]` - Download certificate
- `POST /api/certificates/[id]` - Regenerate certificate

### Webhooks
- `POST /api/webhooks/stripe` - Stripe payment webhooks

## 🎨 Customization

### **Styling**
The app uses Tailwind CSS with custom cosmic theme:
- `.cosmic-bg` - Animated cosmic background
- `.glass-card` - Glass morphism effect
- `.premium-button` - Gradient button styling
- `.gradient-text` - Animated gradient text

### **Certificate Design**
Certificates are generated using Puppeteer with custom HTML/CSS. Modify `src/lib/certificate.ts` to customize the design.

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui
```

## 🚀 Deployment

### **Environment Setup**
1. Set up PostgreSQL database
2. Configure Stripe keys for production
3. Set up email service (SendGrid, AWS SES, etc.)
4. Configure domain and SSL

### **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 📈 Analytics & Monitoring

- **Conversion Tracking**: Complete funnel tracking
- **TikTok Pixel**: Built-in TikTok attribution
- **Error Monitoring**: Error boundaries and logging
- **Performance**: Optimized loading and caching

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

*Ready for viral growth on TikTok and beyond! 🚀* 
 
