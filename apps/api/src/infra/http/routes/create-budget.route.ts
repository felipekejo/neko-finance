import { AssignBudgetUseCase } from '@/domain/use-cases/assign-budget'
import { CreateBudgetUseCase } from '@/domain/use-cases/create-budget'
import { PrismaBudgetsRepository } from '@/infra/database/prisma/repositories/prisma-budgets-repository'
import { PrismaUserBudgetRepository } from '@/infra/database/prisma/repositories/prisma-user-budget-repository'
import { prisma } from '@/lib/prisma'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const createBudgetBodySchema = z.object({
  name: z.string(),
})

type CreateBudgetBodySchema = z.infer<typeof createBudgetBodySchema>

export async function createBudgetRoute(app: FastifyTypedInstance) {
  app.post<{ Body: CreateBudgetBodySchema }>('/budgets', {
    schema: {
      description: 'Create a new budget',
      body: createBudgetBodySchema,
      tags: ['Budgets'],
      response: {
        201: {
          description: 'Budget created successfully',
        },

      }
    }
  }, async (request, reply) => {
    const budgetsRepository = new PrismaBudgetsRepository(prisma)
    const userBudgetsRepository = new PrismaUserBudgetRepository(prisma)
    const createBudget = new CreateBudgetUseCase(budgetsRepository)
    const assignBudget = new AssignBudgetUseCase(budgetsRepository, userBudgetsRepository)

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

    const assign = await assignBudget.execute({
      budgetId: budget.value.budget.id.toString(),
      userId,
    })

    if (assign.isLeft()) {
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(201).send()
  })
}
