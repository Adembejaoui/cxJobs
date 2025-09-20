import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "exemple@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null
        }

        try {
          const existUser = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!existUser) {
            return null
          }

          const passwordMatch = await compare(credentials.password, existUser.passwordHash)
          if (!passwordMatch) {
            return null
          }

          console.log("[v0] User authenticated, onboardingCompleted:", existUser.onboardingCompleted)

          // Return user object matching the extended User type
          return {
            id: existUser.id.toString(),
            email: existUser.email,
            name: existUser.name,
            role: existUser.role,
            onboardingCompleted: existUser.onboardingCompleted,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { onboardingCompleted: true, role: true, name: true },
          })

          if (dbUser) {
            token.onboardingCompleted = dbUser.onboardingCompleted
            token.role = dbUser.role
            token.name = dbUser.name
            console.log("[v0] JWT callback - refreshed onboardingCompleted:", dbUser.onboardingCompleted)
          }
        } catch (error) {
          console.error("Error fetching user data in JWT callback:", error)
        }
      }

      // Initial sign in
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email!
        token.role = user.role
        token.onboardingCompleted = user.onboardingCompleted
      }

      // Handle updates via session update
      if (trigger === "update" && session?.role) {
        token.role = session.role
      }

      if (trigger === "update" && session?.onboardingCompleted !== undefined) {
        token.onboardingCompleted = session.onboardingCompleted
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email!
        session.user.role = token.role
        session.user.onboardingCompleted = token.onboardingCompleted
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      // Ensure we have the latest role from the database
      if (user.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id.toString() },
            select: { role: true, onboardingCompleted: true }, // Added onboardingCompleted to select
          })

          if (dbUser && user.role !== dbUser.role) {
            user.role = dbUser.role
          }

          if (dbUser && user.onboardingCompleted !== dbUser.onboardingCompleted) {
            user.onboardingCompleted = dbUser.onboardingCompleted
          }
        } catch (error) {
          console.error("Error fetching user role or onboarding status:", error)
        }
      }
    },
  },
}
