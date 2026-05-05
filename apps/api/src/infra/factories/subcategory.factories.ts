import { CreateSubcategoryUseCase } from '@/domain/use-cases/create-subcategory'
import { DeleteSubcategoryUseCase } from '@/domain/use-cases/delete-subcategory'
import { EditSubcategoryUseCase } from '@/domain/use-cases/edit-subcategory'
import { FetchSubcategoriesUseCase } from '@/domain/use-cases/fetch-subcategories'
import { GetSubcategoryByIdUseCase } from '@/domain/use-cases/get-subcategory-by-id'
import { SubcategoryService } from '@/domain/service/subcategory.service'
import { PrismaCategoryRepository } from '@/infra/database/prisma/repositories/prisma-category-repository'
import { PrismaSubcategoriesRepository } from '@/infra/database/prisma/repositories/prisma-subcategory-repository'
import { PrismaUserBudgetRepository } from '@/infra/database/prisma/repositories/prisma-user-budget-repository'
import { prisma } from '@/lib/prisma'

function subcategoriesRepository() {
  return new PrismaSubcategoriesRepository(prisma)
}

function categoriesRepository() {
  return new PrismaCategoryRepository(prisma)
}

function userBudgetRepository() {
  return new PrismaUserBudgetRepository(prisma)
}

export function makeCreateSubcategoryUseCase() {
  return new CreateSubcategoryUseCase(
    new SubcategoryService(subcategoriesRepository()),
    categoriesRepository(),
    userBudgetRepository(),
  )
}

export function makeDeleteSubcategoryUseCase() {
  return new DeleteSubcategoryUseCase(subcategoriesRepository(), categoriesRepository(), userBudgetRepository())
}

export function makeEditSubcategoryUseCase() {
  return new EditSubcategoryUseCase(subcategoriesRepository(), categoriesRepository(), userBudgetRepository())
}

export function makeFetchSubcategoriesUseCase() {
  return new FetchSubcategoriesUseCase(subcategoriesRepository(), categoriesRepository(), userBudgetRepository())
}

export function makeGetSubcategoryByIdUseCase() {
  return new GetSubcategoryByIdUseCase(subcategoriesRepository(), categoriesRepository(), userBudgetRepository())
}
