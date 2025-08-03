import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const stateCode = searchParams.get('stateCode')

    const where = stateCode ? {
      state: {
        code: stateCode
      }
    } : {}

    const counties = await prisma.county.findMany({
      where,
      include: {
        state: true,
        _count: {
          select: {
            cases: {
              where: {
                foiaStatus: 'PENDING'
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    const countiesWithCounts = counties.map(county => ({
      ...county,
      pendingCases: county._count.cases
    }))

    return NextResponse.json(countiesWithCounts)
  } catch (error) {
    console.error('Error fetching counties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch counties' },
      { status: 500 }
    )
  }
}