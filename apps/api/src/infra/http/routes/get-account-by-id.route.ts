import { ResourceNotFoundError } from '@/domain/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeGetAccountByIdUseCase } from '@/infra/factories/account.factories'
import { AccountPresenter } from '@/infra/http/presenters/account-presenter'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const paramsSchema = z.object({
  accountId: z.string(),
})

export async function getAccountByIdRoute(app: FastifyTypedInstance) {
  app.get('/accounts/:accountId', {
    schema: {
      description: 'Get an account by ID',
      tags: ['Accounts'],
      params: paramsSchema,
      response: {
        200: { description: 'Account found' },
        400: { description: 'Bad Request' },
        403: { description: 'Forbidden' },
        404: { description: 'Account not found' },
      },
    },
  }, async (request, reply) => {
    const { accountId } = request.params
    const userId = request.user.sub

    const result = await makeGetAccountByIdUseCase().execute({ id: accountId, userId })

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof UnauthorizedError) {
        return reply.status(403).send({ error: 'Forbidden' })
      }
      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ error: error.message })
      }
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(200).send({ account: AccountPresenter.toHTTP(result.value.account) })
  })
}
