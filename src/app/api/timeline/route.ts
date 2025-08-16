import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000);
    const timeScale = searchParams.get('timeScale') || 'month';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const userId = searchParams.get('userId');
    const isPublic = searchParams.get('isPublic');
    const tags = searchParams.get('tags')?.split(',');
    const search = searchParams.get('search');
    
    // Build where clause
    const where: any = {};
    
    // Date range filtering with enhanced validation
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Enhanced date validation - check for valid dates and reasonable ranges
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // Check if dates are within reasonable bounds (not too far in past/future)
        const now = new Date();
        const minDate = new Date(now.getFullYear() - 100, 0, 1); // 100 years ago
        const maxDate = new Date(now.getFullYear() + 10, 11, 31); // 10 years in future
        
        if (start >= minDate && start <= maxDate && end >= minDate && end <= maxDate) {
          where.startTime = {
            gte: start,
            lte: end
          };
        }
      }
    }
    
    // User filtering
    if (userId) {
      where.userId = userId;
    } else if (session?.user?.id) {
      // If no specific user requested, show user's own moments + public ones
      where.OR = [
        { userId: session.user.id },
        { isPublic: true }
      ];
    } else {
      // Not authenticated, only show public moments
      where.isPublic = true;
    }
    
    // Public/private filtering
    if (isPublic !== null) {
      where.isPublic = isPublic === 'true';
    }
    
    // Tag filtering
    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags
      };
    }
    
    // Search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { dedication: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch moments with pagination
    const [moments, totalCount] = await Promise.all([
      prisma.moment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          },
          star: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          startTime: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.moment.count({ where })
    ]);
    
    // Transform data for timeline
    const timelineData = moments.map(moment => ({
      id: moment.id,
      title: moment.dedication || 'Untitled Moment',
      description: moment.dedication,
      startTime: moment.startTime.toISOString(),
      endTime: moment.endTime?.toISOString(),
      isPublic: moment.isPublic,
      dedication: moment.dedication,
      star: !!moment.star,
      location: null,
      tags: [],
      imageUrl: null,
      count: 1, // For aggregation in chart view
      userId: moment.userId,
      user: moment.user,
      starUser: moment.star,
      // Add default values for missing columns
      hasStarAddon: false,
      hasPremiumCert: false,
      totalMoments: 1,
      starCount: moment.star ? 1 : 0
    }));
    
    // Aggregate data by time scale for chart view
    const aggregatedData = aggregateByTimeScale(timelineData, timeScale);
    
    return NextResponse.json({
      success: true,
      data: {
        moments: timelineData,
        aggregated: aggregatedData,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount,
          hasPrev: page > 1
        },
        filters: {
          timeScale,
          startDate,
          endDate,
          userId,
          isPublic,
          tags,
          search
        }
      }
    });
    
  } catch (error) {
    console.error('Timeline API error:', error);
    
    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('table') && error.message.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Database not initialized. Please run database migrations.' },
        { status: 500 }
      );
    }
    
    // Return empty state instead of error when no data exists
    return NextResponse.json({
      success: true,
      data: {
        moments: [],
        aggregated: [],
        pagination: {
          page: 1,
          limit: 100,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        filters: {
          timeScale: 'month',
          startDate: null,
          endDate: null,
          userId: null,
          isPublic: null,
          tags: null,
          search: null
        }
      }
    });
  }
}

// Helper function to aggregate data by time scale
function aggregateByTimeScale(moments: any[], timeScale: string) {
  const aggregated: { [key: string]: any } = {};
  
  moments.forEach(moment => {
    const date = new Date(moment.startTime);
    
    // Validate date before processing
    if (isNaN(date.getTime())) {
      return; // Skip invalid dates
    }
    
    let key: string;
    
    switch (timeScale) {
      case 'year':
        key = date.getFullYear().toString();
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0] || `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
        break;
      case 'day':
        key = date.toISOString().split('T')[0] || `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        break;
      case 'hour':
        const dayKey = date.toISOString().split('T')[0] || `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        key = `${dayKey}-${String(date.getHours()).padStart(2, '0')}`;
        break;
      default:
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    
    if (!aggregated[key]) {
      aggregated[key] = {
        key,
        count: 0,
        moments: [],
        totalMoments: 0,
        starCount: 0
      };
    }
    
    aggregated[key].count++;
    aggregated[key].moments.push(moment);
    aggregated[key].totalMoments += moment.totalMoments || 1;
    aggregated[key].starCount += moment.starCount || 0;
  });
  
  return Object.values(aggregated).sort((a, b) => {
    const dateA = new Date(a.key);
    const dateB = new Date(b.key);
    return dateB.getTime() - dateA.getTime();
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { startTime, endTime, dedication, isPublic, tags } = body;
    
    // Validate required fields
    if (!startTime || !dedication) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Validate dates
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : null;
    
    if (isNaN(start.getTime()) || (end && isNaN(end.getTime()))) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }
    
    // Check date range validity
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 100, 0, 1);
    const maxDate = new Date(now.getFullYear() + 10, 11, 31);
    
    if (start < minDate || start > maxDate || (end && (end < minDate || end > maxDate))) {
      return NextResponse.json({ error: 'Date out of valid range' }, { status: 400 });
    }
    
    // Create moment
    const moment = await prisma.moment.create({
      data: {
        userId: session.user.id,
        startTime: start,
        endTime: end || undefined,
        dedication,
        isPublic: isPublic ?? false,
        tags: tags || []
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: moment
    });
    
  } catch (error) {
    console.error('Error creating moment:', error);
    return NextResponse.json({ error: 'Failed to create moment' }, { status: 500 });
  }
} 