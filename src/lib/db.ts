import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "production" ? ["error", "warn"] : ["query", "error", "warn"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// Error handling with better logging
prisma.$use(async (params, next) => {
  const start = Date.now()
  try {
    const result = await next(params)
    const duration = Date.now() - start
    
    // Log slow queries
    if (duration > 1000) {
      console.warn(`Slow query detected: ${params.model}.${params.action} took ${duration}ms`)
    }
    
    return result
  } catch (error) {
    const duration = Date.now() - start
    console.error(`Database error in ${params.model}.${params.action} after ${duration}ms:`, error)
    throw error
  }
})

// Performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  prisma.$use(async (params, next) => {
    const before = Date.now()
    const result = await next(params)
    const after = Date.now()
    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
    return result
  })
}

// Get moment by ID
export async function getMomentById(id: string) {
  try {
    return await prisma.moment.findUnique({
      where: { id },
      include: {
        user: true,
        star: true,
      },
    });
  } catch (error) {
    console.error('Error fetching moment:', error);
    return null;
  }
}

// Get trending moments
export async function getTrendingMoments(limit: number = 6) {
  try {
    return await prisma.moment.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        star: true,
      },
    });
  } catch (error) {
    console.error('Error fetching trending moments:', error);
    return [];
  }
} 