# 🚀 MOMENTVERSE DEPLOYMENT WORKFLOW

## **PRE-DEPLOYMENT CHECKLIST**

### **✅ Environment Variables to Configure in Vercel:**

```
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=your-64-character-secret-here
NEXTAUTH_URL=https://your-domain.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SENDGRID_API_KEY=SG...
```

### **✅ Domain Configuration:**
- Add custom domain in Vercel dashboard
- Update DNS records to point to Vercel
- Configure SSL certificate

### **✅ Stripe Webhook Setup:**
- Register webhook for: `https://your-domain.com/api/webhooks/stripe`
- Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## **🚀 DEPLOYMENT WORKFLOW FOR CURSOR**

```bash
# 1. Stop development server
pkill -f "next dev" || true

# 2. Apply database migrations
npx prisma migrate deploy

# 3. Build for production
npm run build

# 4. Commit and push to GitHub
git add .
git commit -m "🚀 Production deployment - MomentVerse v1.0"
git push origin main

# 5. Deploy to Vercel (if not already connected)
# - Import repository in Vercel dashboard
# - Configure environment variables
# - Deploy automatically

# 6. Seed production database
npx prisma db seed

# 7. Verify deployment
curl -I https://your-domain.com

# 8. Test critical endpoints
curl https://your-domain.com/api/moments/public
curl https://your-domain.com/api/stats
```

---

## **✅ POST-DEPLOYMENT VERIFICATION**

### **Test User Flow:**
1. Visit homepage
2. Register new account
3. Create a moment
4. Complete payment flow
5. Download certificate
6. Share moment

### **Test API Endpoints:**
- `/api/moments/public` - Timeline data
- `/api/stats` - Analytics
- `/api/auth/register` - User registration
- `/api/moments/create` - Moment creation
- `/api/webhooks/stripe` - Payment processing

### **Performance Check:**
- Lighthouse score > 80
- Core Web Vitals in green
- Mobile responsiveness
- Payment flow working

---

## **🔧 TROUBLESHOOTING**

### **Common Issues:**
1. **Database connection** - Check `DATABASE_URL`
2. **Authentication** - Verify `NEXTAUTH_SECRET`
3. **Payments** - Test Stripe webhook
4. **Emails** - Verify SendGrid API key

### **Monitoring Setup:**
- Enable Vercel Analytics
- Set up error monitoring (Sentry)
- Configure performance alerts

---

## **🎉 SUCCESS CRITERIA**

✅ **Domain accessible**  
✅ **User registration works**  
✅ **Moment creation functional**  
✅ **Payment processing active**  
✅ **Certificate generation working**  
✅ **Email notifications sending**  
✅ **Timeline displaying correctly**  
✅ **Mobile responsive**  
✅ **Performance optimized**  

**Status**: 🚀 **READY FOR PRODUCTION DEPLOYMENT** 