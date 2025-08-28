'use client'

import { useEffect, useState } from 'react'
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
import { DataService } from '@/lib/data-service'
import { Market, Client } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, MapPin, Building2, Eye, Edit, Trash2, Users } from 'lucide-react'
import { ViewToggle } from '@/components/view-toggle'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { DeleteConfirmationModal } from '@/components/ui/delete-confirmation-modal'

interface MarketWithDetails extends Market {
  client?: Client
  propertyCount: number
}

export default function MarketsPage() {
  const router = useRouter()
  const [markets, setMarkets] = useState<MarketWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    marketId: string
    marketName: string
  }>({
    isOpen: false,
    marketId: '',
    marketName: ''
  })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const marketsWithDetails = await DataService.getMarketsWithDetails()
        setMarkets(marketsWithDetails)
      } catch (error) {
        console.error('Error fetching markets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMarkets()
  }, [])

  const openDeleteModal = (marketId: string, marketName: string) => {
    setDeleteModal({
      isOpen: true,
      marketId,
      marketName
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      marketId: '',
      marketName: ''
    })
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('markets')
        .delete()
        .eq('id', deleteModal.marketId)
      
      if (error) throw error
      
      // Refresh the markets list
      const updatedMarkets = markets.filter(m => m.id !== deleteModal.marketId)
      setMarkets(updatedMarkets)
      closeDeleteModal()
    } catch (error) {
      console.error('Error deleting market:', error)
      alert('Failed to delete market')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg">Loading markets...</div>
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
                  <BreadcrumbPage>Markets</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4 flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <Button onClick={() => router.push('/markets/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Market
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <CardTitle>All Markets</CardTitle>
              <CardDescription>
                {markets.length} markets in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {view === 'cards' ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {markets.map((market) => (
                      <Card key={market.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{market.name}</CardTitle>
                            <Badge variant="outline">
                              {market.client?.name || 'Unknown Client'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            <span>{market.client?.client_type || 'Unknown Type'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{market.propertyCount} properties</span>
                          </div>
                          
                          {market.territory && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>Territory defined</span>
                            </div>
                          )}
                          
                          <div className="pt-2 flex justify-end gap-2">
                            <Button 
                              variant="subtle" 
                              size="icon"
                              onClick={() => router.push(`/markets/${market.id}`)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="subtle" 
                              size="icon"
                              onClick={() => router.push(`/markets/${market.id}/edit`)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="subtle" 
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={() => openDeleteModal(market.id, market.name)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {markets.length === 0 && (
                    <div className="text-center py-12">
                      <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No markets found</h3>
                      <p className="mt-2 text-muted-foreground">
                        Get started by adding your first market.
                      </p>
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Market
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <DataTable 
                  columns={columns} 
                  data={markets} 
                  searchKey="name"
                  searchPlaceholder="Filter markets by name..."
                />
              )}
            </CardContent>
          </Card>
        </div>

        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Delete Market"
          description="Are you sure you want to delete this market? This action cannot be undone and will also remove all associated properties."
          itemName={deleteModal.marketName}
          isLoading={isDeleting}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
