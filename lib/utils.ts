import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google, Credentials],
})
