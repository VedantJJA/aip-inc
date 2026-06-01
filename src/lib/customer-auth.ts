import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const {
  handlers: customerHandlers,
  signIn: customerSignIn,
  signOut: customerSignOut,
  auth: customerAuth,
} = NextAuth({
  providers: [
    Credentials({
      name: "customer-credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const customer = await prisma.customer.findUnique({
          where: { email: credentials.email as string },
        });

        if (!customer) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          customer.passwordHash
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          role: "CUSTOMER",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: "customer-session-token",
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "CUSTOMER";
        token.customerId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.customerId as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
