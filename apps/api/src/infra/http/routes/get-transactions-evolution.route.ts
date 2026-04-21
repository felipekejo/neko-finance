import { makeGetTransactionsEvolutionUseCase } from '@/infra/factories/transaction.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const querySchema = z.object({
  budgetId: z.string().uuid(),
  year: z.coerce.number().int(),
  accountId: z.string().uuid().optional(),
})

export async function getTransactionsEvolutionRoute(app: FastifyTypedInstance) {
  app.get('/transactions/evolution', {
    schema: {
      description: 'Get monthly income/expense evolution for a given year',
      tags: ['Transactions'],
      querystring: querySchema,
      response: {
        200: { description: 'Evolution returned successfully' },
        400: { description: 'Bad Request' },
      },
    },
  }, async (request, reply) => {
    const { budgetId, year, accountId } = request.query

    const result = await makeGetTransactionsEvolutionUseCase().execute({ budgetId, year, accountId })

    if (result.isLeft()) {
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(200).send(result.value.evolution)
  })
}
