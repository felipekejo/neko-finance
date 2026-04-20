import { makeDeleteTransactionUseCase } from '@/infra/factories/transaction.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const paramsSchema = z.object({
  transactionId: z.string().uuid(),
})

const bodySchema = z.object({
  budgetId: z.string().uuid(),
})

export async function deleteTransactionRoute(app: FastifyTypedInstance) {
  app.delete('/transactions/:transactionId', {
    schema: {
      description: 'Delete a transaction',
      tags: ['Transactions'],
      params: paramsSchema,
      body: bodySchema,
      response: {
        204: { description: 'Transaction deleted successfully' },
        401: { description: 'Unauthorized' },
        404: { description: 'Transaction not found' },
      },
    },
  }, async (request, reply) => {
    const { transactionId } = request.params
    const { budgetId } = request.body
    const userId = request.user.sub

    const result = await makeDeleteTransactionUseCase().execute({
      transactionId,
      budgetId,
      userId,
    })

    if (result.isLeft()) {
      const error = result.value
      if (error.constructor.name === 'UnauthorizedError') {
        return reply.status(401).send({ error: 'Unauthorized' })
      }
      return reply.status(404).send({ error: 'Not Found' })
    }

    return reply.status(204).send()
  })
}
