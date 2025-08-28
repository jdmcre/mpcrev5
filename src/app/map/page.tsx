'use client'

import { useState, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Ensure Mapbox CSS is loaded
if (typeof window !== 'undefined') {
  console.log('Mapbox CSS loaded, mapboxgl version:', mapboxgl.version)
}
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
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
import { Globe } from 'lucide-react'

// Set your Mapbox access token here
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [lng, setLng] = useState(-100.5284) // Default longitude for US center
  const [lat, setLat] = useState(35.014)   // Default latitude for US center
  const [zoom, setZoom] = useState(1.46)   // Default zoom to show full globe
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
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
    console.log('Map center:', [lng, lat], 'Zoom:', zoom)

    try {
      map.current = new mapboxgl.Map({
        container: container,
        style: 'mapbox://styles/mapbox/streets-v12', // Standard street style
        center: [lng, lat],
        zoom: zoom,
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

      map.current.on('move', () => {
        if (map.current) {
          setLng(parseFloat(map.current.getCenter().lng.toFixed(4)))
          setLat(parseFloat(map.current.getCenter().lat.toFixed(4)))
          setZoom(parseFloat(map.current.getZoom().toFixed(2)))
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
  }, []) // Remove dependencies to prevent re-initialization

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
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
                  <BreadcrumbPage>Map</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-col flex-1 min-h-0 p-4 pt-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Interactive Map</h1>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Explore properties, markets, and geographic data on an interactive map
          </p>
          <div className="flex-1 min-h-0 rounded-lg overflow-hidden border bg-gray-50">
            <div ref={mapContainer} className="w-full h-full" />
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
