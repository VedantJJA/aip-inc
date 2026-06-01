import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Check AdminUser first
        const admin = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (admin) {
          const match = await bcrypt.compare(password, admin.passwordHash);
          if (!match) return null;
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role, // "ADMIN" | "SUPER_ADMIN"
          };
        }

        // Then check Customer
        const customer = await prisma.customer.findUnique({
          where: { email },
        });

        if (customer) {
          const match = await bcrypt.compare(password, customer.passwordHash);
          if (!match) return null;
          return {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            role: "CUSTOMER",
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
