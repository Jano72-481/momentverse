# 🔒 Row Level Security Setup for MomentVerse

## 🚨 **URGENT: Fix Supabase Security Issues**

Your Supabase dashboard is showing **5 security issues** that need immediate attention. This guide will fix them in 5 minutes.

## 📋 **Step-by-Step Instructions:**

### **Step 1: Open Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Click on **"SQL Editor"** in the left sidebar

### **Step 2: Run the Security Script**
1. Copy the entire contents of `supabase_rls_setup.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** to execute the script

### **Step 3: Verify the Fix**
1. Go to **"Table Editor"** in the left sidebar
2. Check each table - you should see **"RLS enabled"** status
3. Go back to **"Security"** dashboard - issues should be resolved

## ✅ **What This Fixes:**

- ✅ **Users table** - Users can only access their own data
- ✅ **Moments table** - Users can only see their own moments + public ones
- ✅ **Orders table** - Users can only see their own orders
- ✅ **Stars table** - Public catalog, protected from deletion
- ✅ **Analytics table** - Users can only see their own analytics

## 🔒 **Security Benefits:**

- **Data Privacy** - Users can't see each other's data
- **Payment Security** - Order data is protected
- **User Protection** - Personal information is secure
- **Audit Trail** - Critical data can't be deleted

## ⚡ **Time Required: 5 minutes**

**Run the script now to secure your MomentVerse.co!** 🔒

---

## 🎯 **After Running the Script:**

Your Supabase security dashboard should show:
- ✅ **0 security issues**
- ✅ **All tables have RLS enabled**
- ✅ **Proper access policies in place**

**Your MomentVerse.co will be fully secure!** 🚀
