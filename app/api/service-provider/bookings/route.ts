import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SERVICE_PROVIDER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      where: {
        serviceProvider: {
          userId: session.user.id,
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      userName: booking.user.name,
      date: booking.date,
      status: booking.status,
    }))

    return NextResponse.json(formattedBookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SERVICE_PROVIDER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, action } = await req.json()

    if (!['CONFIRMED', 'CANCELLED'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
        serviceProvider: {
          userId: session.user.id,
        },
      },
      data: {
        status: action,
      },
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}