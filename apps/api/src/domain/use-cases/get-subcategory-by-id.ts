import { Either, left, right } from '@/core/either'
import { Subcategory } from '../entities/subcategory'
import { CategoriesRepository } from '../repositories/category-repository'
import { SubcategoriesRepository } from '../repositories/subcategory-repository'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface GetSubcategoryByIdUseCaseRequest {
  subcategoryId: string
  userId: string
}

type GetSubcategoryByIdUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    subcategory: Subcategory
  }
>

export class GetSubcategoryByIdUseCase {
  constructor(
    private subcategoriesRepository: SubcategoriesRepository,
    private categoriesRepository: CategoriesRepository,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({
    subcategoryId,
    userId,
  }: GetSubcategoryByIdUseCaseRequest): Promise<GetSubcategoryByIdUseCaseResponse> {
    const subcategory = await this.subcategoriesRepository.findById(subcategoryId)
    if (!subcategory) {
      return left(new ResourceNotFoundError())
    }

    const category = await this.categoriesRepository.findById(subcategory.categoryId.toString())
    if (!category) {
      return left(new ResourceNotFoundError())
    }

    const userBudget = await this.userBudgetRepository.findByUserIdAndBudgetId(
      userId,
      category.budgetId.toString(),
    )
    if (!userBudget) {
      return left(new UnauthorizedError())
    }

    return right({ subcategory })
  }
}
