import path from 'path'
import fs from 'fs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AuthOptions } from 'next-auth'
import { authorize } from './authorize'

export function loadUsers(): { username: string; passwordHash: string }[] {
  try {
    const filePath = process.env.USERS_FILE_PATH || path.resolve(process.cwd(), 'secret/users.json')
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('[auth] Failed to load users.json:', err)
    return []
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize,
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) session.user.name = token.sub
      return session
    },
  },
}
