import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample star data from Hipparcos catalog (brightest stars)
const starData = [
  { hipparcosId: 32349, name: "Sirius", ra: 101.287155, dec: -16.716116, mag: -1.46 },
  { hipparcosId: 30438, name: "Canopus", ra: 95.987958, dec: -52.695661, mag: -0.74 },
  { hipparcosId: 69673, name: "Arcturus", ra: 213.915300, dec: 19.182409, mag: -0.05 },
  { hipparcosId: 71683, name: "Vega", ra: 279.234735, dec: 38.783689, mag: 0.03 },
  { hipparcosId: 24608, name: "Capella", ra: 79.172328, dec: 45.997991, mag: 0.08 },
  { hipparcosId: 37279, name: "Rigel", ra: 78.634467, dec: -8.201638, mag: 0.12 },
  { hipparcosId: 65474, name: "Procyon", ra: 114.825493, dec: 5.224988, mag: 0.38 },
  { hipparcosId: 60718, name: "Achernar", ra: 24.428523, dec: -57.236753, mag: 0.46 },
  { hipparcosId: 7588, name: "Betelgeuse", ra: 88.792939, dec: 7.407064, mag: 0.50 },
  { hipparcosId: 97649, name: "Hadar", ra: 210.955856, dec: -60.373035, mag: 0.61 },
  { hipparcosId: 68702, name: "Altair", ra: 297.695827, dec: 8.868321, mag: 0.77 },
  { hipparcosId: 86032, name: "Acrux", ra: 186.649563, dec: -63.099093, mag: 0.77 },
  { hipparcosId: 107315, name: "Aldebaran", ra: 68.980163, dec: 16.509302, mag: 0.87 },
  { hipparcosId: 113368, name: "Spica", ra: 201.298247, dec: -11.161319, mag: 0.98 },
  { hipparcosId: 62434, name: "Antares", ra: 247.351915, dec: -26.432003, mag: 1.06 },
  { hipparcosId: 102098, name: "Pollux", ra: 116.328957, dec: 28.026199, mag: 1.16 },
  { hipparcosId: 80763, name: "Fomalhaut", ra: 344.412693, dec: -29.622237, mag: 1.17 },
  { hipparcosId: 21421, name: "Deneb", ra: 310.357979, dec: 45.280339, mag: 1.25 },
  { hipparcosId: 24436, name: "Mimosa", ra: 174.791512, dec: -69.717208, mag: 1.30 },
  { hipparcosId: 36850, name: "Regulus", ra: 152.092962, dec: 11.967209, mag: 1.36 },
  { hipparcosId: 49669, name: "Adhara", ra: 104.656453, dec: -28.972086, mag: 1.50 },
  { hipparcosId: 33579, name: "Castor", ra: 113.649428, dec: 31.888276, mag: 1.58 },
  { hipparcosId: 26311, name: "Shaula", ra: 263.402167, dec: -37.103823, mag: 1.62 },
  { hipparcosId: 45238, name: "Bellatrix", ra: 81.282764, dec: 6.349703, mag: 1.64 },
  { hipparcosId: 25336, name: "Elnath", ra: 81.572971, dec: 28.607452, mag: 1.65 },
  { hipparcosId: 25428, name: "Miaplacidus", ra: 138.299906, dec: -69.717208, mag: 1.67 },
  { hipparcosId: 42913, name: "Alnilam", ra: 84.053388, dec: -1.201919, mag: 1.69 },
  { hipparcosId: 30324, name: "Alnair", ra: 332.549301, dec: -46.960974, mag: 1.73 },
  { hipparcosId: 31681, name: "Alnitak", ra: 85.189695, dec: -1.942574, mag: 1.74 },
  { hipparcosId: 65477, name: "Alioth", ra: 193.507290, dec: 55.959823, mag: 1.76 },
  { hipparcosId: 62956, name: "Dubhe", ra: 165.931965, dec: 61.751035, mag: 1.79 },
  { hipparcosId: 59774, name: "Mirfak", ra: 51.080708, dec: 49.861179, mag: 1.79 },
  { hipparcosId: 67301, name: "Wezen", ra: 105.429758, dec: -26.393200, mag: 1.83 },
  { hipparcosId: 34444, name: "Sargas", ra: 264.329711, dec: -42.997824, mag: 1.86 },
  { hipparcosId: 53910, name: "Kaus Australis", ra: 276.992966, dec: -34.384616, mag: 1.85 },
  { hipparcosId: 72607, name: "Avior", ra: 222.719873, dec: -59.229488, mag: 1.86 },
  { hipparcosId: 39953, name: "Alkaid", ra: 206.885157, dec: 49.313267, mag: 1.86 },
  { hipparcosId: 82273, name: "Menkent", ra: 211.670578, dec: -36.369958, mag: 1.86 },
  { hipparcosId: 46390, name: "Atria", ra: 161.692331, dec: -69.027712, mag: 1.87 },
  { hipparcosId: 61084, name: "Alhena", ra: 99.427961, dec: 16.399281, mag: 1.93 },
  { hipparcosId: 37826, name: "Peacock", ra: 306.411904, dec: -56.735090, mag: 1.94 },
  { hipparcosId: 76267, name: "Denebola", ra: 177.264910, dec: 14.572062, mag: 2.14 },
  { hipparcosId: 57632, name: "Gienah", ra: 183.951507, dec: -17.541929, mag: 2.58 },
  { hipparcosId: 677, name: "Polaris", ra: 37.952936, dec: 89.264217, mag: 1.97 },
  { hipparcosId: 10826, name: "Alpheratz", ra: 2.096916, dec: 29.090431, mag: 2.07 },
  { hipparcosId: 15863, name: "Almach", ra: 30.974804, dec: 42.329725, mag: 2.10 },
  { hipparcosId: 18532, name: "Hamal", ra: 31.793357, dec: 23.462418, mag: 2.01 },
  { hipparcosId: 2081, name: "Ankaa", ra: 6.570827, dec: -42.306361, mag: 2.40 },
  { hipparcosId: 20889, name: "Diphda", ra: 10.897379, dec: -17.986606, mag: 2.04 },
  { hipparcosId: 14135, name: "Navi", ra: 34.836065, dec: 56.537331, mag: 2.23 },
  { hipparcosId: 4427, name: "Schedar", ra: 10.126838, dec: 56.537331, mag: 2.24 },
  { hipparcosId: 3179, name: "Caph", ra: 2.294523, dec: 59.149781, mag: 2.28 },
  { hipparcosId: 5447, name: "Mirach", ra: 17.433016, dec: 35.620557, mag: 2.07 },
  { hipparcosId: 7607, name: "Algol", ra: 47.042215, dec: 40.955647, mag: 2.12 },
  { hipparcosId: 9884, name: "Menkar", ra: 45.569881, dec: 4.089738, mag: 2.54 },
  { hipparcosId: 13847, name: "Almach", ra: 30.974804, dec: 42.329725, mag: 2.10 },
  { hipparcosId: 14576, name: "Ruchbah", ra: 21.453569, dec: 60.235283, mag: 2.68 },
  { hipparcosId: 15863, name: "Almach", ra: 30.974804, dec: 42.329725, mag: 2.10 },
  { hipparcosId: 18532, name: "Hamal", ra: 31.793357, dec: 23.462418, mag: 2.01 },
  { hipparcosId: 2081, name: "Ankaa", ra: 6.570827, dec: -42.306361, mag: 2.40 },
  { hipparcosId: 20889, name: "Diphda", ra: 10.897379, dec: -17.986606, mag: 2.04 },
  { hipparcosId: 14135, name: "Navi", ra: 34.836065, dec: 56.537331, mag: 2.23 },
  { hipparcosId: 4427, name: "Schedar", ra: 10.126838, dec: 56.537331, mag: 2.24 },
  { hipparcosId: 3179, name: "Caph", ra: 2.294523, dec: 59.149781, mag: 2.28 },
  { hipparcosId: 5447, name: "Mirach", ra: 17.433016, dec: 35.620557, mag: 2.07 },
  { hipparcosId: 7607, name: "Algol", ra: 47.042215, dec: 40.955647, mag: 2.12 },
  { hipparcosId: 9884, name: "Menkar", ra: 45.569881, dec: 4.089738, mag: 2.54 },
  { hipparcosId: 13847, name: "Almach", ra: 30.974804, dec: 42.329725, mag: 2.10 },
  { hipparcosId: 14576, name: "Ruchbah", ra: 21.453569, dec: 60.235283, mag: 2.68 },
]

async function main() {
  console.log('🌟 Seeding stars...')
  
  for (const star of starData) {
    await prisma.star.upsert({
      where: { hipparcosId: star.hipparcosId },
      update: {},
      create: {
        hipparcosId: star.hipparcosId,
        name: star.name,
        ra: star.ra,
        dec: star.dec,
        mag: star.mag,
      },
    })
  }
  
  console.log(`✅ Seeded ${starData.length} stars`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 