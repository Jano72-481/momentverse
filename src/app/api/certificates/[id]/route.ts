import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { generateAndSaveCertificate } from '@/lib/certificate'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const momentId = params.id

    // 2. Get moment with order details
    const moment = await prisma.moment.findUnique({
      where: { id: momentId },
      include: {
        user: true,
        star: true,
        order: true,
      },
    })

    if (!moment) {
      return NextResponse.json(
        { error: 'Moment not found' },
        { status: 404 }
      )
    }

    // 3. Check if user owns the moment or if it's public
    const isOwner = session.user.id === moment.userId
    if (!isOwner && !moment.isPublic) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // 4. Check if order is completed
    if (moment.order?.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 402 }
      )
    }

    // 5. Generate certificate if it doesn't exist
    let certificateUrl = moment.certificateUrl
    if (!certificateUrl || !moment.certificateGenerated) {
      try {
        certificateUrl = await generateAndSaveCertificate(momentId)
      } catch (error) {
        console.error('Error generating certificate:', error)
        return NextResponse.json(
          { error: 'Failed to generate certificate' },
          { status: 500 }
        )
      }
    }

    // 6. Serve the certificate file
    const filePath = path.join(process.cwd(), 'public', certificateUrl)
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Certificate file not found' },
        { status: 404 }
      )
    }

    const fileBuffer = fs.readFileSync(filePath)
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="momentverse-certificate-${momentId}.pdf"`,
        'Cache-Control': 'private, max-age=3600', // Cache for 1 hour
      },
    })

  } catch (error) {
    console.error('Error serving certificate:', error)
    
    return NextResponse.json(
      { error: 'Failed to serve certificate' },
      { status: 500 }
    )
  }
}

// Handle certificate regeneration
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const momentId = params.id

    // 2. Get moment
    const moment = await prisma.moment.findUnique({
      where: { id: momentId },
      include: {
        user: true,
        order: true,
      },
    })

    if (!moment) {
      return NextResponse.json(
        { error: 'Moment not found' },
        { status: 404 }
      )
    }

    // 3. Check ownership
    if (session.user.id !== moment.userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // 4. Check payment status
    if (moment.order?.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 402 }
      )
    }

    // 5. Regenerate certificate
    try {
      const certificateUrl = await generateAndSaveCertificate(momentId)
      
      return NextResponse.json({
        success: true,
        message: 'Certificate regenerated successfully',
        certificateUrl,
      })
    } catch (error) {
      console.error('Error regenerating certificate:', error)
      return NextResponse.json(
        { error: 'Failed to regenerate certificate' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error regenerating certificate:', error)
    
    return NextResponse.json(
      { error: 'Failed to regenerate certificate' },
      { status: 500 }
    )
  }
} 