import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "@/lib/prisma"
import { authSession } from "@/lib/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getUserData() {
  const session = await authSession()
  if (!session?.user.email) {
    return { session: null, use: null }
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }, select: {
      id: true,
      name: true,
      userName: true,
      email: true,
      isAdmin: true,
      institution: true,
      department: true,
      disciplines: true,
      fields: true,
      interests: true,
      about: true,
      createdAt: true
    }
  })

  return { session, user }
}
