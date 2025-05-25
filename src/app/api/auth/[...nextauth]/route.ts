import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import users from '@/data/users.json'

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
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
