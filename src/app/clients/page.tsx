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
import { Client } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Building2, Mail, Phone, Globe, MapPin, Eye, Edit, Trash2, MapPinIcon } from 'lucide-react'
import { ViewToggle } from '@/components/view-toggle'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { DeleteConfirmationModal } from '@/components/ui/delete-confirmation-modal'

interface ClientWithDetails extends Client {
  marketCount: number
  propertyCount: number
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<ClientWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    clientId: string
    clientName: string
  }>({
    isOpen: false,
    clientId: '',
    clientName: ''
  })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsWithDetails = await DataService.getClientsWithDetails()
        setClients(clientsWithDetails)
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const openDeleteModal = (clientId: string, clientName: string) => {
    setDeleteModal({
      isOpen: true,
      clientId,
      clientName
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      clientId: '',
      clientName: ''
    })
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', deleteModal.clientId)
      
      if (error) throw error
      
      // Refresh the clients list
      const updatedClients = clients.filter(c => c.id !== deleteModal.clientId)
      setClients(updatedClients)
      closeDeleteModal()
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Failed to delete client')
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
            <div className="text-lg">Loading clients...</div>
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
                  <BreadcrumbPage>Clients</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4 flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <Button onClick={() => router.push('/clients/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <CardTitle>All Clients</CardTitle>
              <CardDescription>
                {clients.length} clients in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {view === 'cards' ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {clients.map((client) => (
                      <Card key={client.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{client.name}</CardTitle>
                            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                              {client.status}
                            </Badge>
                          </div>
                          <CardDescription>{client.client_type}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {client.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{client.email}</span>
                            </div>
                          )}
                          
                          {client.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                          
                          {client.website && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Globe className="h-4 w-4" />
                              <span>{client.website}</span>
                            </div>
                          )}
                          
                          {client.address && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{client.address}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{client.marketCount} markets</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              <span>{client.propertyCount} properties</span>
                            </div>
                          </div>
                          
                          {client.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {client.description}
                            </p>
                          )}
                          
                          <div className="pt-2 flex justify-end gap-2">
                            <Button 
                              variant="subtle" 
                              size="icon"
                              onClick={() => router.push(`/clients/${client.id}`)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="subtle" 
                              size="icon"
                              onClick={() => router.push(`/clients/${client.id}/edit`)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="subtle" 
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={() => openDeleteModal(client.id, client.name)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {clients.length === 0 && (
                    <div className="text-center py-12">
                      <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No clients found</h3>
                      <p className="mt-2 text-muted-foreground">
                        Get started by adding your first client.
                      </p>
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Client
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <DataTable 
                  columns={columns} 
                  data={clients} 
                  searchKey="name"
                  searchPlaceholder="Filter clients by name..."
                />
              )}
            </CardContent>
          </Card>
        </div>

        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Delete Client"
          description="Are you sure you want to delete this client? This action cannot be undone and will also remove all associated markets and properties."
          itemName={deleteModal.clientName}
          isLoading={isDeleting}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
