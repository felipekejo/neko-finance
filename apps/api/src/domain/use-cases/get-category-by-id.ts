import { Either, left, right } from '@/core/either'
import { Category } from '../entities/category'
import { CategoriesRepository } from '../repositories/category-repository'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface GetCategoryByIdUseCaseRequest {
  categoryId: string
  budgetId: string
  userId: string
}

type GetCategoryByIdUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    category: Category
  }
>

export class GetCategoryByIdUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({
    categoryId,
    budgetId,
    userId,
  }: GetCategoryByIdUseCaseRequest): Promise<GetCategoryByIdUseCaseResponse> {
    const userBudget = await this.userBudgetRepository.findByUserIdAndBudgetId(userId, budgetId)
    if (!userBudget) {
      return left(new UnauthorizedError())
    }

    const category = await this.categoriesRepository.findById(categoryId)
    if (!category) {
      return left(new ResourceNotFoundError())
    }
    if (category.budgetId.toString() !== budgetId) {
      return left(new ResourceNotFoundError())
    }

    return right({ category })
  }
}
