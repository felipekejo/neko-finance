import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
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
        403: { description: 'Forbidden' },
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
      if (error instanceof UnauthorizedError) {
        return reply.status(403).send({ error: 'Forbidden' })
      }
      return reply.status(404).send({ error: 'Not Found' })
    }

    return reply.status(204).send()
  })
}
