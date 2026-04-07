import { GetBudgetByIdUseCase } from '@/domain/use-cases/get-budget-by-id'
import { PrismaBudgetsRepository } from '@/infra/database/prisma/repositories/prisma-budgets-repository'
import { BudgetPresenter } from '@/infra/http/presenters/budget-presenter'
import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'

export async function getBudgetByIdRoute(app: FastifyInstance) {
  app.get<{ Params: { budgetId: string } }>('/budgets/:budgetId', async (request, reply) => {
    const budgetsRepository = new PrismaBudgetsRepository(prisma)
    const getBudgetById = new GetBudgetByIdUseCase(budgetsRepository)

    const { budgetId } = request.params

    const result = await getBudgetById.execute({ budgetId })

    if (result.isLeft()) {
      return reply.status(404).send({ error: 'Budget not found' })
    }

    return reply.status(200).send({ budget: BudgetPresenter.toHTTP(result.value.budget) })
  })
}