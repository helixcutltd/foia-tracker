import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample data for demonstration - In production, you'd want complete county data
const statesWithCounties = [
  {
    name: 'California',
    code: 'CA',
    counties: ['Los Angeles', 'San Francisco', 'San Diego', 'Orange', 'Riverside', 'Sacramento']
  },
  {
    name: 'Texas',
    code: 'TX',
    counties: ['Harris', 'Dallas', 'Tarrant', 'Bexar', 'Travis', 'Fort Worth']
  },
  {
    name: 'New York',
    code: 'NY',
    counties: ['New York', 'Kings', 'Queens', 'Bronx', 'Nassau', 'Suffolk']
  },
  {
    name: 'Florida',
    code: 'FL',
    counties: ['Miami-Dade', 'Broward', 'Palm Beach', 'Hillsborough', 'Orange', 'Duval']
  },
  {
    name: 'Illinois',
    code: 'IL',
    counties: ['Cook', 'DuPage', 'Lake', 'Will', 'Kane', 'McHenry']
  }
]

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.case.deleteMany()
  await prisma.county.deleteMany()
  await prisma.state.deleteMany()

  // Seed states and counties
  for (const stateData of statesWithCounties) {
    const state = await prisma.state.create({
      data: {
        name: stateData.name,
        code: stateData.code,
      }
    })

    for (const countyName of stateData.counties) {
      await prisma.county.create({
        data: {
          name: countyName,
          stateId: state.id
        }
      })
    }
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })