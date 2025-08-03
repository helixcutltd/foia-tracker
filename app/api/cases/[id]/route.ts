import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { foiaStatus, appliedDate } = body

    const updatedCase = await prisma.case.update({
      where: { id },
      data: {
        foiaStatus,
        appliedDate: appliedDate ? new Date(appliedDate) : undefined
      }
    })

    return NextResponse.json(updatedCase)
  } catch (error) {
    console.error('Error updating case:', error)
    return NextResponse.json(
      { error: 'Failed to update case' },
      { status: 500 }
    )
  }
}