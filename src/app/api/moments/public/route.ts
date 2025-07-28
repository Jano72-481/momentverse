import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const moments = await prisma.moment.findMany({
      where: {
        isPublic: true,
      },
      include: {
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

    return NextResponse.json(moments)
  } catch (error) {
    console.error('Error fetching public moments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 