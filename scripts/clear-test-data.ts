import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearTestData() {
  console.log('🧹 Clearing all test data...')

  try {
    // Delete in correct order due to foreign key constraints
    await prisma.case.deleteMany()
    console.log('✅ Cleared all cases')

    await prisma.county.deleteMany()  
    console.log('✅ Cleared all counties')

    await prisma.state.deleteMany()
    console.log('✅ Cleared all states')

    console.log('🎉 Database cleared successfully!')
    console.log('Ready for production deployment!')
  } catch (error) {
    console.error('❌ Error clearing data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearTestData()