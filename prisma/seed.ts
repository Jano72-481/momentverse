import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Safety check: Only seed in development
  if (process.env.NODE_ENV === 'production') {
    console.log('❌ Seeding is disabled in production')
    return
  }

  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.analytics.deleteMany()
  await prisma.order.deleteMany()
  await prisma.moment.deleteMany()
  await prisma.user.deleteMany()
  await prisma.star.deleteMany()

  // Create sample stars
  console.log('⭐ Creating sample stars...')
  const sampleStars = [
    { hipparcosId: 71683, name: 'Alpha Centauri', ra: 219.902, dec: -60.833, mag: -0.27 },
    { hipparcosId: 91262, name: 'Vega', ra: 279.235, dec: 38.784, mag: 0.03 },
    { hipparcosId: 69673, name: 'Arcturus', ra: 213.915, dec: 19.182, mag: -0.05 },
    { hipparcosId: 24608, name: 'Capella', ra: 79.172, dec: 45.998, mag: 0.08 },
    { hipparcosId: 24436, name: 'Rigel', ra: 78.634, dec: -8.202, mag: 0.12 },
    { hipparcosId: 37279, name: 'Procyon', ra: 114.825, dec: 5.225, mag: 0.34 },
    { hipparcosId: 7588, name: 'Achernar', ra: 24.429, dec: -57.237, mag: 0.46 },
    { hipparcosId: 27989, name: 'Betelgeuse', ra: 88.793, dec: 7.407, mag: 0.50 },
    { hipparcosId: 68702, name: 'Hadar', ra: 210.956, dec: -60.373, mag: 0.61 },
    { hipparcosId: 97649, name: 'Altair', ra: 297.696, dec: 8.868, mag: 0.77 },
  ]

  for (const star of sampleStars) {
    await prisma.star.create({
      data: star
    })
  }

  // Create sample users with hashed passwords
  console.log('👥 Creating sample users...')
  const sampleUsers = [
    {
      email: 'demo@momentverse.com',
      name: 'Demo User',
      passwordHash: await bcrypt.hash('password123', 12),
      emailVerified: true,
    },
    {
      email: 'sarah@example.com',
      name: 'Sarah M.',
      passwordHash: await bcrypt.hash('password123', 12),
      emailVerified: true,
    },
    {
      email: 'mike@example.com',
      name: 'Mike R.',
      passwordHash: await bcrypt.hash('password123', 12),
      emailVerified: true,
    },
  ]

  for (const user of sampleUsers) {
    await prisma.user.create({
      data: user
    })
  }

  // Create sample moments and orders
  console.log('⏰ Creating sample moments...')
  const users = await prisma.user.findMany()
  const stars = await prisma.star.findMany()

  const sampleMoments = [
    {
      startTime: new Date('2024-01-15T10:30:00Z'),
      endTime: new Date('2024-01-15T10:30:30Z'),
      dedication: 'My graduation moment - forever preserved in the cosmos!',
      isPublic: true,
      hasStarAddon: true,
      hasPremiumCert: true,
      userId: users[0].id,
      starId: stars[0].id,
    },
    {
      startTime: new Date('2024-02-14T18:00:00Z'),
      endTime: new Date('2024-02-14T18:00:45Z'),
      dedication: 'The moment I said "I do" - now eternal among the stars',
      isPublic: true,
      hasStarAddon: true,
      hasPremiumCert: true,
      userId: users[1].id,
      starId: stars[1].id,
    },
    {
      startTime: new Date('2024-03-20T14:15:00Z'),
      endTime: new Date('2024-03-20T14:15:20Z'),
      dedication: 'Baby\'s first breath - a moment of pure magic',
      isPublic: true,
      hasStarAddon: false,
      hasPremiumCert: false,
      userId: users[2].id,
    },
    {
      startTime: new Date('2024-04-10T09:00:00Z'),
      endTime: new Date('2024-04-10T09:00:10Z'),
      dedication: 'The moment I got my dream job - stars aligned!',
      isPublic: false,
      hasStarAddon: true,
      hasPremiumCert: false,
      userId: users[0].id,
      starId: stars[2].id,
    },
  ]

  for (const moment of sampleMoments) {
    const createdMoment = await prisma.moment.create({
      data: moment
    })

    // Calculate price based on add-ons
    let amount = 500 // Base $5.00
    if (moment.hasStarAddon) amount += 300 // +$3.00
    if (moment.hasPremiumCert) amount += 500 // +$5.00

    // Create associated order
    await prisma.order.create({
      data: {
        momentId: createdMoment.id,
        userId: moment.userId,
        amount: amount,
        status: 'COMPLETED',
        stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
        hasStarAddon: moment.hasStarAddon,
        hasPremiumCert: moment.hasPremiumCert,
      }
    })
  }

  // Create sample analytics events
  console.log('📊 Creating sample analytics...')
  const analyticsEvents = [
    { event: 'page_view', source: 'direct', userId: users[0].id },
    { event: 'form_fill', source: 'tiktok', userId: users[0].id },
    { event: 'tiktok_click', source: 'tiktok', userId: users[1].id },
    { event: 'certificate_download', source: 'organic', userId: users[0].id },
    { event: 'moment_shared', source: 'organic', userId: users[1].id },
  ]

  for (const event of analyticsEvents) {
    await prisma.analytics.create({
      data: {
        ...event,
        metadata: JSON.stringify({ 
          timestamp: new Date().toISOString(),
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          ipAddress: '127.0.0.1',
        }),
      }
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Demo Credentials:')
  console.log('Email: demo@momentverse.com')
  console.log('Password: password123')
  console.log('\n🌐 Visit http://localhost:3000 to explore!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 