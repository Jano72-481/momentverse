import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { registerSchema, validateRequest, sanitizeInput } from '@/lib/validation'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json()
    const validation = validateRequest(registerSchema, body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { name, email, password } = validation.data

    // 2. Sanitize inputs
    const sanitizedName = sanitizeInput(name)
    const sanitizedEmail = email.toLowerCase().trim()

    // 3. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // 4. Hash password
    const passwordHash = await hashPassword(password)

    // 5. Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex')

    // 6. Create user in database
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        passwordHash,
        emailVerificationToken,
        emailVerified: false,
      },
    })

    // 7. Send verification email (don't await to avoid blocking)
    sendVerificationEmail(user.email, user.name || 'User', emailVerificationToken)
      .catch(console.error) // Log error but don't fail registration

    // 8. Return success response (don't include sensitive data)
    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      userId: user.id,
    })

  } catch (error) {
    console.error('Error registering user:', error)
    
    // Enhanced error handling
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        )
      }
      
      if (error.message.includes('Database')) {
        return NextResponse.json(
          { error: 'Database error. Please try again.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
} 