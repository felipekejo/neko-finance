import { makeImportTransactionsUseCase } from '@/infra/factories/transaction.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const querySchema = z.object({
  budgetId: z.string().uuid(),
})

export async function importTransactionsRoute(app: FastifyTypedInstance) {
  app.post('/transactions/import', {
    schema: {
      description: 'Import transactions from a CSV file',
      tags: ['Transactions'],
      querystring: querySchema,
      consumes: ['multipart/form-data'],
      response: {
        200: { description: 'Transactions imported successfully' },
        400: { description: 'Bad Request' },
      },
    },
  }, async (request, reply) => {
    const { budgetId } = request.query
    const ownerId = request.user.sub

    const file = await request.file()
    if (!file) {
      return reply.status(400).send({ error: 'CSV file is required' })
    }

    const chunks: Buffer[] = []
    for await (const chunk of file.file) {
      chunks.push(chunk)
    }
    const csvBuffer = Buffer.concat(chunks)

    const result = await makeImportTransactionsUseCase().execute({ budgetId, ownerId, csvBuffer })

    if (!result.isRight()) {
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(200).send({ imported: result.value.imported })
  })
}
