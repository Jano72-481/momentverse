# 🚀 Deployment Guide - MomentVerse

This guide will help you deploy your MomentVerse application to make it a real, live website.

## Option 1: Vercel (Recommended - Easiest)

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Stripe account for payments
- Email service (Gmail, SendGrid, etc.)

### Step 1: Prepare Your Repository
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project
5. Click "Deploy"

### Step 3: Configure Environment Variables
In your Vercel dashboard, go to Settings → Environment Variables and add:

#### Database (Choose one):
**Option A: Vercel Postgres (Recommended)**
```env
DATABASE_URL="postgresql://..."
```
- Go to Storage tab in Vercel
- Create a new Postgres database
- Copy the connection string

**Option B: Supabase (Free tier available)**
```env
DATABASE_URL="postgresql://..."
```
- Sign up at supabase.com
- Create a new project
- Get the connection string from Settings → Database

**Option C: PlanetScale (Free tier available)**
```env
DATABASE_URL="mysql://..."
```
- Sign up at planetscale.com
- Create a new database
- Get the connection string

#### Authentication:
```env
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="generate-a-secure-random-string"
```

#### Stripe (Production Keys):
```env
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### Email Service:
```env
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### Step 4: Set Up Database
1. After deployment, run database migrations:
   ```bash
   # In Vercel dashboard → Functions → Create new function
   # Name: db-migrate
   # Code:
   import { PrismaClient } from '@prisma/client'
   const prisma = new PrismaClient()
   
   export default async function handler(req, res) {
     try {
       await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
       await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`
       res.json({ success: true })
     } catch (error) {
       res.status(500).json({ error: error.message })
     }
   }
   ```

2. Or use Prisma Studio to manage your database:
   ```bash
   npx prisma studio
   ```

### Step 5: Configure Stripe Webhooks
1. Go to your Stripe dashboard
2. Navigate to Webhooks
3. Add endpoint: `https://your-app-name.vercel.app/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `payment_intent.succeeded`
5. Copy the webhook secret to your environment variables

### Step 6: Custom Domain (Optional)
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` to your custom domain
4. Configure DNS records as instructed

## Option 2: Netlify

### Step 1: Prepare for Netlify
Create `netlify.toml`:
```toml
[build]
  command = "pnpm build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy
1. Go to netlify.com
2. Drag and drop your project folder
3. Configure environment variables in the dashboard

## Option 3: DigitalOcean App Platform

### Step 1: Prepare
Create `.do/app.yaml`:
```yaml
name: momentverse
services:
- name: web
  source_dir: /
  github:
    repo: yourusername/momentverse
    branch: main
  run_command: pnpm start
  build_command: pnpm build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```

### Step 2: Deploy
1. Go to DigitalOcean App Platform
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy

## Option 4: AWS (Advanced)

### Using AWS Amplify:
1. Go to AWS Amplify Console
2. Connect your GitHub repository
3. Configure build settings
4. Set environment variables

### Using AWS EC2:
1. Launch an EC2 instance
2. Install Node.js and PM2
3. Clone your repository
4. Set up environment variables
5. Use PM2 to run the application

## Post-Deployment Checklist

### ✅ Essential Setup
- [ ] Database is connected and migrated
- [ ] Environment variables are configured
- [ ] Stripe webhooks are working
- [ ] Email service is configured
- [ ] Custom domain is set up (optional)

### ✅ Testing
- [ ] User registration works
- [ ] Payment processing works
- [ ] Certificate generation works
- [ ] Email notifications work
- [ ] Mobile responsiveness

### ✅ Security
- [ ] HTTPS is enabled
- [ ] Environment variables are secure
- [ ] Database is properly secured
- [ ] Stripe keys are production keys

### ✅ Performance
- [ ] Images are optimized
- [ ] Database queries are efficient
- [ ] API responses are fast
- [ ] CDN is configured (if needed)

## Monitoring & Analytics

### Set up monitoring:
1. **Vercel Analytics** (if using Vercel)
2. **Google Analytics** for user tracking
3. **Sentry** for error monitoring
4. **Stripe Dashboard** for payment monitoring

### Add to your app:
```typescript
// In your layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure database is accessible
   - Verify SSL settings

2. **Stripe Webhook Failures**
   - Check webhook endpoint URL
   - Verify webhook secret
   - Test with Stripe CLI

3. **Email Not Sending**
   - Check SMTP credentials
   - Verify email service settings
   - Test with a simple email

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

## Next Steps

After deployment:
1. Set up monitoring and analytics
2. Configure backup strategies
3. Set up CI/CD pipelines
4. Plan for scaling
5. Consider adding a CDN
6. Set up automated testing

## Support

If you encounter issues:
1. Check the deployment platform's logs
2. Verify all environment variables
3. Test locally with production settings
4. Contact the platform's support

---

**Your MomentVerse is now live! 🌟** 