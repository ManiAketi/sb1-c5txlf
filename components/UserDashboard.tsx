"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function UserDashboard() {
  const { data: session } = useSession()
  const [serviceProviders, setServiceProviders] = useState([])
  const [filteredProviders, setFilteredProviders] = useState([])
  const [stateFilter, setStateFilter] = useState('')
  const [districtFilter, setDistrictFilter] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')

  useEffect(() => {
    // Fetch service providers
    const fetchServiceProviders = async () => {
      const response = await fetch('/api/service-providers')
      const data = await response.json()
      setServiceProviders(data)
      setFilteredProviders(data)
    }
    fetchServiceProviders()
  }, [])

  useEffect(() => {
    // Apply filters
    const filtered = serviceProviders.filter(provider => 
      (!stateFilter || provider.state === stateFilter) &&
      (!districtFilter || provider.district === districtFilter) &&
      (!serviceFilter || provider.services.includes(serviceFilter))
    )
    setFilteredProviders(filtered)
  }, [stateFilter, districtFilter, serviceFilter, serviceProviders])

  const handleBookSlot = (providerId) => {
    // Implement booking logic
    console.log(`Booking slot for provider ${providerId}`)
  }

  const handleShowPhoneNumber = (providerId) => {
    // Implement phone number reveal logic
    console.log(`Showing phone number for provider ${providerId}`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session?.user?.name}</h1>
      
      <div className="mb-4 flex space-x-2">
        <Select onValueChange={setStateFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by State" />
          </SelectTrigger>
          <SelectContent>
            {/* Add state options */}
          </SelectContent>
        </Select>
        <Select onValueChange={setDistrictFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by District" />
          </SelectTrigger>
          <SelectContent>
            {/* Add district options */}
          </SelectContent>
        </Select>
        <Select onValueChange={setServiceFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Service" />
          </SelectTrigger>
          <SelectContent>
            {/* Add service options */}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProviders.map(provider => (
          <Card key={provider.id}>
            <CardHeader>
              <CardTitle>{provider.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Services: {provider.services.join(', ')}</p>
              <p>Location: {provider.district}, {provider.state}</p>
              <div className="mt-2 space-y-2">
                <Button onClick={() => handleBookSlot(provider.id)}>Book Slot</Button>
                <Button variant="outline" onClick={() => handleShowPhoneNumber(provider.id)}>Show Phone Number</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}