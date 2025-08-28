'use client'

import { useEffect, useState, useRef } from 'react'
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
import { Property } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, UserCheck, Globe } from 'lucide-react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Ensure Mapbox CSS is loaded
if (typeof window !== 'undefined') {
  console.log('Mapbox CSS loaded, mapboxgl version:', mapboxgl.version)
}

// Set your Mapbox access token here
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

interface DashboardStats {
  totalClients: number
  totalMarkets: number
  totalProperties: number
  totalUsers: number
  recentProperties: Property[]
}

export default function Page() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardStats = await DataService.getDashboardStats()
        setStats(dashboardStats)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Wait for stats to load and DOM to be ready
    if (loading || !mapContainer.current) {
      return
    }

    // Prevent multiple initializations
    if (map.current) {
      console.log('Map already exists, skipping initialization')
      return
    }

    console.log('Mapbox access token:', mapboxgl.accessToken)
    console.log('Token length:', mapboxgl.accessToken?.length)

    if (!mapboxgl.accessToken) {
      console.error('Mapbox access token is not set. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env file.')
      return
    }

    if (mapboxgl.accessToken === 'YOUR_MAPBOX_ACCESS_TOKEN_HERE') {
      console.error('Please replace the placeholder token with your actual Mapbox access token')
      return
    }

    const container = mapContainer.current
    if (!container) {
      console.error('Map container not found')
      return
    }

    console.log('Initializing map with container:', container)
    console.log('Container dimensions:', container.offsetWidth, 'x', container.offsetHeight)

    try {
      map.current = new mapboxgl.Map({
        container: container,
        style: 'mapbox://styles/mapbox/streets-v12', // Standard street style
        center: [-98.5795, 39.8283], // Center of US
        zoom: 3.5, // Zoomed in on US
        preserveDrawingBuffer: true, // Prevent map from disappearing
        antialias: true, // Improve rendering quality
      })

      console.log('Map initialized successfully')
      
      // Add event listeners
      map.current.on('load', () => {
        console.log('Map loaded successfully')
        setMapLoaded(true)
        if (map.current) {
          map.current.resize()
        }
      })

      map.current.on('error', (e) => {
        console.error('Map error:', e)
      })

      // Handle map resizing when the container changes size (e.g., sidebar collapse/expand)
      const resizeObserver = new ResizeObserver(() => {
        if (map.current && map.current.isStyleLoaded()) {
          console.log('Resizing map due to container change')
          map.current.resize()
        }
      })

      resizeObserver.observe(container)

      // Store the resize observer for cleanup
      const cleanup = () => {
        if (map.current) {
          console.log('Cleaning up map')
          map.current.remove()
          map.current = null
        }
        resizeObserver.unobserve(container)
        resizeObserver.disconnect()
      }

      // Cleanup function
      return cleanup
    } catch (error) {
      console.error('Error initializing map:', error)
      return
    }
  }, [loading]) // Add loading dependency to ensure DOM is ready

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg">Loading dashboard...</div>
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Stats Cards */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Markets</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalMarkets || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalProperties || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Mapbox Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Geographic Overview
              </CardTitle>
              <CardDescription>Interactive map showing your markets and properties across the United States</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex-1 min-h-0 rounded-lg overflow-hidden border bg-gray-50">
                <div ref={mapContainer} className="w-full h-96" />
                {(!mapboxgl.accessToken || mapboxgl.accessToken === 'YOUR_MAPBOX_ACCESS_TOKEN_HERE') && !mapLoaded ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center p-6">
                      <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Map Not Available</h3>
                      <p className="text-gray-600 mb-4">
                        {!mapboxgl.accessToken 
                          ? 'Mapbox access token is not configured.'
                          : 'Please set your Mapbox access token in .env.local'
                        }
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
                        <p className="font-medium">Setup Required:</p>
                        <p>1. Get your token from <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="underline">Mapbox</a></p>
                        <p>2. Add to .env.local: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here</p>
                        <p>3. Restart the development server</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
