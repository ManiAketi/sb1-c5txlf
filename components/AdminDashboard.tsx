"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [serviceProviders, setServiceProviders] = useState([])

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    }
    fetchStats()

    // Fetch users
    const fetchUsers = async () => {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data)
    }
    fetchUsers()

    // Fetch service providers
    const fetchServiceProviders = async () => {
      const response = await fetch('/api/admin/service-providers')
      const data = await response.json()
      setServiceProviders(data)
    }
    fetchServiceProviders()
  }, [])

  const handleUserAction = async (userId, action) => {
    // Implement user action logic (activate/deactivate/delete)
  }

  const handleServiceProviderAction = async (providerId, action) => {
    // Implement service provider action logic (activate/deactivate/delete)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {stats && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Users', count: stats.userCount },
                { name: 'Service Providers', count: stats.serviceProviderCount },
                { name: 'Bookings', count: stats.bookingCount },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {users.map(user => (
            <div key={user.id} className="mb-2 p-2 border rounded">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <div className="mt-2 space-x-2">
                <Button onClick={() => handleUserAction(user.id, 'activate')}>Activate</Button>
                <Button onClick={() => handleUserAction(user.id, 'deactivate')}>Deactivate</Button>
                <Button variant="destructive" onClick={() => handleUserAction(user.id, 'delete')}>Delete</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Provider Management</CardTitle>
        </CardHeader>
        <CardContent>
          {serviceProviders.map(provider => (
            <div key={provider.id} className="mb-2 p-2 border rounded">
              <p>Name: {provider.name}</p>
              <p>Services: {provider.services.join(', ')}</p>
              <p>Location: {provider.district}, {provider.state}</p>
              <div className="mt-2 space-x-2">
                <Button onClick={() => handleServiceProviderAction(provider.id, 'activate')}>Activate</Button>
                <Button onClick={() => handleServiceProviderAction(provider.id, 'deactivate')}>Deactivate</Button>
                <Button variant="destructive" onClick={() => handleServiceProviderAction(provider.id, 'delete')}>Delete</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}