import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "@/lib/prisma"
import { authSession } from "@/lib/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getUserData(subcommunityId?: string) {
  
  const session = await authSession()


  if (!session?.user.email) {
    return { session: null, user: null, isMember: false };
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
      createdAt: true,
      SubcommunityMember: subcommunityId
        ? { where: { subcommunityId } }
        : false,
    }
  })

  const isMember = !!user?.SubcommunityMember?.length; 

  const memberCount = subcommunityId
  ? await prisma.subcommunityMember.count({
      where: { subcommunityId },
    })
  : 0;

  return { session, user, isMember, memberCount }
}


export const separator = (index: number, array: any, separatorType = ', ', separatorEnd = ".") => index === array.length - 1 ? separatorEnd : separatorType