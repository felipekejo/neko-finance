import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeGetTransactionByIdUseCase } from '@/infra/factories/transaction.factories'
import { TransactionPresenter } from '@/infra/http/presenters/transaction-presenter'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const paramsSchema = z.object({
  transactionId: z.string().uuid(),
})

export async function getTransactionByIdRoute(app: FastifyTypedInstance) {
  app.get('/transactions/:transactionId', {
    schema: {
      description: 'Get a transaction by ID',
      tags: ['Transactions'],
      params: paramsSchema,
      response: {
        200: { description: 'Transaction found' },
        403: { description: 'Forbidden' },
        404: { description: 'Transaction not found' },
      },
    },
  }, async (request, reply) => {
    const { transactionId } = request.params
    const userId = request.user.sub

    const result = await makeGetTransactionByIdUseCase().execute({ id: transactionId, userId })

    if (result.isLeft()) {
      if (result.value instanceof UnauthorizedError) {
        return reply.status(403).send({ error: 'Forbidden' })
      }
      return reply.status(404).send({ error: 'Not Found' })
    }

    return reply.status(200).send(TransactionPresenter.toHTTP(result.value.transaction))
  })
}
