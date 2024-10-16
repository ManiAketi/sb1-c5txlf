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

    const serviceProvider = await prisma.serviceProvider.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!serviceProvider) {
      return NextResponse.json({ error: 'Service provider not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: serviceProvider.id,
      name: serviceProvider.user.name,
      email: serviceProvider.user.email,
      services: serviceProvider.services,
      state: serviceProvider.state,
      district: serviceProvider.district,
      availability: serviceProvider.availability,
    })
  } catch (error) {
    console.error('Error fetching service provider profile:', error)
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

    const { services, state, district, availability } = await req.json()

    const updatedProvider = await prisma.serviceProvider.update({
      where: { userId: session.user.id },
      data: {
        services,
        state,
        district,
        availability,
      },
    })

    return NextResponse.json(updatedProvider)
  } catch (error) {
    console.error('Error updating service provider profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}