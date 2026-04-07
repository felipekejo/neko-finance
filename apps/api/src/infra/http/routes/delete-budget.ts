import { DeleteBudgetUseCase } from '@/domain/use-cases/delete-budget'
import { ResourceNotFoundError } from '@/domain/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/domain/use-cases/errors/unauthorized-error'
import { PrismaBudgetsRepository } from '@/infra/database/prisma/repositories/prisma-budgets-repository'
import { PrismaUserBudgetRepository } from '@/infra/database/prisma/repositories/prisma-user-budget-repository'
import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'

export async function deleteBudgetRoute(app: FastifyInstance) {
  app.delete<{ Params: { budgetId: string } }>('/budgets/:budgetId', async (request, reply) => {
    const budgetsRepository = new PrismaBudgetsRepository(prisma)
    const userBudgetsRepository = new PrismaUserBudgetRepository(prisma)
    const deleteBudget = new DeleteBudgetUseCase(budgetsRepository, userBudgetsRepository)

    const { budgetId } = request.params
    const user = request.user as { sub: string }
    const userId = user.sub

    const result = await deleteBudget.execute({ budgetId, userId })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ error: error.message })
      }

      if (error instanceof UnauthorizedError) {
        return reply.status(403).send({ error: error.message })
      }

      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(204).send()
  })
}
