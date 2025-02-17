import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import type { Adapter } from "@auth/core/adapters"

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        if (
          !credentials?.email ||
          typeof credentials.email !== "string" ||
          !credentials?.password ||
          typeof credentials.password !== "string"
          ) {
          throw new Error("Invalid credentials")
          }
      
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
      
        if (!user || !user.password) {
          console.error("User not found or password missing")
          return null
        }
      
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          console.error("Invalid password")
          return null
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
      

    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : "/"
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=true",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions)