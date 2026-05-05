import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeGetTransactionsSummaryUseCase } from '@/infra/factories/transaction.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const querySchema = z.object({
  budgetId: z.string().uuid(),
  accountId: z.string().uuid().optional(),
  type: z.enum(['INCOMES', 'EXPENSES']).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().optional(),
})

export async function getTransactionsSummaryRoute(app: FastifyTypedInstance) {
  app.get('/transactions/summary', {
    schema: {
      description: 'Get transactions summary grouped by category',
      tags: ['Transactions'],
      querystring: querySchema,
      response: {
        200: { description: 'Summary returned successfully' },
        403: { description: 'Forbidden' },
        400: { description: 'Bad Request' },
      },
    },
  }, async (request, reply) => {
    const { budgetId, accountId, type, month, year } = request.query
    const userId = request.user.sub

    const result = await makeGetTransactionsSummaryUseCase().execute({
      budgetId,
      userId,
      accountId,
      type,
      month,
      year,
    })

    if (result.isLeft()) {
      if (result.value instanceof UnauthorizedError) {
        return reply.status(403).send({ error: 'Forbidden' })
      }
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(200).send(result.value.summary)
  })
}
