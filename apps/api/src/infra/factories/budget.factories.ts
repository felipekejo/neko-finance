import { AssignBudgetUseCase } from '@/domain/use-cases/assign-budget'
import { CreateBudgetUseCase } from '@/domain/use-cases/create-budget'
import { DeleteBudgetUseCase } from '@/domain/use-cases/delete-budget'
import { GetBudgetByIdUseCase } from '@/domain/use-cases/get-budget-by-id'
import { PrismaBudgetsRepository } from '@/infra/database/prisma/repositories/prisma-budgets-repository'
import { PrismaUserBudgetRepository } from '@/infra/database/prisma/repositories/prisma-user-budget-repository'
import { prisma } from '@/lib/prisma'

function budgetsRepository() {
  return new PrismaBudgetsRepository(prisma)
}

function userBudgetRepository() {
  return new PrismaUserBudgetRepository(prisma)
}

export function makeCreateBudgetUseCase() {
  return new CreateBudgetUseCase(budgetsRepository())
}

export function makeAssignBudgetUseCase() {
  return new AssignBudgetUseCase(budgetsRepository(), userBudgetRepository())
}

export function makeDeleteBudgetUseCase() {
  return new DeleteBudgetUseCase(budgetsRepository(), userBudgetRepository())
}

export function makeGetBudgetByIdUseCase() {
  return new GetBudgetByIdUseCase(budgetsRepository(), userBudgetRepository())
}
