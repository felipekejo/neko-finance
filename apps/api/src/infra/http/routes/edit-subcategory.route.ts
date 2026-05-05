import { ResourceNotFoundError } from '@/domain/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeEditSubcategoryUseCase } from '@/infra/factories/subcategory.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const paramsSchema = z.object({
  subcategoryId: z.string(),
})

const bodySchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string(),
})

export async function editSubcategoryRoute(app: FastifyTypedInstance) {
  app.put('/subcategories/:subcategoryId', {
    schema: {
      description: 'Edit a subcategory',
      tags: ['Subcategories'],
      params: paramsSchema,
      body: bodySchema,
      response: {
        204: { description: 'Subcategory updated successfully' },
        400: { description: 'Bad Request' },
        403: { description: 'Forbidden' },
        404: { description: 'Subcategory not found' },
      },
    },
  }, async (request, reply) => {
    const { subcategoryId } = request.params
    const { categoryId, name } = request.body
    const userId = request.user.sub

    const result = await makeEditSubcategoryUseCase().execute({ subcategoryId, categoryId, userId, name })

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof UnauthorizedError) {
        return reply.status(403).send({ error: 'Forbidden' })
      }
      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ error: error.message })
      }
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(204).send()
  })
}
