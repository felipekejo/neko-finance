import { ResourceNotFoundError } from '@/domain/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeDeleteCategoryUseCase } from '@/infra/factories/category.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const paramsSchema = z.object({
  categoryId: z.string(),
})

const querySchema = z.object({
  budgetId: z.string().uuid(),
})

export async function deleteCategoryRoute(app: FastifyTypedInstance) {
  app.delete('/categories/:categoryId', {
    schema: {
      description: 'Delete a category',
      tags: ['Categories'],
      params: paramsSchema,
      querystring: querySchema,
      response: {
        204: { description: 'Category deleted successfully' },
        400: { description: 'Bad Request' },
        403: { description: 'Forbidden' },
        404: { description: 'Category not found' },
      },
    },
  }, async (request, reply) => {
    const { categoryId } = request.params
    const { budgetId } = request.query
    const userId = request.user.sub

    const result = await makeDeleteCategoryUseCase().execute({ categoryId, userId, budgetId })

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ error: error.message })
      }
      if (error instanceof UnauthorizedError) {
        return reply.status(403).send({ error: error.message })
      }
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(204).send()
  })
}
