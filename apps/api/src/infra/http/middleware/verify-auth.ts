import { auth } from '@/utils/auth'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyAuth(request: FastifyRequest, reply: FastifyReply) {
  const session = await auth.api.getSession({
    headers: request.headers as any,
  })

  if (!session) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }

  request.user = {
    sub: session.user.id,
    email: session.user.email,
    name: session.user.name,
  }
}
