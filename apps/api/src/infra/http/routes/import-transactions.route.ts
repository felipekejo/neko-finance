import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeImportTransactionsUseCase } from '@/infra/factories/transaction.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const querySchema = z.object({
  budgetId: z.string().uuid(),
})

const ALLOWED_MIMETYPES = ['text/csv', 'application/csv', 'application/vnd.ms-excel']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

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
        403: { description: 'Forbidden' },
        413: { description: 'File too large' },
      },
    },
  }, async (request, reply) => {
    const { budgetId } = request.query
    const ownerId = request.user.sub

    const file = await request.file()
    if (!file) {
      return reply.status(400).send({ error: 'CSV file is required' })
    }

    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      return reply.status(400).send({ error: 'File must be a CSV' })
    }

    const chunks: Buffer[] = []
    let totalSize = 0

    for await (const chunk of file.file) {
      totalSize += chunk.length
      if (totalSize > MAX_FILE_SIZE) {
        return reply.status(413).send({ error: 'File too large (max 10 MB)' })
      }
      chunks.push(chunk)
    }

    const csvBuffer = Buffer.concat(chunks)

    const result = await makeImportTransactionsUseCase().execute({ budgetId, ownerId, csvBuffer })

    if (!result.isRight()) {
      if (result.value instanceof UnauthorizedError) {
        return reply.status(403).send({ error: 'Forbidden' })
      }
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(200).send({ imported: result.value.imported })
  })
}
