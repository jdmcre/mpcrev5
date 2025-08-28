'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { supabase } from '@/lib/supabase'
import { DataService } from '@/lib/data-service'
import { Market } from '@/lib/supabase'



export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    const fetchData = async () => {
      try {
        // Fetch property data
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single()

        if (propertyError) throw propertyError

        // Fetch markets for dropdown
        const marketsData = await DataService.getMarkets()
        setMarkets(marketsData)

        // Pre-populate form
        setFormData({
          title: property.title || '',
          address_line: property.address_line || '',
          city: property.city || '',
          state: property.state || '',
          postal_code: property.postal_code || '',
          size_sqft: property.size_sqft?.toString() || '',
          base_rent_psf: property.base_rent_psf?.toString() || '',
          expenses_psf: property.expenses_psf?.toString() || '',
          phase: property.phase || 'site_selection',
          notes: property.notes || '',
          market_id: property.market_id || 'none'
        })
      } catch (error) {
        console.error('Error fetching property:', error)
        alert('Failed to load property data')
        router.push('/properties')
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchData()
    }
  }, [propertyId, router])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: formData.title,
          address_line: formData.address_line,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          size_sqft: formData.size_sqft ? parseFloat(formData.size_sqft) : null,
          base_rent_psf: formData.base_rent_psf ? parseFloat(formData.base_rent_psf) : null,
          expenses_psf: formData.expenses_psf ? parseFloat(formData.expenses_psf) : null,
          phase: formData.phase,
          notes: formData.notes,
          market_id: formData.market_id === 'none' ? null : formData.market_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      router.push('/properties')
    } catch (error) {
      console.error('Error updating property:', error)
      alert('Failed to update property. Please check the console for details.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg">Loading property...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
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
                  <BreadcrumbPage>Edit Property</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Edit Property</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
              <CardDescription>
                Update the property details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Enter property title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_line">Address Line *</Label>
                    <Input
                      id="address_line"
                      value={formData.address_line}
                      onChange={(e) => handleChange('address_line', e.target.value)}
                      placeholder="Enter address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      placeholder="Enter state"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code *</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => handleChange('postal_code', e.target.value)}
                      placeholder="Enter postal code"
                      required
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
                    <Label htmlFor="phase">Phase *</Label>
                    <Select
                      value={formData.phase}
                      onValueChange={(value) => handleChange('phase', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select phase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="site_selection">Site Selection</SelectItem>
                        <SelectItem value="under_contract">Under Contract</SelectItem>
                        <SelectItem value="due_diligence">Due Diligence</SelectItem>
                        <SelectItem value="closing">Closing</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="market_id">Market</Label>
                    <Select
                      value={formData.market_id}
                      onValueChange={(value) => handleChange('market_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select market" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Market</SelectItem>
                        {markets.map((market) => (
                          <SelectItem key={market.id} value={market.id}>
                            {market.name}
                          </SelectItem>
                        ))}
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
                    placeholder="Enter additional notes"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Updating...' : 'Update Property'}
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
