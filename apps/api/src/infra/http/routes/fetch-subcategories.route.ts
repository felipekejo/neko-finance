import { makeFetchSubcategoriesUseCase } from '@/infra/factories/subcategory.factories'
import { SubcategoryPresenter } from '@/infra/http/presenters/subcategory-presenter'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const querySchema = z.object({
  categoryId: z.string().uuid(),
})

export async function fetchSubcategoriesRoute(app: FastifyTypedInstance) {
  app.get('/subcategories', {
    schema: {
      description: 'Fetch subcategories by category',
      tags: ['Subcategories'],
      querystring: querySchema,
      response: {
        200: { description: 'Subcategories fetched successfully' },
        404: { description: 'No subcategories found' },
      },
    },
  }, async (request, reply) => {
    const { categoryId } = request.query

    const result = await makeFetchSubcategoriesUseCase().execute({ categoryId })

    if (result.isLeft()) {
      return reply.status(404).send({ error: 'Not Found' })
    }

    return reply.status(200).send(result.value.subcategories.map(SubcategoryPresenter.toHTTP))
  })
}
