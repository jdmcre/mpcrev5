import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

interface Market {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  client_id: string | null
}

interface Client {
  id: string
  name: string
}

interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
}

async function getMarket(id: string): Promise<Market | null> {
  const { data, error } = await supabase
    .from('markets')
    .select('*')
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

async function getMarketProperties(marketId: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('id, name, address, city, state')
    .eq('market_id', marketId)

  if (error || !data) {
    return []
  }

  return data
}

export default async function MarketPage({ params }: { params: { id: string } }) {
  const market = await getMarket(params.id)

  if (!market) {
    notFound()
  }

  const client = market.client_id ? await getClient(market.client_id) : null
  const properties = await getMarketProperties(market.id)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
                  <BreadcrumbPage>{market.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{market.name}</h1>
              <p className="text-muted-foreground">Market Details</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {market.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm">{market.description}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{formatDate(market.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">{formatDate(market.updated_at)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relationships</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <label className="text-sm font-medium text-muted-foreground">Properties</label>
                  <p className="text-sm">{properties.length} properties</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {properties.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Properties in this Market</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {properties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <a 
                          href={`/properties/${property.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {property.name}
                        </a>
                        <p className="text-sm text-muted-foreground">
                          {property.address}, {property.city}, {property.state}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
