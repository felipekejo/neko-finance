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
        404: { description: 'No categories found' },
      },
    },
  }, async (request, reply) => {
    const { budgetId, type } = request.query

    const result = await makeFetchCategoriesUseCase().execute({ budgetId, type })

    if (result.isLeft()) {
      return reply.status(404).send({ error: 'Not Found' })
    }

    return reply.status(200).send(result.value.categories.map(CategoryPresenter.toHTTP))
  })
}
