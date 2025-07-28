# 🚀 Quick Start - Deploy MomentVerse in 10 Minutes

## Step 1: Prepare Your Code (2 minutes)

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Deploy to Vercel (3 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your MomentVerse repository
5. Click "Deploy"

## Step 3: Set Up Database (2 minutes)

### Option A: Vercel Postgres (Easiest)
1. In Vercel dashboard, go to "Storage" tab
2. Create a new Postgres database
3. Copy the connection string
4. Add to Environment Variables:
   ```
   DATABASE_URL="postgresql://..."
   ```

### Option B: Supabase (Free)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings → Database
4. Add to Environment Variables

## Step 4: Configure Environment Variables (2 minutes)

In Vercel dashboard → Settings → Environment Variables, add:

```env
# Authentication
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="generate-random-string-here"

# Database (from step 3)
DATABASE_URL="postgresql://..."

# Stripe (get from stripe.com)
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Gmail example)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

## Step 5: Set Up Stripe (1 minute)

1. Go to [stripe.com](https://stripe.com)
2. Create account and get live keys
3. Set up webhook: `https://your-app-name.vercel.app/api/webhooks/stripe`
4. Select events: `checkout.session.completed`

## ✅ Your Website is Live!

Your MomentVerse is now accessible at: `https://your-app-name.vercel.app`

## 🎯 Next Steps

1. **Test Everything**:
   - User registration
   - Payment processing
   - Certificate generation
   - Email notifications

2. **Custom Domain** (Optional):
   - In Vercel dashboard → Settings → Domains
   - Add your custom domain

3. **Start Marketing**:
   - Create TikTok content
   - Share your website
   - Monitor analytics

## 🚨 Common Issues

**Build Fails?**
- Check all environment variables are set
- Ensure DATABASE_URL is correct
- Verify Stripe keys are live keys

**Payments Not Working?**
- Check Stripe webhook is configured
- Verify webhook secret matches
- Test with Stripe test mode first

**Emails Not Sending?**
- Check SMTP credentials
- Verify email service settings
- Test with a simple email first

## 📞 Need Help?

1. Check Vercel deployment logs
2. Verify all environment variables
3. Test locally with production settings
4. See full guide in `DEPLOYMENT.md`

---

**Your MomentVerse is now live and ready to go viral! 🌟** 