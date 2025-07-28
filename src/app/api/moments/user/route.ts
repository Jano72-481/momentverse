import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    const moments = await prisma.moment.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        dedication: true,
        isPublic: true,
        hasStarAddon: true,
        hasPremiumCert: true,
        certificateUrl: true,
        certificateGenerated: true,
        createdAt: true,
        star: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(moments)
  } catch (error) {
    console.error('Error fetching user moments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch moments' },
      { status: 500 }
    )
  }
} 