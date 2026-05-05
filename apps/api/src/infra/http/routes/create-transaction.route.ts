import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeCreateTransactionUseCase } from '@/infra/factories/transaction.factories'
import { TransactionPresenter } from '@/infra/http/presenters/transaction-presenter'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const bodySchema = z.object({
  budgetId: z.string().uuid(),
  accountId: z.string().uuid(),
  categoryId: z.string().uuid(),
  description: z.string(),
  amount: z.number().positive(),
  type: z.enum(['INCOMES', 'EXPENSES']),
  date: z.coerce.date(),
})

export async function createTransactionRoute(app: FastifyTypedInstance) {
  app.post('/transactions', {
    schema: {
      description: 'Create a new transaction',
      tags: ['Transactions'],
      body: bodySchema,
      response: {
        201: { description: 'Transaction created successfully' },
        403: { description: 'Forbidden' },
        400: { description: 'Bad Request' },
      },
    },
  }, async (request, reply) => {
    const { budgetId, accountId, categoryId, description, amount, type, date } = request.body
    const userId = request.user.sub

    const result = await makeCreateTransactionUseCase().execute({
      userId,
      budgetId,
      accountId,
      categoryId,
      description,
      amount,
      type,
      date,
    })

    if (result.isLeft()) {
      if (result.value instanceof UnauthorizedError) {
        return reply.status(403).send({ error: 'Forbidden' })
      }
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(201).send(TransactionPresenter.toHTTP(result.value.transaction))
  })
}
