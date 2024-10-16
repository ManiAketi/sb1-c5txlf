import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userCount = await prisma.user.count({
      where: { role: 'USER' },
    })

    const serviceProviderCount = await prisma.user.count({
      where: { role: 'SERVICE_PROVIDER' },
    })

    const bookingCount = await prisma.booking.count()

    return NextResponse.json({
      userCount,
      serviceProviderCount,
      bookingCount,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}