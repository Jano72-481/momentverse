#!/bin/bash

# MomentVerse Deployment Script
# This script helps you deploy your MomentVerse application

set -e

echo "🚀 MomentVerse Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if all dependencies are installed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Check if environment file exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Please create it from env.example"
    echo "   cp env.example .env.local"
    echo "   Then update with your production values"
fi

# Build the application
echo "🔨 Building application..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix the errors above."
    exit 1
fi

# Check for common issues
echo "🔍 Running pre-deployment checks..."

# Check for hardcoded localhost URLs
if grep -r "localhost:3000" src/ --exclude-dir=node_modules; then
    echo "⚠️  Warning: Found hardcoded localhost URLs. Update them for production."
fi

# Check for test API keys
if grep -r "pk_test_" src/ --exclude-dir=node_modules; then
    echo "⚠️  Warning: Found test Stripe keys. Use production keys in production."
fi

# Check for SQLite database references
if grep -r "file:./dev.db" src/ --exclude-dir=node_modules; then
    echo "⚠️  Warning: Found SQLite database references. Use PostgreSQL in production."
fi

echo ""
echo "🎉 Pre-deployment checks complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to vercel.com"
echo "   - Import your GitHub repository"
echo "   - Configure environment variables"
echo "   - Deploy!"
echo ""
echo "3. Set up your database:"
echo "   - Use Vercel Postgres or Supabase"
echo "   - Update DATABASE_URL in environment variables"
echo ""
echo "4. Configure Stripe:"
echo "   - Switch to production keys"
echo "   - Set up webhooks"
echo "   - Test payment flow"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🌟 Your MomentVerse is ready to go live!" 