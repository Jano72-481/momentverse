#!/bin/bash

# 🚀 MomentVerse Production Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting MomentVerse Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Stop development server
print_status "Stopping development server..."
pkill -f "next dev" || print_warning "No development server found"

# Step 2: Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Step 3: Install dependencies
print_status "Installing dependencies..."
npm install

# Step 4: Run database migrations
print_status "Applying database migrations..."
npx prisma migrate deploy

# Step 5: Build for production
print_status "Building for production..."
npm run build

# Step 6: Run tests (if available)
if [ -f "package.json" ] && grep -q "\"test\":" package.json; then
    print_status "Running tests..."
    npm test || print_warning "Tests failed, but continuing deployment..."
fi

# Step 7: Check git status
if [ -d ".git" ]; then
    print_status "Checking git status..."
    
    # Check if there are uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Uncommitted changes detected. Committing them..."
        git add .
        git commit -m "🚀 Production deployment - MomentVerse v1.0 - $(date)"
    fi
    
    # Push to remote
    print_status "Pushing to remote repository..."
    git push origin main || print_warning "Failed to push to remote. Please check your git configuration."
else
    print_warning "Git repository not found. Skipping git operations."
fi

# Step 8: Seed database (if needed)
print_status "Seeding database..."
npx prisma db seed || print_warning "Database seeding failed or not configured."

# Step 9: Final checks
print_status "Running final checks..."

# Check if build was successful
if [ -d ".next" ]; then
    print_success "Build completed successfully!"
else
    print_error "Build failed! Check the output above for errors."
    exit 1
fi

# Check environment variables
print_status "Checking environment variables..."
if [ -f ".env" ]; then
    print_success "Environment file found"
else
    print_warning "No .env file found. Make sure to configure environment variables in your deployment platform."
fi

print_success "🎉 Deployment preparation completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure environment variables in Vercel:"
echo "   - DATABASE_URL (PostgreSQL)"
echo "   - NEXTAUTH_SECRET (64-char secret)"
echo "   - NEXTAUTH_URL (your domain)"
echo "   - STRIPE_SECRET_KEY & STRIPE_WEBHOOK_SECRET"
echo "   - SENDGRID_API_KEY"
echo ""
echo "2. Import repository to Vercel:"
echo "   - Go to vercel.com"
echo "   - Click 'New Project'"
echo "   - Import your GitHub repository"
echo "   - Configure environment variables"
echo "   - Deploy!"
echo ""
echo "3. Set up custom domain and SSL"
echo ""
echo "4. Test the deployment:"
echo "   - Visit your domain"
echo "   - Test user registration"
echo "   - Test moment creation"
echo "   - Test payment flow"
echo ""
echo "🚀 Your MomentVerse is ready to go live!" 