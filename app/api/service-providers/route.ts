import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const serviceProviders = await prisma.serviceProvider.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    const formattedProviders = serviceProviders.map(provider => ({
      id: provider.id,
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