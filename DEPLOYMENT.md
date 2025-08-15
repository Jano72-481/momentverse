# 🚀 MomentVerse Production Deployment Guide

This guide will help you deploy MomentVerse to production with all the necessary infrastructure and security measures.

## 🗄️ **CRITICAL: Database Setup & Migration**

### **Step 1: Local Database Setup**
```bash
# 1. Reset and recreate database
npx prisma db push --force-reset

# 2. Create initial migration
npx prisma migrate dev --name init

# 3. Seed with sample data
npx prisma db seed

# 4. Verify database is working
npx prisma studio
```

### **Step 2: Production Database Setup**
```bash
# 1. Update DATABASE_URL in production environment
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# 2. Deploy migrations to production
npx prisma migrate deploy

# 3. (Optional) Seed production with initial data
npx prisma db seed --preview-feature
```

### **Step 3: Database Verification**
```bash
# Check database connection
npx prisma db pull

# Verify tables exist
npx prisma studio
```

**⚠️ IMPORTANT**: The database must be properly migrated before the app will work. The error "table does not exist" indicates missing migrations.

## 📋 Prerequisites

- [Vercel](https://vercel.com) account (recommended)
- [Stripe](https://stripe.com) account for payments
- [SendGrid](https://sendgrid.com) account for emails
- [Sentry](https://sentry.io) account for error monitoring (optional)
- Custom domain (optional but recommended)

## 🔧 Environment Variables

Create a `.env.production` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth.js
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret-key"

# Stripe (Production Keys)
STRIPE_PUBLISHABLE_KEY="pk_live_your-stripe-publishable-key"
STRIPE_SECRET_KEY="sk_live_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"

# Email (SendGrid)
SENDGRID_API_KEY="SG.your-sendgrid-api-key"
FROM_EMAIL="noreply@yourdomain.com"

# Monitoring & Analytics
SENTRY_DSN="https://your-sentry-dsn"
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

## 🚀 Deploy to Vercel

### 1. Connect Repository
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure the following settings:

### 2. Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && prisma db push && next build`
- **Install Command**: `pnpm install`
- **Output Directory**: `.next`

### 3. Environment Variables
Add all the environment variables from the `.env.production` file to your Vercel project settings.

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## 🔗 Custom Domain Setup

### 1. Add Domain in Vercel
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### 2. Update Environment Variables
Update `NEXTAUTH_URL` to your custom domain:
```env
NEXTAUTH_URL="https://yourdomain.com"
```

## 💳 Stripe Production Setup

### 1. Switch to Live Mode
1. Log into your Stripe dashboard
2. Switch from "Test" to "Live" mode
3. Get your live API keys

### 2. Configure Webhooks
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the webhook secret and add to environment variables

### 3. Update Environment Variables
```env
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 📧 Email Service Setup (SendGrid)

### 1. Create SendGrid Account
1. Sign up at [SendGrid](https://sendgrid.com)
2. Verify your domain
3. Create an API key

### 2. Configure Environment Variables
```env
SENDGRID_API_KEY="SG.your-api-key"
FROM_EMAIL="noreply@yourdomain.com"
```

### 3. Test Email Functionality
Send a test email to verify the setup is working.

## 📊 Monitoring Setup (Optional)

### Sentry Error Monitoring
1. Create a Sentry account
2. Create a new project
3. Add the DSN to your environment variables:
```env
SENTRY_DSN="https://your-sentry-dsn"
```

### Google Analytics
1. Create a Google Analytics 4 property
2. Get your measurement ID
3. Add to environment variables:
```env
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

## 🔒 Security Checklist

- [ ] HTTPS is enabled
- [ ] Environment variables are set
- [ ] Database is properly configured
- [ ] Stripe webhooks are working
- [ ] Email service is functional
- [ ] Error monitoring is active
- [ ] Analytics are tracking
- [ ] Custom domain is configured
- [ ] Security headers are in place

## 🧪 Testing Checklist

### Core Functionality
- [ ] User registration and login
- [ ] Moment creation
- [ ] Payment processing
- [ ] Certificate generation
- [ ] Email notifications
- [ ] Social sharing

### Edge Cases
- [ ] Failed payments
- [ ] Network errors
- [ ] Invalid inputs
- [ ] Rate limiting
- [ ] Error boundaries

## 📈 Post-Deployment

### 1. Monitor Performance
- Check Vercel Analytics
- Monitor Core Web Vitals
- Track error rates

### 2. Set Up Alerts
- Database connection issues
- Payment failures
- High error rates
- Performance degradation

### 3. Regular Maintenance
- Update dependencies monthly
- Monitor security advisories
- Backup database regularly
- Review error logs

## 🆘 Troubleshooting

### Common Issues

**Database Connection Errors**
- Verify DATABASE_URL is correct
- Check if database is accessible
- Ensure SSL is configured properly

**Stripe Webhook Failures**
- Verify webhook endpoint URL
- Check webhook secret
- Test webhook signature validation

**Email Delivery Issues**
- Verify SendGrid API key
- Check domain verification
- Test email templates

**Build Failures**
- Check Prisma schema
- Verify environment variables
- Review build logs

## 🎯 Production Checklist

Before going live, ensure:

- [ ] All tests pass
- [ ] Performance is acceptable
- [ ] Security measures are in place
- [ ] Monitoring is active
- [ ] Backup strategy is ready
- [ ] Documentation is complete
- [ ] Team is trained on deployment process

## 📞 Support

If you encounter issues:
1. Check the error logs in Vercel
2. Review the troubleshooting section
3. Check GitHub issues
4. Contact the development team

---

**Congratulations! 🎉** Your MomentVerse application is now production-ready and deployed! 