import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import argon2 from "argon2";
import { redis } from "./redis";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }
  
  interface User {
    id: string
    email: string
    name?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await verifyPassword(user.passwordHash, credentials.password)

        if (!isPasswordValid) {
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
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
} 

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64MB
    timeCost: 3,
    parallelism: 1,
  });
}

export async function verifyPassword(hash: string, raw: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, raw);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

export async function throttleLogin(email: string, ip: string): Promise<void> {
  const key = `login:${email}:${ip}`;
  const r = redis();
  
  if (!r) {
    // Skip throttling if Redis is not available
    return;
  }
  
  try {
    const attempts = Number((await r.incr(key)) ?? 0);
    if (attempts === 1) await r.expire(key, 900); // 15 min window
    if (attempts > 5) {
      throw new Error("Too many login attempts. Try again later.");
    }
  } catch (error) {
    // If Redis is down, allow the request but log it
    console.warn('Rate limiting unavailable, allowing login attempt:', error);
  }
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" };
  }
  
  if (!/\d/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  
  return { valid: true };
}

export function generateSecureToken(): string {
  return crypto.randomUUID();
} 