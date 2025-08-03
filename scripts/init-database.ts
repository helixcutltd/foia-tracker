import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function initDatabase() {
  console.log('🚀 Initializing database...')
  
  try {
    // Push schema to database
    console.log('📝 Creating database tables...')
    
    // Check if database is accessible
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Check if states table is empty
    const stateCount = await prisma.state.count()
    
    if (stateCount === 0) {
      console.log('🌱 Seeding initial data...')
      
      // Run the seed script
      const { main } = await import('../prisma/seed')
      await main()
      
      console.log('✅ Database seeded successfully!')
    } else {
      console.log('ℹ️  Database already contains data, skipping seed.')
    }
    
    console.log('🎉 Database initialization complete!')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

initDatabase()