import { ResourceNotFoundError } from '@/domain/use-cases/errors/resource-not-found-error'
import { makeGetBudgetByIdUseCase } from '@/infra/factories/budget.factories'
import { BudgetPresenter } from '@/infra/http/presenters/budget-presenter'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const paramsSchema = z.object({
  budgetId: z.string(),
})

export async function getBudgetByIdRoute(app: FastifyTypedInstance) {
  app.get('/budgets/:budgetId', {
    schema: {
      description: 'Get a budget by ID',
      tags: ['Budgets'],
      params: paramsSchema,
      response: {
        200: { description: 'Budget found' },
        400: { description: 'Bad Request' },
        404: { description: 'Budget not found' },
      },
    },
  }, async (request, reply) => {
    const { budgetId } = request.params

    const result = await makeGetBudgetByIdUseCase().execute({ budgetId })

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ error: error.message })
      }
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(200).send({ budget: BudgetPresenter.toHTTP(result.value.budget) })
  })
}
