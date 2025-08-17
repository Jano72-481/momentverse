import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const moments = await prisma.moment.findMany({
      where: {
        isPublic: true,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        dedication: true,
        isPublic: true,
        createdAt: true,
        star: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 100, // Limit to prevent performance issues
    })

    // Transform the data to handle missing columns gracefully
    const transformedMoments = moments.map(moment => ({
      ...moment,
      hasStarAddon: false, // Default value since column doesn't exist
      hasPremiumCert: false, // Default value since column doesn't exist
    }))

    return NextResponse.json(transformedMoments)
  } catch (error) {
    console.error('Error fetching public moments:', error)
    // Return fallback data for build time or when database is unavailable
    return NextResponse.json([
      {
        id: 'demo-1',
        startTime: new Date('2024-01-15T10:30:00Z'),
        endTime: new Date('2024-01-15T11:00:00Z'),
        dedication: 'Demo moment for build time',
        isPublic: true,
        createdAt: new Date('2024-01-15T10:30:00Z'),
        star: { name: 'Demo Star' },
        hasStarAddon: false,
        hasPremiumCert: false,
      }
    ])
  }
} 