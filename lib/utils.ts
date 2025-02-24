import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "@/lib/prisma"
import { authSession } from "@/lib/auth"

import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getSubCommunity() {
  const session = await authSession();

  if (!session?.user?.email) {
    console.error("❌ No session found, returning empty data.");
    return [];
  }

  const data = await prisma.subcommunity.findMany({
    where: {
      User: {
        email: session.user.email,
      },
    },
    select: {
      id: true,
      name: true,
      User: {
        select: {
          email: true,
        },
      },
    },
  });

  return data;
}

export async function getUserData(subcommunityId?: string) {
  
  const session = await authSession()

  if (!session?.user.email) {
    return { session: null, user: null, isMember: false, role: "member" };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }, 
    select: {
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
      createdSubcommunities: {
        select: {
          id: true
        }
      },
      SubcommunityMember: {
        where: { subcommunityId },
        select: { role: true },
      },
    }
  })

  if (user && session.user) {
    session.user.id = user.id;
  }

  const getCommunity = await getSubCommunity()

  const isCreator = getCommunity.some((item) => item.id === subcommunityId);

  const isMember = isCreator || (user && user?.SubcommunityMember.length > 0);

  let role = "member";
  if (isCreator) {
    role = "admin";
  } else if (user && user?.SubcommunityMember.length > 0) {
    role = user?.SubcommunityMember[0]?.role;
  }

  return {
    session,
    user,
    isMember, 
    role,
  };
}

export const separator = (index: number, array: any, separatorType: string = ', ', separatorEnd: string = ".") => index === array.length - 1 ? separatorEnd : separatorType

export function tiptapJsonToHtml(content: string | object | null): string {
  try {
      let json;

      if (!content) {
          console.error("No content provided");
          return "<p>Invalid content</p>";
      }

      if (typeof content === "string") {
          json = JSON.parse(content);
      } else {
          json = content;
      }

      if (!json || typeof json !== "object" || !json.type) {
          console.error("Invalid JSON structure:", json);
          return "<p>Invalid content</p>";
      }

      return generateHTML(json, [
          StarterKit,
          Link.configure({ openOnClick: true }),
      ]);
  } catch (error) {
      console.error("Error parsing Tiptap JSON:", error);
      return "<p>Invalid content</p>";
  }
}