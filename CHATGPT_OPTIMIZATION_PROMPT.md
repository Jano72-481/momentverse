# MomentVerse Production Optimization Prompt for ChatGPT

## Project Overview
You are analyzing a Next.js 14 application called "MomentVerse" - a platform where users can claim moments in time and get certificates. The app allows users to:
- Sign up/login with email authentication
- Claim moments by selecting date/time ranges
- Purchase star add-ons and premium certificates
- View timelines and share moments
- Generate PDF certificates

## Current Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM, SQLite database
- **Authentication**: NextAuth.js with custom email/password
- **Payments**: Stripe integration
- **UI Components**: Radix UI, Framer Motion, React Three Fiber
- **Charts/Visualization**: D3.js, Visx, Recharts
- **Testing**: Vitest, React Testing Library

## Your Mission: Production Readiness Analysis & Optimization

### 1. **Performance & Scalability Analysis**
- **Database Optimization**: Review Prisma schema, queries, and indexes for SQLite → PostgreSQL migration readiness
- **API Route Performance**: Analyze all `/api/*` routes for bottlenecks, N+1 queries, and optimization opportunities
- **Frontend Performance**: Check for unnecessary re-renders, bundle size optimization, image optimization
- **Caching Strategy**: Implement Redis caching for frequently accessed data (trending moments, user sessions)
- **Rate Limiting**: Enhance current rate limiting to handle thousands of concurrent users
- **Database Connection Pooling**: Optimize Prisma client configuration for high concurrency

### 2. **Security Hardening**
- **Authentication Security**: Review NextAuth configuration, session management, and password policies
- **API Security**: Validate all input data, implement proper CORS, check for SQL injection vulnerabilities
- **Environment Variables**: Ensure all secrets are properly configured and not exposed
- **Content Security Policy**: Review and enhance CSP headers
- **Input Validation**: Implement comprehensive Zod schemas for all user inputs

### 3. **Error Handling & Monitoring**
- **Global Error Boundaries**: Implement comprehensive error handling for React components
- **API Error Responses**: Standardize error response formats across all API routes
- **Logging Strategy**: Implement structured logging for debugging and monitoring
- **Health Checks**: Add health check endpoints for monitoring
- **Graceful Degradation**: Ensure app works even if some services fail

### 4. **User Experience Optimization**
- **Loading States**: Implement skeleton loaders and optimistic updates
- **Form Validation**: Add real-time validation feedback
- **Mobile Responsiveness**: Ensure perfect mobile experience
- **Accessibility**: Add ARIA labels, keyboard navigation, screen reader support
- **Offline Support**: Implement service worker for basic offline functionality

### 5. **Infrastructure & Deployment**
- **Environment Configuration**: Set up proper environment variables for staging/production
- **Database Migration**: Prepare for SQLite → PostgreSQL migration
- **CDN Setup**: Configure image and static asset delivery
- **Monitoring**: Set up performance monitoring and alerting
- **Backup Strategy**: Implement database backup and recovery procedures

### 6. **Code Quality & Maintenance**
- **TypeScript Strictness**: Enable strict TypeScript configuration
- **Code Splitting**: Implement dynamic imports for better performance
- **Testing Coverage**: Add unit and integration tests for critical paths
- **Documentation**: Add JSDoc comments and API documentation
- **Code Organization**: Refactor for better maintainability

## Specific Areas to Focus On:

### Database & API Routes
- `/api/moments/*` - Moment creation, retrieval, and management
- `/api/auth/*` - Authentication flows
- `/api/certificates/*` - PDF generation and certificate management
- `/api/stripe-webhook/*` - Payment processing
- `/api/timeline` - Timeline data aggregation

### Critical Components
- `src/components/Timeline.tsx` - Main timeline visualization
- `src/components/MomentCard.tsx` - Moment display component
- `src/app/moment/[id]/page.tsx` - Individual moment pages
- `src/app/profile/page.tsx` - User profile management
- `src/middleware.ts` - Request handling and security

### Performance Critical Features
- Timeline rendering with large datasets
- PDF certificate generation
- Real-time moment updates
- Image optimization and delivery
- Payment processing flows

## Deliverables Expected:

1. **Performance Report**: Identify bottlenecks and provide optimization recommendations
2. **Security Audit**: List vulnerabilities and provide fixes
3. **Code Improvements**: Suggest specific code changes for better performance/maintainability
4. **Infrastructure Recommendations**: Database, caching, and deployment optimizations
5. **Testing Strategy**: Comprehensive testing approach for production readiness
6. **Monitoring Setup**: Performance and error monitoring recommendations

## Constraints:
- **DO NOT** change the visual design or UI/UX - keep everything looking exactly the same
- **DO NOT** remove any existing features
- **DO** focus on making everything more efficient, faster, and more reliable
- **DO** ensure the app can handle thousands of concurrent users
- **DO** maintain all existing functionality while improving performance

## Success Criteria:
- App loads in under 2 seconds on 3G connection
- API responses under 200ms for 95% of requests
- Zero security vulnerabilities
- 99.9% uptime capability
- Smooth user experience with no lag or glitches
- Comprehensive error handling and recovery
- Production-ready monitoring and alerting

Please analyze the entire codebase and provide specific, actionable recommendations and code improvements to achieve these goals.
