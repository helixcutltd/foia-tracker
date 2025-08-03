import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const stateCode = searchParams.get('stateCode')
    const countyId = searchParams.get('countyId')
    const foiaStatus = searchParams.get('foiaStatus')

    const where: any = {}
    
    if (foiaStatus) {
      where.foiaStatus = foiaStatus
    }

    if (countyId) {
      where.countyId = countyId
    } else if (stateCode) {
      where.county = {
        state: {
          code: stateCode
        }
      }
    }

    const cases = await prisma.case.findMany({
      where,
      include: {
        county: {
          include: {
            state: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(cases)
  } catch (error) {
    console.error('Error fetching cases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      caseNumber,
      crimeType,
      description,
      dateOccurred,
      countyId,
      screenshotPath,
      extractedData
    } = body

    const newCase = await prisma.case.create({
      data: {
        caseNumber,
        crimeType,
        description,
        dateOccurred: dateOccurred ? new Date(dateOccurred) : null,
        countyId,
        screenshotPath,
        extractedData
      }
    })

    return NextResponse.json(newCase, { status: 201 })
  } catch (error) {
    console.error('Error creating case:', error)
    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    )
  }
}