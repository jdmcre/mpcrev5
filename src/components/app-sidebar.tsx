"use client"

import type * as React from "react"
import { Building2, Users, MapPin, UserCheck, GalleryVerticalEnd, Globe, MessageSquare } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Dakota",
    email: "dakota@automatecre.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Merida Partners",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "School of Rock",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Southern Veterinary Partners",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Properties",
      url: "/properties",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: "All Properties",
          url: "/properties",
        },
        {
          title: "Add Property",
          url: "/properties/new",
        },
      ],
    },
    {
      title: "Markets",
      url: "/markets",
      icon: MapPin,
      isActive: true,
      items: [
        {
          title: "All Markets",
          url: "/markets",
        },
        {
          title: "Add Market",
          url: "/markets/new",
        },
      ],
    },
    {
      title: "Clients",
      url: "/clients",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "All Clients",
          url: "/clients",
        },
        {
          title: "Add Client",
          url: "/clients/new",
        },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: UserCheck,
      isActive: true,
      items: [
        {
          title: "All Users",
          url: "/users",
        },
        {
          title: "Add User",
          url: "/users/new",
        },
      ],
    },
    {
      title: "Map",
      url: "/map",
      icon: Globe,
      isActive: true,
      items: [
        {
          title: "Interactive Map",
          url: "/map",
        },
      ],
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageSquare,
      isActive: true,
      items: [
        {
          title: "All Chat",
          url: "/chat",
        },
        {
          title: "Weekly Updates",
          url: "/chat/weekly-updates",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
