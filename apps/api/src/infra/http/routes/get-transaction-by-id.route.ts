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
        404: { description: 'Transaction not found' },
      },
    },
  }, async (request, reply) => {
    const { transactionId } = request.params

    const result = await makeGetTransactionByIdUseCase().execute({ id: transactionId })

    if (result.isLeft()) {
      return reply.status(404).send({ error: 'Not Found' })
    }

    return reply.status(200).send(TransactionPresenter.toHTTP(result.value.transaction))
  })
}
