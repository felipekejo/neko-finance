import { ResourceNotFoundError } from '@/domain/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeDeleteAccountUseCase } from '@/infra/factories/account.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const paramsSchema = z.object({
  accountId: z.string(),
})

export async function deleteAccountRoute(app: FastifyTypedInstance) {
  app.delete('/accounts/:accountId', {
    schema: {
      description: 'Delete an account',
      tags: ['Accounts'],
      params: paramsSchema,
      response: {
        204: { description: 'Account deleted successfully' },
        400: { description: 'Bad Request' },
        403: { description: 'Forbidden' },
        404: { description: 'Account not found' },
      },
    },
  }, async (request, reply) => {
    const { accountId } = request.params
    const ownerId = request.user.sub

    const result = await makeDeleteAccountUseCase().execute({ accountId, ownerId })

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
