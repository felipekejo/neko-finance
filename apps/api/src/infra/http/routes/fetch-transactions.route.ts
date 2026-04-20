import { makeFetchTransactionsUseCase } from '@/infra/factories/transaction.factories'
import { TransactionPresenter } from '@/infra/http/presenters/transaction-presenter'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const querySchema = z.object({
  budgetId: z.string().uuid().optional(),
  accountId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  type: z.enum(['INCOMES', 'EXPENSES']).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().optional(),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().default(20),
})

export async function fetchTransactionsRoute(app: FastifyTypedInstance) {
  app.get('/transactions', {
    schema: {
      description: 'Fetch transactions with optional filters',
      tags: ['Transactions'],
      querystring: querySchema,
      response: {
        200: { description: 'Transactions fetched successfully' },
        404: { description: 'No transactions found' },
      },
    },
  }, async (request, reply) => {
    const { budgetId, accountId, categoryId, type, month, year, page, perPage } = request.query

    const result = await makeFetchTransactionsUseCase().execute({
      filters: { budgetId, accountId, categoryId, type, month, year },
      pagination: { page, perPage },
    })

    if (result.isLeft()) {
      return reply.status(404).send({ error: 'Not Found' })
    }

    return reply.status(200).send(result.value.transactions.map(TransactionPresenter.toHTTP))
  })
}
