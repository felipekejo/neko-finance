import { ResourceNotFoundError } from '@/domain/use-cases/errors/resource-not-found-error'
import { makeAssignBudgetUseCase } from '@/infra/factories/budget.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const paramsSchema = z.object({
  budgetId: z.string(),
})

export async function assignBudgetRoute(app: FastifyTypedInstance) {
  app.post('/budgets/:budgetId/members', {
    schema: {
      description: 'Assign the current user to a budget',
      tags: ['Budgets'],
      params: paramsSchema,
      response: {
        204: { description: 'User assigned to budget successfully' },
        400: { description: 'Bad Request' },
        404: { description: 'Budget not found' },
      },
    },
  }, async (request, reply) => {
    const { budgetId } = request.params
    const userId = request.user.sub

    const result = await makeAssignBudgetUseCase().execute({ budgetId, userId })

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
