import { Either, left, right } from '@/core/either'
import { BudgetsRepository } from '../repositories/budget-repository'
import { CategoriesRepository } from '../repositories/category-repository'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface DeleteCategoryUseCaseRequest {
  categoryId: string
  userId: string
  budgetId: string
}

type DeleteCategoryUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {}
>

export class DeleteCategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private budgetsRepository: BudgetsRepository,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({
    categoryId,
    userId,
    budgetId,
  }: DeleteCategoryUseCaseRequest): Promise<DeleteCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }
    const budget = await this.budgetsRepository.findById(budgetId)

    if (!budget) {
      return left(new ResourceNotFoundError())
    }

    const userBudget = await this.userBudgetRepository.findByUserIdAndBudgetId(
      userId,
      budgetId,
    )

    if (!userBudget) {
      return left(new UnauthorizedError())
    }

    await this.categoriesRepository.delete(category)
    return right({})
  }
}
