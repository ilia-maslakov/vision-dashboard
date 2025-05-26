import fs from 'fs'
import path from 'path'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

function loadUsers(): { username: string; passwordHash: string }[] {
  const filePath = process.env.USERS_FILE_PATH || path.resolve(process.cwd(), 'secret/users.json')

  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('[auth] Failed to load users.json:', err)
    return []
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const users = loadUsers()

        const user = users.find(u => u.username === credentials?.username)
        if (user && await bcrypt.compare(credentials.password, user.passwordHash)) {
          return { id: user.username, name: user.username }
        }

        return null
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }
