"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import UserDashboard from '@/components/UserDashboard'
import ServiceProviderDashboard from '@/components/ServiceProviderDashboard'
import AdminDashboard from '@/components/AdminDashboard'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  switch (session.user.role) {
    case 'USER':
      return <UserDashboard />
    case 'SERVICE_PROVIDER':
      return <ServiceProviderDashboard />
    case 'ADMIN':
      return <AdminDashboard />
    default:
      return <div>Invalid user role</div>
  }
}