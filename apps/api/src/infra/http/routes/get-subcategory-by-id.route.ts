import { ResourceNotFoundError } from '@/domain/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { makeGetSubcategoryByIdUseCase } from '@/infra/factories/subcategory.factories'
import { SubcategoryPresenter } from '@/infra/http/presenters/subcategory-presenter'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const paramsSchema = z.object({
  subcategoryId: z.string(),
})

export async function getSubcategoryByIdRoute(app: FastifyTypedInstance) {
  app.get('/subcategories/:subcategoryId', {
    schema: {
      description: 'Get a subcategory by id',
      tags: ['Subcategories'],
      params: paramsSchema,
      response: {
        200: { description: 'Subcategory found' },
        400: { description: 'Bad Request' },
        403: { description: 'Forbidden' },
        404: { description: 'Subcategory not found' },
      },
    },
  }, async (request, reply) => {
    const { subcategoryId } = request.params
    const userId = request.user.sub

    const result = await makeGetSubcategoryByIdUseCase().execute({ subcategoryId, userId })

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

    return reply.status(200).send(SubcategoryPresenter.toHTTP(result.value.subcategory))
  })
}
