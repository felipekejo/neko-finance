import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeFetchTransactionsUseCase } from '@/infra/factories/transaction.factories'
import { TransactionPresenter } from '@/infra/http/presenters/transaction-presenter'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const querySchema = z.object({
  budgetId: z.string().uuid().optional(),
  accountId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  subcategoryId: z.string().uuid().optional(),
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
        403: { description: 'Forbidden' },
        404: { description: 'No transactions found' },
      },
    },
  }, async (request, reply) => {
    const { budgetId, accountId, categoryId, subcategoryId, type, month, year, page, perPage } = request.query
    const userId = request.user.sub

    const result = await makeFetchTransactionsUseCase().execute({
      userId,
      filters: { budgetId, accountId, categoryId, subcategoryId, type, month, year },
      pagination: { page, perPage },
    })

    if (result.isLeft()) {
      if (result.value instanceof UnauthorizedError) {
        return reply.status(403).send({ error: 'Forbidden' })
      }
      return reply.status(404).send({ error: 'Not Found' })
    }

    const { transactions, total } = result.value
    const totalPages = Math.ceil(total / perPage)

    return reply.status(200).send({
      data: transactions.map(TransactionPresenter.toHTTP),
      total,
      page,
      perPage,
      totalPages,
    })
  })
}
