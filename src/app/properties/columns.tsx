"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Property } from "@/lib/supabase"

export const columns: ColumnDef<Property>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium max-w-[150px] truncate" title={row.getValue("title") || 'Untitled Property'}>
          {row.getValue("title") || 'Untitled Property'}
        </div>
      )
    },
  },
  {
    accessorKey: "address_line",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("address_line") as string
      const city = row.original.city
      const state = row.original.state
      const postalCode = row.original.postal_code
      
      if (!address && !city && !state) {
        return <div className="text-sm text-muted-foreground">No address</div>
      }
      
      const fullAddress = [address, city, state, postalCode].filter(Boolean).join(', ')
      return (
        <div className="text-sm max-w-[200px] truncate" title={fullAddress}>
          {fullAddress}
        </div>
      )
    },
  },
  {
    accessorKey: "size_sqft",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size (sq ft)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const size = row.getValue("size_sqft") as number
      if (!size) return <div className="text-sm text-muted-foreground">N/A</div>
      
      return (
        <div className="text-sm">
          {size.toLocaleString()}
        </div>
      )
    },
  },
  {
    accessorKey: "base_rent_psf",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Base Rent ($/sq ft)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const rent = row.getValue("base_rent_psf") as number
      if (!rent) return <div className="text-sm text-muted-foreground">N/A</div>
      
      return (
        <div className="text-sm">
          ${rent.toFixed(2)}
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return (
        <div className="text-sm">
          {date.toLocaleDateString()}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const property = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(property.id)}
            >
              Copy property ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = `/properties/${property.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = `/properties/${property.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit property
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => {
              if (confirm('Are you sure you want to delete this property?')) {
                // Handle delete
              }
            }}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete property
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
