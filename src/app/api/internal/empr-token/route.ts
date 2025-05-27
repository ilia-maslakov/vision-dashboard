import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const token = process.env.EMPR_TOKEN
  if (!token) {
    return new Response('EMPR_TOKEN not set', { status: 500 })
  }

  return Response.json({ token })
}
