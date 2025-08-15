# MomentVerse Setup Guide

## 🏗️ **How Everything Works**

### **1. Authentication & User Storage**

#### **User Registration Flow:**
1. User fills out sign-up form
2. Password is hashed with Argon2 (secure)
3. User record created in database
4. Email verification sent (development: logged to console)
5. User clicks verification link
6. Account activated and can sign in

#### **User Data Storage:**
```sql
-- Users table structure
User {
  id: String (unique)
  email: String (unique)
  passwordHash: String (Argon2 hashed)
  name: String
  emailVerified: Boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### **Session Management:**
- **NextAuth.js** handles sessions
- **JWT tokens** for authentication
- **Secure cookies** with proper headers
- **Rate limiting** on login attempts

### **2. Moment & Data Storage**

#### **Moment Creation Flow:**
1. User selects time/date
2. User picks a star (optional)
3. User adds personal message
4. Moment saved to database
5. Certificate generated (PDF)
6. Payment processed (if premium)

#### **Data Storage Structure:**
```sql
-- Moments table
Moment {
  id: String (unique)
  userId: String (foreign key)
  startTime: DateTime
  endTime: DateTime
  title: String
  description: String
  isPublic: Boolean
  starId: String (optional)
  certificateUrl: String (optional)
  createdAt: DateTime
}

-- Stars table (for star add-ons)
Star {
  id: String (unique)
  name: String
  coordinates: String
  magnitude: Float
  isAssigned: Boolean
}

-- Orders table (payment tracking)
Order {
  id: String (unique)
  momentId: String (foreign key)
  userId: String (foreign key)
  stripeSessionId: String
  amount: Int (cents)
  status: String
  createdAt: DateTime
}
```

### **3. Payment Processing**

#### **Stripe Integration:**
- **Checkout sessions** for one-time payments
- **Payment intents** for custom payment flows
- **Webhooks** for payment confirmation
- **Order tracking** in database

#### **Payment Flow:**
1. User selects moment options
2. Stripe checkout session created
3. User completes payment
4. Webhook confirms payment
5. Moment activated and certificate generated

## 🔧 **Development vs Production Setup**

### **Development (Current Setup):**
- ✅ **Database**: SQLite (local file)
- ✅ **Authentication**: NextAuth.js (local)
- ✅ **Email**: Console logging (no SMTP needed)
- ✅ **Payments**: Mock mode (no real Stripe needed)
- ✅ **Caching**: In-memory (no Redis needed)

### **Production Setup (What You Need):**
- 🔄 **Database**: PostgreSQL (Supabase, AWS RDS, etc.)
- 🔄 **Email**: SMTP service (SendGrid, AWS SES, etc.)
- 🔄 **Payments**: Stripe account with real keys
- 🔄 **Caching**: Redis (Upstash, AWS ElastiCache, etc.)
- 🔄 **Hosting**: Vercel, Netlify, AWS, etc.

## 📋 **What You Need to Configure**

### **1. For Development (Optional):**

#### **Stripe Test Keys:**
```bash
# Get from https://dashboard.stripe.com/test/apikeys
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

#### **Email Service (Optional):**
```bash
# For testing real emails
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### **2. For Production (Required):**

#### **Database Migration:**
```bash
# Update DATABASE_URL in .env
DATABASE_URL="postgresql://user:pass@host:5432/momentverse"
```

#### **Stripe Production Keys:**
```bash
# Get from https://dashboard.stripe.com/apikeys
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### **Email Service:**
```bash
# Configure SMTP for production
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
FROM_EMAIL="noreply@yourdomain.com"
```

#### **Redis for Caching:**
```bash
# For production caching
REDIS_URL="redis://localhost:6379"
# Or use Upstash
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

## 🚀 **Current Status**

### **✅ Working in Development:**
- User registration and login
- Moment creation and storage
- Timeline visualization
- Basic payment flow (mock)
- Email verification (console logging)
- Database operations
- Authentication and sessions

### **⚠️ Needs Configuration for Production:**
- Real Stripe keys for payments
- SMTP service for emails
- PostgreSQL database
- Redis for caching
- Domain and SSL certificate
- Production environment variables

## 🧪 **Testing the Current Setup**

### **1. Test User Registration:**
1. Go to `/auth/signup`
2. Fill out the form
3. Check console for verification email
4. Click the verification link
5. Sign in with your account

### **2. Test Moment Creation:**
1. Go to `/claim`
2. Select a time/date
3. Pick a star (optional)
4. Add a message
5. Complete the process

### **3. Test Timeline:**
1. Go to `/timeline`
2. Try different time scales
3. Switch between chart and grid views
4. Navigate through time

### **4. Test API Endpoints:**
1. Visit `/api/health` for system status
2. Check browser console for logs
3. Monitor network requests

## 🔄 **Next Steps for Production**

### **1. Set Up Stripe:**
1. Create Stripe account
2. Get API keys
3. Set up webhooks
4. Test payment flow

### **2. Set Up Database:**
1. Choose PostgreSQL provider
2. Migrate from SQLite
3. Set up backups
4. Configure connection pooling

### **3. Set Up Email:**
1. Choose email service
2. Configure SMTP
3. Set up email templates
4. Test email delivery

### **4. Deploy:**
1. Choose hosting platform
2. Set environment variables
3. Configure domain
4. Set up SSL certificate

## 💡 **Development Tips**

### **Current Features Working:**
- ✅ All UI components
- ✅ Authentication flow
- ✅ Database operations
- ✅ Timeline visualization
- ✅ Moment creation
- ✅ Mock payments

### **Console Logs to Watch:**
- 📧 Email notifications
- 💳 Payment operations
- 🔐 Authentication events
- 🗄️ Database queries
- ⚡ Performance metrics

The current setup is fully functional for development and testing. You can create accounts, moments, and test all features without needing external services configured!
