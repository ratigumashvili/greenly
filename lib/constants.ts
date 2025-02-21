import { Plus, Home, Handshake, Users, Tags, Search, Settings } from "lucide-react"

export const COMMUNITIES_DISPLAY_LIMIT = 9

export const menuItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Explore Communities",
      url: "/g",
      icon: Handshake,
    },
    {
      title: "Create Community",
      url: "/g/create",
      icon: Plus,
    },
    {
        title: "Users",
        url: "/users",
        icon: Users
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      title: "Tags",
      url: "/tags",
      icon: Tags,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ]

  export const menuSmall = [
    {
        title: "Create Community",
        url: "/g/create",
        icon: Plus,
      },
      {
        title: "Search",
        url: "/search",
        icon: Search,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
  ]