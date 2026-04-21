import { ResourceNotFoundError } from '@/domain/use-cases/errors/resource-not-found-error'
import { makeEditCategoryUseCase } from '@/infra/factories/category.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const paramsSchema = z.object({
  categoryId: z.string(),
})

const bodySchema = z.object({
  budgetId: z.string().uuid(),
  name: z.string(),
  type: z.enum(['INCOMES', 'EXPENSES']),
})

export async function editCategoryRoute(app: FastifyTypedInstance) {
  app.put('/categories/:categoryId', {
    schema: {
      description: 'Edit a category',
      tags: ['Categories'],
      params: paramsSchema,
      body: bodySchema,
      response: {
        204: { description: 'Category updated successfully' },
        400: { description: 'Bad Request' },
        404: { description: 'Category not found' },
      },
    },
  }, async (request, reply) => {
    const { categoryId } = request.params
    const { budgetId, name, type } = request.body

    const result = await makeEditCategoryUseCase().execute({ categoryId, budgetId, name, type })

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ error: error.message })
      }
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(204).send()
  })
}
