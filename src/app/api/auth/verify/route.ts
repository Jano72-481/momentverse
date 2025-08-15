import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin?error=invalid-token', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerified: false,
      },
    })

    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin?error=invalid-token', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
    }

    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - (user.updatedAt?.getTime() || 0)
    const tokenExpiry = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

    if (tokenAge > tokenExpiry) {
      return NextResponse.redirect(new URL('/auth/signin?error=token-expired', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
    }

    // Verify the user's email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    })

    // Redirect to signin with success message
    return NextResponse.redirect(new URL('/auth/signin?message=verification-success', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))

  } catch (error) {
    console.error('Error verifying email:', error)
    return NextResponse.redirect(new URL('/auth/signin?error=verification-failed', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  }
}
