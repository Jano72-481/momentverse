import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // 2. Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // 'all', 'completed', 'pending'

    // 3. Build where clause
    const where: any = {
      userId: userId,
    }

    // Filter by payment status
    if (status === 'completed') {
      where.order = {
        status: 'COMPLETED'
      }
    } else if (status === 'pending') {
      where.order = {
        status: 'PENDING'
      }
    }

    // 4. Calculate pagination
    const skip = (page - 1) * limit

    // 5. Fetch moments with order details
    const [moments, totalCount] = await Promise.all([
      prisma.moment.findMany({
        where,
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
          order: {
            select: {
              status: true,
              amount: true,
              createdAt: true,
            }
          },
          star: {
            select: {
              name: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.moment.count({ where })
    ])

    // 6. Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    // 7. Return response
    return NextResponse.json({
      success: true,
      moments: moments,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        status,
      }
    })

  } catch (error) {
    console.error('Error fetching user moments:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch moments' },
      { status: 500 }
    )
  }
} 