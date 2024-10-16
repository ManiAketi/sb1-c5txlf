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

    const serviceProviders = await prisma.serviceProvider.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    const formattedProviders = serviceProviders.map(provider => ({
      id: provider.id,
      userId: provider.user.id,
      name: provider.user.name,
      email: provider.user.email,
      services: provider.services,
      state: provider.state,
      district: provider.district,
    }))

    return NextResponse.json(formattedProviders)
  } catch (error) {
    console.error('Error fetching service providers:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { providerId, action } = await req.json()

    if (!['activate', 'deactivate'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const updatedProvider = await prisma.serviceProvider.update({
      where: { id: providerId },
      data: {
        // Assuming we have an 'active' field in the ServiceProvider model
        active: action === 'activate',
      },
    })

    return NextResponse.json(updatedProvider)
  } catch (error) {
    console.error('Error updating service provider:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { providerId } = await req.json()

    await prisma.serviceProvider.delete({
      where: { id: providerId },
    })

    return NextResponse.json({ message: 'Service provider deleted successfully' })
  } catch (error) {
    console.error('Error deleting service provider:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}