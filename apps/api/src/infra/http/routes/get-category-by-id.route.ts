import { ResourceNotFoundError } from '@/domain/use-cases/errors/resource-not-found-error'
import { makeGetCategoryByIdUseCase } from '@/infra/factories/category.factories'
import { CategoryPresenter } from '@/infra/http/presenters/category-presenter'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const paramsSchema = z.object({
  categoryId: z.string(),
})

const querySchema = z.object({
  budgetId: z.string().uuid(),
})

export async function getCategoryByIdRoute(app: FastifyTypedInstance) {
  app.get('/categories/:categoryId', {
    schema: {
      description: 'Get a category by id',
      tags: ['Categories'],
      params: paramsSchema,
      querystring: querySchema,
      response: {
        200: { description: 'Category found' },
        400: { description: 'Bad Request' },
        404: { description: 'Category not found' },
      },
    },
  }, async (request, reply) => {
    const { categoryId } = request.params
    const { budgetId } = request.query

    const result = await makeGetCategoryByIdUseCase().execute({ categoryId, budgetId })

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ error: error.message })
      }
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(200).send(CategoryPresenter.toHTTP(result.value.category))
  })
}
