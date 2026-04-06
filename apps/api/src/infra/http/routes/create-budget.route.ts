import { BudgetsRepository } from '@/domain/repositories/budget-repository'
import { CreateBudgetUseCase } from '@/domain/use-cases/create-budget'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

const createBudgetBodySchema = z.object({
  name: z.string(),
})

type CreateBudgetBodySchema = z.infer<typeof createBudgetBodySchema>

export async function createBudgetRoute(
  app: FastifyInstance,

) {
  app.post<{ Body: CreateBudgetBodySchema }>(
    '/budgets',
    async (request, reply) => {
      const budgetsRepository = new BudgetsRepository()
      const createBudget = new CreateBudgetUseCase(budgetsRepository)
      const parseResult = createBudgetBodySchema.safeParse(request.body)
      if (!parseResult.success) {
        return reply.status(400).send({ error: 'Validation error', issues: parseResult.error.issues })
      }

      const { name } = parseResult.data
      const user = request.user as { sub: string }
      const userId = user.sub

      const budget = await createBudget.execute({ name })

      if (budget.isLeft()) {
        return reply.status(400).send({ error: 'Bad Request' })
      }

      await assignBudget.execute({
        budgetId: budget.value?.budget.id.toString(),
        userId,
      })

      return reply.status(201).send()
    },
  )
}