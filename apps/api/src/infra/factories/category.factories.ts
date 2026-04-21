import { CreateCategoryUseCase } from '@/domain/use-cases/create-category'
import { DeleteCategoryUseCase } from '@/domain/use-cases/delete-category'
import { EditCategoryUseCase } from '@/domain/use-cases/edit-category'
import { FetchCategoriesUseCase } from '@/domain/use-cases/fetch-categories'
import { GetCategoryByIdUseCase } from '@/domain/use-cases/get-category-by-id'
import { CategoryService } from '@/domain/service/category.service'
import { PrismaBudgetsRepository } from '@/infra/database/prisma/repositories/prisma-budgets-repository'
import { PrismaCategoryRepository } from '@/infra/database/prisma/repositories/prisma-category-repository'
import { PrismaUserBudgetRepository } from '@/infra/database/prisma/repositories/prisma-user-budget-repository'
import { prisma } from '@/lib/prisma'

function categoriesRepository() {
  return new PrismaCategoryRepository(prisma)
}

export function makeCreateCategoryUseCase() {
  return new CreateCategoryUseCase(new CategoryService(categoriesRepository()))
}

export function makeDeleteCategoryUseCase() {
  return new DeleteCategoryUseCase(
    categoriesRepository(),
    new PrismaBudgetsRepository(prisma),
    new PrismaUserBudgetRepository(prisma),
  )
}

export function makeEditCategoryUseCase() {
  return new EditCategoryUseCase(categoriesRepository(), new PrismaBudgetsRepository(prisma))
}

export function makeFetchCategoriesUseCase() {
  return new FetchCategoriesUseCase(categoriesRepository())
}

export function makeGetCategoryByIdUseCase() {
  return new GetCategoryByIdUseCase(categoriesRepository())
}
