import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const states = await prisma.state.findMany({
      include: {
        _count: {
          select: {
            counties: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Get case counts for each state
    const statesWithCounts = await Promise.all(
      states.map(async (state) => {
        const pendingCount = await prisma.case.count({
          where: {
            foiaStatus: 'PENDING',
            county: {
              stateId: state.id
            }
          }
        })

        return {
          ...state,
          pendingCases: pendingCount
        }
      })
    )

    return NextResponse.json(statesWithCounts)
  } catch (error) {
    console.error('Error fetching states:', error)
    return NextResponse.json(
      { error: 'Failed to fetch states' },
      { status: 500 }
    )
  }
}