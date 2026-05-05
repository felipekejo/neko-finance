import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeFetchCategoriesUseCase } from '@/infra/factories/category.factories'
import { CategoryPresenter } from '@/infra/http/presenters/category-presenter'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const querySchema = z.object({
  budgetId: z.string().uuid(),
  type: z.enum(['INCOMES', 'EXPENSES']).optional(),
})

export async function fetchCategoriesRoute(app: FastifyTypedInstance) {
  app.get('/categories', {
    schema: {
      description: 'Fetch categories by budget',
      tags: ['Categories'],
      querystring: querySchema,
      response: {
        200: { description: 'Categories fetched successfully' },
        403: { description: 'Forbidden' },
        404: { description: 'No categories found' },
      },
    },
  }, async (request, reply) => {
    const { budgetId, type } = request.query
    const userId = request.user.sub

    const result = await makeFetchCategoriesUseCase().execute({ budgetId, userId, type })

    if (result.isLeft()) {
      if (result.value instanceof UnauthorizedError) {
        return reply.status(403).send({ error: 'Forbidden' })
      }
      return reply.status(404).send({ error: 'Not Found' })
    }

    return reply.status(200).send(result.value.categories.map(CategoryPresenter.toHTTP))
  })
}
