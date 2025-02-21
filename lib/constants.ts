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

  export const summaryOfRules = [
    {
      title: "Stay On-Topic",
      description: "Make sure your post aligns with the community’s purpose and ongoing discussions."
    },
    {
      title: "Use Clear & Descriptive Titles",
      description: "A good title grabs attention and helps others understand your post quickly."
    },
    {
      title: "Provide Value",
      description: "Share useful information, insights, or questions that encourage meaningful discussion."
    },
    {
      title: "Avoid Spam & Self-Promotion",
      description: "Only share links if they are relevant and genuinely beneficial to the community."
    },
    {
      title: "Respect Others",
      description: "Keep discussions civil and avoid offensive, hateful, or discriminatory language."
    },
    {
      title: "Use Proper Formatting",
      description: "Break up long text with paragraphs, bullet points, or headings for better readability."
    },
    {
      title: "Cite Sources When Needed",
      description: "If sharing data, studies, or quotes, give proper credit to the original source."
    },
    {
      title: "Avoid Clickbait & Misleading Info",
      description: "Be honest and transparent about your content."
    },
    {
      title: "Engage with Responses",
      description: "If people comment on your post, reply and keep the conversation going."
    },
    {
      title: "No Duplicate Posts",
      description: "Before posting, check if a similar discussion already exists."
    }
  ]