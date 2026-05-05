import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeCreateCategoryUseCase } from '@/infra/factories/category.factories'
import { CategoryPresenter } from '@/infra/http/presenters/category-presenter'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const bodySchema = z.object({
  budgetId: z.string().uuid(),
  name: z.string(),
  type: z.enum(['INCOMES', 'EXPENSES']),
})

export async function createCategoryRoute(app: FastifyTypedInstance) {
  app.post('/categories', {
    schema: {
      description: 'Create a new category',
      tags: ['Categories'],
      body: bodySchema,
      response: {
        201: { description: 'Category created successfully' },
        403: { description: 'Forbidden' },
        400: { description: 'Bad Request' },
      },
    },
  }, async (request, reply) => {
    const { budgetId, name, type } = request.body
    const userId = request.user.sub

    const result = await makeCreateCategoryUseCase().execute({ budgetId, userId, name, type })

    if (result.isLeft()) {
      if (result.value instanceof UnauthorizedError) {
        return reply.status(403).send({ error: 'Forbidden' })
      }
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(201).send(CategoryPresenter.toHTTP(result.value.category))
  })
}
