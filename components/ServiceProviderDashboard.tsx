"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar } from '@/components/ui/calendar'
import { Progress } from '@/components/ui/progress'

export default function ServiceProviderDashboard() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [contactClicks, setContactClicks] = useState([])
  const [images, setImages] = useState([])
  const [profileCompletion, setProfileCompletion] = useState(0)

  useEffect(() => {
    // Fetch service provider profile
    const fetchProfile = async () => {
      const response = await fetch('/api/service-provider/profile')
      const data = await response.json()
      setProfile(data)
      calculateProfileCompletion(data)
    }
    fetchProfile()

    // Fetch bookings
    const fetchBookings = async () => {
      const response = await fetch('/api/service-provider/bookings')
      const data = await response.json()
      setBookings(data)
    }
    fetchBookings()

    // Fetch contact clicks data
    const fetchContactClicks = async () => {
      const response = await fetch('/api/service-provider/contact-clicks')
      const data = await response.json()
      setContactClicks(data)
    }
    fetchContactClicks()

    // Fetch images
    const fetchImages = async () => {
      const response = await fetch('/api/service-provider/images')
      const data = await response.json()
      setImages(data)
    }
    fetchImages()
  }, [])

  const calculateProfileCompletion = (profileData) => {
    let completedFields = 0
    const totalFields = 5 // Adjust this number based on the total number of profile fields

    if (profileData.name) completedFields++
    if (profileData.services && profileData.services.length > 0) completedFields++
    if (profileData.state) completedFields++
    if (profileData.district) completedFields++
    if (images.length > 0) completedFields++

    setProfileCompletion((completedFields / totalFields) * 100)
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    // Implement profile update logic
  }

  const handleBookingAction = async (bookingId, action) => {
    // Implement booking action logic (accept/reject)
  }

  const handleImageUpload = async (e) => {
    // Implement image upload logic
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session?.user?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={profileCompletion} className="w-full" />
            <p className="mt-2">{profileCompletion.toFixed(0)}% Complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Clicks Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={contactClicks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="clicks" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Profile Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate}>
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold">Services Offered:</h3>
                <p>{profile?.services.join(', ')}</p>
              </div>
              <div>
                <h3 className="font-semibold">Location:</h3>
                <p>{profile?.district}, {profile?.state}</p>
              </div>
              <Textarea placeholder="Availability" defaultValue={JSON.stringify(profile?.availability)} />
              <Button type="submit">Update Profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Image Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {images.map((image, index) => (
              <img key={index} src={image.url} alt={`Service ${index + 1}`} className="w-full h-32 object-cover rounded" />
            ))}
          </div>
          <Input type="file" onChange={handleImageUpload} accept="image/*" />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Booking Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Calendar
                mode="single"
                selected={new Date()}
                onSelect={() => {}}
                className="rounded-md border"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Upcoming Bookings</h3>
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}