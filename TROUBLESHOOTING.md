# 🔧 MomentVerse Troubleshooting Guide

## 🗄️ **Database Issues**

### **Error: "The table `main.moments` does not exist"**

**Cause**: Database schema hasn't been migrated to the actual database.

**Solution**:
```bash
# 1. Force reset the database
npx prisma db push --force-reset

# 2. Create and apply migrations
npx prisma migrate dev --name init

# 3. Seed the database
npx prisma db seed

# 4. Verify tables exist
npx prisma studio
```

### **Error: "Invalid DateTime" in Prisma queries**

**Cause**: Invalid date values being passed to the API.

**Solution**: The timeline API now includes date validation. Check that:
- Date parameters are valid ISO strings
- Date ranges are reasonable (not negative years)
- Frontend is sending proper date formats

### **Error: Database connection failed**

**Cause**: Incorrect DATABASE_URL or database not accessible.

**Solution**:
```bash
# 1. Check your .env file
cat .env | grep DATABASE_URL

# 2. Test database connection
npx prisma db pull

# 3. Verify database exists
ls -la prisma/dev.db
```

## 🚀 **Development Server Issues**

### **Error: Port 3000 already in use**

**Solution**:
```bash
# Kill existing processes
lsof -ti:3000 | xargs kill -9

# Restart development server
npm run dev
```

### **Error: Build failures**

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

## 🔐 **Authentication Issues**

### **Error: "Authentication required"**

**Cause**: User not logged in or session expired.

**Solution**:
- Clear browser cookies
- Try logging in again
- Check NEXTAUTH_SECRET is set

### **Error: "Invalid credentials"**

**Solution**:
```bash
# Use demo credentials
Email: demo@momentverse.com
Password: password123
```

## 💳 **Payment Issues**

### **Error: Stripe webhook failures**

**Solution**:
1. Check STRIPE_WEBHOOK_SECRET is correct
2. Verify webhook endpoint URL
3. Test with Stripe CLI

### **Error: Payment processing failed**

**Solution**:
- Use Stripe test cards for development
- Check STRIPE_SECRET_KEY is set
- Verify webhook is configured

## 📧 **Email Issues**

### **Error: Email not sending**

**Solution**:
1. Check SENDGRID_API_KEY is set
2. Verify FROM_EMAIL is configured
3. Test email service connection

## 🎯 **Performance Issues**

### **Error: Slow loading times**

**Solution**:
1. Check database indexing
2. Verify virtual scrolling is working
3. Monitor bundle size
4. Check network requests

### **Error: Memory issues with large datasets**

**Solution**:
- Virtual scrolling is already implemented
- Pagination limits to 1000 items
- Database queries are optimized

## 🔍 **Debugging Commands**

### **Check Database Status**
```bash
# View database schema
npx prisma db pull

# Open database browser
npx prisma studio

# Check migrations
npx prisma migrate status
```

### **Check Environment Variables**
```bash
# Verify all required env vars are set
cat .env | grep -E "(DATABASE_URL|NEXTAUTH|STRIPE|SENDGRID)"
```

### **Check Application Logs**
```bash
# View Next.js logs
npm run dev

# Check for errors in browser console
# Check for errors in terminal output
```

## 🆘 **Getting Help**

### **Common Solutions**
1. **Restart everything**: `pkill -f "next dev" && npm run dev`
2. **Reset database**: `npx prisma db push --force-reset && npx prisma db seed`
3. **Clear cache**: `rm -rf .next && npm run build`
4. **Reinstall dependencies**: `rm -rf node_modules && npm install`

### **When to Contact Support**
- Database connection issues persist after troubleshooting
- Payment processing completely broken
- Security vulnerabilities discovered
- Performance issues affecting all users

### **Useful Commands for Support**
```bash
# System info
node --version
npm --version
npx prisma --version

# Database info
npx prisma db pull
npx prisma migrate status

# Build info
npm run build
```

---

**Remember**: Most issues can be resolved by following the database setup steps in DEPLOYMENT.md first! 