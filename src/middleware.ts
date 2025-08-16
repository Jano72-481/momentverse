import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Simple in-memory rate limiting for development
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 200 // requests per window

// Security headers configuration
const SECURE_HEADERS: Record<string,string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static assets and webhooks
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api/stripe-webhook") ||
    pathname.startsWith("/favicon.ico")
  ) {
    const response = NextResponse.next()
    // Apply security headers even to static assets
    for (const [k, v] of Object.entries(SECURE_HEADERS)) {
      response.headers.set(k, v)
    }
    return response
  }

  // Rate limit API routes
  if (pathname.startsWith('/api/')) {
    const clientId = request.ip || 'anonymous'
    const now = Date.now()
    
    const record = rateLimitStore.get(clientId)
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(clientId, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW
      })
    } else if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
      const response = NextResponse.json(
        { ok: false, error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      )
      for (const [k, v] of Object.entries(SECURE_HEADERS)) {
        response.headers.set(k, v)
      }
      return response
    } else {
      record.count++
    }

    // Clean up old entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }

  // Authentication checks for protected routes
  if (pathname.startsWith('/api/moments/') || 
      pathname.startsWith('/api/certificates/') ||
      pathname.startsWith('/profile')) {
    
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || ''
    })

    if (!token) {
      if (pathname.startsWith('/api/')) {
        const response = NextResponse.json(
          { ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
          { status: 401 }
        )
        for (const [k, v] of Object.entries(SECURE_HEADERS)) {
          response.headers.set(k, v)
        }
        return response
      } else {
        // Redirect to signin for page routes
        const response = NextResponse.redirect(new URL('/auth/signin', request.url))
        for (const [k, v] of Object.entries(SECURE_HEADERS)) {
          response.headers.set(k, v)
        }
        return response
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth/') && pathname !== '/auth/signin' && pathname !== '/auth/signup') {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || ''
    })

    if (token) {
      const response = NextResponse.redirect(new URL('/profile', request.url))
      for (const [k, v] of Object.entries(SECURE_HEADERS)) {
        response.headers.set(k, v)
      }
      return response
    }
  }

  // Handle CORS for API routes
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')
    
    // Allow specific origins in production
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = [
        'https://momentverse.com',
        'https://www.momentverse.com',
        'https://app.momentverse.com'
      ]
      
      if (origin && allowedOrigins.includes(origin)) {
        const response = NextResponse.next()
        response.headers.set('Access-Control-Allow-Origin', origin)
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        for (const [k, v] of Object.entries(SECURE_HEADERS)) {
          response.headers.set(k, v)
        }
        return response
      }
    } else {
      // Allow all origins in development
      const response = NextResponse.next()
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      for (const [k, v] of Object.entries(SECURE_HEADERS)) {
        response.headers.set(k, v)
      }
      return response
    }
  }

  // Handle OPTIONS requests for CORS
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 })
    for (const [k, v] of Object.entries(SECURE_HEADERS)) {
      response.headers.set(k, v)
    }
    return response
  }

  // Default response with security headers
  const response = NextResponse.next()
  for (const [k, v] of Object.entries(SECURE_HEADERS)) {
    response.headers.set(k, v)
  }
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 