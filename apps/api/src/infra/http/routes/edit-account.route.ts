import { ResourceNotFoundError } from '@/domain/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeEditAccountUseCase } from '@/infra/factories/account.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const paramsSchema = z.object({
  accountId: z.string(),
})

const bodySchema = z.object({
  name: z.string(),
  balance: z.number(),
})

export async function editAccountRoute(app: FastifyTypedInstance) {
  app.put('/accounts/:accountId', {
    schema: {
      description: 'Edit an account',
      tags: ['Accounts'],
      params: paramsSchema,
      body: bodySchema,
      response: {
        204: { description: 'Account updated successfully' },
        400: { description: 'Bad Request' },
        403: { description: 'Forbidden' },
        404: { description: 'Account not found' },
      },
    },
  }, async (request, reply) => {
    const { accountId } = request.params
    const { name, balance } = request.body
    const ownerId = request.user.sub

    const result = await makeEditAccountUseCase().execute({ accountId, ownerId, name, balance })

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ error: error.message })
      }
      if (error instanceof UnauthorizedError) {
        return reply.status(403).send({ error: error.message })
      }
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(204).send()
  })
}
