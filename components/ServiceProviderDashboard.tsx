"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ServiceProviderDashboard() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    // Fetch service provider profile
    const fetchProfile = async () => {
      const response = await fetch('/api/service-provider/profile')
      const data = await response.json()
      setProfile(data)
    }
    fetchProfile()

    // Fetch bookings
    const fetchBookings = async () => {
      const response = await fetch('/api/service-provider/bookings')
      const data = await response.json()
      setBookings(data)
    }
    fetchBookings()
  }, [])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    // Implement profile update logic
  }

  const handleBookingAction = async (bookingId, action) => {
    // Implement booking action logic (accept/reject)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session?.user?.name}</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Profile Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate}>
            <div className="space-y-2">
              <Input placeholder="Services offered (comma-separated)" defaultValue={profile?.services.join(', ')} />
              <Select defaultValue={profile?.state}>
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add state options */}
                </SelectContent>
              </Select>
              <Select defaultValue={profile?.district}>
                <SelectTrigger>
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add district options */}
                </SelectContent>
              </Select>
              <Textarea placeholder="Availability" defaultValue={JSON.stringify(profile?.availability)} />
              <Button type="submit">Update Profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.map(booking => (
            <div key={booking.id} className="mb-2 p-2 border rounded">
              <p>User: {booking.userName}</p>
              <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
              <p>Status: {booking.status}</p>
              {booking.status === 'PENDING' && (
                <div className="mt-2 space-x-2">
                  <Button onClick={() => handleBookingAction(booking.id, 'accept')}>Accept</Button>
                  <Button variant="destructive" onClick={() => handleBookingAction(booking.id, 'reject')}>Reject</Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}