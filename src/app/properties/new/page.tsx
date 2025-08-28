'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { DataService } from '@/lib/data-service'
import { Market } from '@/lib/supabase'
import { ArrowLeft, Save } from 'lucide-react'
import { useEffect } from 'react'

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [markets, setMarkets] = useState<Market[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    address_line: '',
    city: '',
    state: '',
    postal_code: '',
    size_sqft: '',
    base_rent_psf: '',
    expenses_psf: '',
    phase: 'site_selection',
    notes: '',
    market_id: ''
  })

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const marketsData = await DataService.getMarkets()
        setMarkets(marketsData)
        if (marketsData.length > 0) {
          setFormData(prev => ({ ...prev, market_id: marketsData[0].id }))
        }
      } catch (error) {
        console.error('Error fetching markets:', error)
      }
    }

    fetchMarkets()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('properties')
        .insert([{
          ...formData,
          size_sqft: formData.size_sqft ? parseFloat(formData.size_sqft) : null,
          base_rent_psf: formData.base_rent_psf ? parseFloat(formData.base_rent_psf) : null,
          expenses_psf: formData.expenses_psf ? parseFloat(formData.expenses_psf) : null,
        }])

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      router.push('/properties')
    } catch (error) {
      console.error('Error creating property:', error)
      alert('Failed to create property. Please check the console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/properties">Properties</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>New Property</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Add New Property</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
              <CardDescription>
                Enter the details for the new property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Enter property title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="market_id">Market</Label>
                    <Select
                      value={formData.market_id}
                      onValueChange={(value) => handleChange('market_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a market" />
                      </SelectTrigger>
                      <SelectContent>
                        {markets.map((market) => (
                          <SelectItem key={market.id} value={market.id}>
                            {market.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_line">Address</Label>
                    <Input
                      id="address_line"
                      value={formData.address_line}
                      onChange={(e) => handleChange('address_line', e.target.value)}
                      placeholder="Enter street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => handleChange('postal_code', e.target.value)}
                      placeholder="Enter postal code"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size_sqft">Size (sq ft)</Label>
                    <Input
                      id="size_sqft"
                      type="number"
                      value={formData.size_sqft}
                      onChange={(e) => handleChange('size_sqft', e.target.value)}
                      placeholder="Enter size in square feet"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="base_rent_psf">Base Rent (per sq ft)</Label>
                    <Input
                      id="base_rent_psf"
                      type="number"
                      step="0.01"
                      value={formData.base_rent_psf}
                      onChange={(e) => handleChange('base_rent_psf', e.target.value)}
                      placeholder="Enter base rent per sq ft"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expenses_psf">Expenses (per sq ft)</Label>
                    <Input
                      id="expenses_psf"
                      type="number"
                      step="0.01"
                      value={formData.expenses_psf}
                      onChange={(e) => handleChange('expenses_psf', e.target.value)}
                      placeholder="Enter expenses per sq ft"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phase">Phase</Label>
                    <Select
                      value={formData.phase}
                      onValueChange={(value) => handleChange('phase', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select phase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="site_selection">Site Selection</SelectItem>
                        <SelectItem value="under_contract">Under Contract</SelectItem>
                        <SelectItem value="due_diligence">Due Diligence</SelectItem>
                        <SelectItem value="closing">Closing</SelectItem>
                        <SelectItem value="owned">Owned</SelectItem>
                        <SelectItem value="leased">Leased</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Enter any additional notes"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? 'Creating...' : 'Create Property'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
