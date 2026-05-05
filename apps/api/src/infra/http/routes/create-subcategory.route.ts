import { ResourceNotFoundError } from '@/domain/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeCreateSubcategoryUseCase } from '@/infra/factories/subcategory.factories'
import { SubcategoryPresenter } from '@/infra/http/presenters/subcategory-presenter'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const bodySchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string(),
})

export async function createSubcategoryRoute(app: FastifyTypedInstance) {
  app.post('/subcategories', {
    schema: {
      description: 'Create a new subcategory',
      tags: ['Subcategories'],
      body: bodySchema,
      response: {
        201: { description: 'Subcategory created successfully' },
        403: { description: 'Forbidden' },
        404: { description: 'Category not found' },
        400: { description: 'Bad Request' },
      },
    },
  }, async (request, reply) => {
    const { categoryId, name } = request.body
    const userId = request.user.sub

    const result = await makeCreateSubcategoryUseCase().execute({ categoryId, userId, name })

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

    return reply.status(201).send(SubcategoryPresenter.toHTTP(result.value.subcategory))
  })
}
