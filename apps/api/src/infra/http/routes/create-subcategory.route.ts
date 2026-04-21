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
        400: { description: 'Bad Request' },
      },
    },
  }, async (request, reply) => {
    const { categoryId, name } = request.body

    const result = await makeCreateSubcategoryUseCase().execute({ categoryId, name })

    if (result.isLeft()) {
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(201).send(SubcategoryPresenter.toHTTP(result.value.subcategory))
  })
}
