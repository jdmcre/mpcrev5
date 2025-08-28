"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Market, Client } from "@/lib/supabase"

interface MarketWithDetails extends Market {
  client?: Client
  propertyCount: number
}

export const columns: ColumnDef<MarketWithDetails>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("name")}
        </div>
      )
    },
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const client = row.original.client
      return (
        <div className="text-sm">
          {client?.name || 'Unknown Client'}
        </div>
      )
    },
  },
  {
    accessorKey: "propertyCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Users className="mr-2 h-4 w-4" />
          Properties
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium">
          {row.original.propertyCount}
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
    accessorKey: "updated_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("updated_at"))
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
      const market = row.original

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
              onClick={() => navigator.clipboard.writeText(market.id)}
            >
              Copy market ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = `/markets/${market.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = `/markets/${market.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit market
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => {
              if (confirm('Are you sure you want to delete this market?')) {
                // Handle delete
              }
            }}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete market
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
