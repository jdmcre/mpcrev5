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
import { Client } from '@/lib/supabase'



export default function EditMarketPage() {
  const router = useRouter()
  const params = useParams()
  const marketId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    territory: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch market data
        const { data: market, error: marketError } = await supabase
          .from('markets')
          .select('*')
          .eq('id', marketId)
          .single()

        if (marketError) throw marketError

        // Fetch clients for dropdown
        const clientsData = await DataService.getClients()
        setClients(clientsData)

        // Pre-populate form
        setFormData({
          name: market.name || '',
          client_id: market.client_id || 'none',
          territory: market.territory ? JSON.stringify(market.territory, null, 2) : ''
        })
      } catch (error) {
        console.error('Error fetching market:', error)
        alert('Failed to load market data')
        router.push('/markets')
      } finally {
        setLoading(false)
      }
    }

    if (marketId) {
      fetchData()
    }
  }, [marketId, router])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const { error } = await supabase
        .from('markets')
        .update({
          name: formData.name,
          client_id: formData.client_id === 'none' ? null : formData.client_id,
          territory: formData.territory ? JSON.parse(formData.territory) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', marketId)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      router.push('/markets')
    } catch (error) {
      console.error('Error updating market:', error)
      alert('Failed to update market. Please check the console for details.')
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
            <div className="text-lg">Loading market...</div>
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
                  <BreadcrumbLink href="/markets">Markets</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Market</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Edit Market</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Market Information</CardTitle>
              <CardDescription>
                Update the market details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Market Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Enter market name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client_id">Client</Label>
                    <Select
                      value={formData.client_id}
                      onValueChange={(value) => handleChange('client_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Client</SelectItem>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="territory">Territory (JSON)</Label>
                  <Textarea
                    id="territory"
                    value={formData.territory}
                    onChange={(e) => handleChange('territory', e.target.value)}
                    placeholder="Enter territory data in JSON format"
                    rows={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter territory information in valid JSON format (e.g., &#123;&quot;state&quot;: &quot;Texas&quot;, &quot;cities&quot;: [&quot;Houston&quot;, &quot;Dallas&quot;]&#125;)
                  </p>
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
                    {saving ? 'Updating...' : 'Update Market'}
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
