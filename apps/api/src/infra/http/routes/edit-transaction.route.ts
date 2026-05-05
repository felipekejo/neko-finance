import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeEditTransactionUseCase } from '@/infra/factories/transaction.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const paramsSchema = z.object({
  transactionId: z.string().uuid(),
})

const bodySchema = z.object({
  accountId: z.string().uuid(),
  description: z.string().optional(),
  amount: z.number().positive().optional(),
  type: z.enum(['INCOMES', 'EXPENSES']).optional(),
  date: z.coerce.date().optional(),
  categoryId: z.string().uuid().optional(),
})

export async function editTransactionRoute(app: FastifyTypedInstance) {
  app.put('/transactions/:transactionId', {
    schema: {
      description: 'Edit a transaction',
      tags: ['Transactions'],
      params: paramsSchema,
      body: bodySchema,
      response: {
        204: { description: 'Transaction updated successfully' },
        400: { description: 'Bad Request' },
        403: { description: 'Forbidden' },
        404: { description: 'Transaction not found' },
      },
    },
  }, async (request, reply) => {
    const { transactionId } = request.params
    const { accountId, description, amount, type, date, categoryId } = request.body
    const ownerId = request.user.sub

    const result = await makeEditTransactionUseCase().execute({
      transactionId,
      ownerId,
      accountId,
      description,
      amount,
      type,
      date,
      categoryId,
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
