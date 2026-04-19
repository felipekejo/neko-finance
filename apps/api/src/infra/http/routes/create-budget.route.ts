import { makeAssignBudgetUseCase, makeCreateBudgetUseCase } from '@/infra/factories/budget.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const bodySchema = z.object({
  name: z.string(),
})

export async function createBudgetRoute(app: FastifyTypedInstance) {
  app.post('/budgets', {
    schema: {
      description: 'Create a new budget',
      tags: ['Budgets'],
      body: bodySchema,
      response: {
        201: { description: 'Budget created successfully' },
        400: { description: 'Bad Request' },
      },
    },
  }, async (request, reply) => {
    const { name } = request.body
    const userId = request.user.sub

    const budget = await makeCreateBudgetUseCase().execute({ name })
    if (budget.isLeft()) {
      return reply.status(400).send({ error: 'Bad Request' })
    }

    const assign = await makeAssignBudgetUseCase().execute({
      budgetId: budget.value.budget.id.toString(),
      userId,
    })
    if (assign.isLeft()) {
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(201).send()
  })
}
