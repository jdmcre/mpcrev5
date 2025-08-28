import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { supabase } from '@/lib/supabase'

interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  size_sqft: number
  base_rent_psf: number
  expenses_psf: number
  phase: string
  notes: string
  created_at: string
  updated_at: string
  market_id: string | null
  client_id: string | null
}

interface Market {
  id: string
  name: string
}

interface Client {
  id: string
  name: string
}

async function getProperty(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

async function getMarket(id: string): Promise<Market | null> {
  const { data, error } = await supabase
    .from('markets')
    .select('id, name')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

async function getClient(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('id, name')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id)

  if (!property) {
    notFound()
  }

  const market = property.market_id ? await getMarket(property.market_id) : null
  const client = property.client_id ? await getClient(property.client_id) : null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'site_selection': return 'Site Selection'
      case 'under_contract': return 'Under Contract'
      case 'due_diligence': return 'Due Diligence'
      case 'closing': return 'Closing'
      case 'closed': return 'Closed'
      case 'owned': return 'Owned'
      case 'leased': return 'Leased'
      case 'sold': return 'Sold'
      default: return phase
    }
  }

  const getPhaseVariant = (phase: string) => {
    switch (phase) {
      case 'site_selection': return 'outline'
      case 'under_contract': return 'secondary'
      case 'due_diligence': return 'default'
      case 'closing': return 'default'
      case 'closed': return 'secondary'
      case 'owned': return 'default'
      case 'leased': return 'outline'
      case 'sold': return 'secondary'
      default: return 'default'
    }
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
                  <BreadcrumbPage>{property.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{property.name}</h1>
              <p className="text-muted-foreground">Property Details</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant={getPhaseVariant(property.phase)}>
                {getPhaseLabel(property.phase)}
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p className="text-sm">
                    {property.address}<br />
                    {property.city}, {property.state} {property.postal_code}<br />
                    {property.country}
                  </p>
                </div>
                {property.size_sqft && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Size</label>
                    <p className="text-sm">{property.size_sqft.toLocaleString()} sq ft</p>
                  </div>
                )}
                {property.base_rent_psf && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Base Rent</label>
                    <p className="text-sm">{formatCurrency(property.base_rent_psf)} per sq ft</p>
                  </div>
                )}
                {property.expenses_psf && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Expenses</label>
                    <p className="text-sm">{formatCurrency(property.expenses_psf)} per sq ft</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relationships</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {market && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Market</label>
                    <p className="text-sm">
                      <a 
                        href={`/markets/${market.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {market.name}
                      </a>
                    </p>
                  </div>
                )}
                {client && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Client</label>
                    <p className="text-sm">
                      <a 
                        href={`/clients/${client.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {client.name}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{formatDate(property.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">{formatDate(property.updated_at)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {property.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{property.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
