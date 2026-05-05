import { Either, left, right } from '@/core/either'
import { TypeTransaction } from '../entities/category'
import { BudgetsRepository } from '../repositories/budget-repository'
import { CategoriesRepository } from '../repositories/category-repository'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface EditCategoryUseCaseRequest {
  categoryId: string
  budgetId: string
  userId: string
  name: string
  type: TypeTransaction
}

type EditCategoryUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {}
>

export class EditCategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private budgetsRepository: BudgetsRepository,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({
    categoryId,
    budgetId,
    userId,
    name,
    type,
  }: EditCategoryUseCaseRequest): Promise<EditCategoryUseCaseResponse> {
    const userBudget = await this.userBudgetRepository.findByUserIdAndBudgetId(userId, budgetId)
    if (!userBudget) {
      return left(new UnauthorizedError())
    }

    const category = await this.categoriesRepository.findById(categoryId)
    if (!category) {
      return left(new ResourceNotFoundError())
    }

    const budget = await this.budgetsRepository.findById(budgetId)
    if (!budget) {
      return left(new ResourceNotFoundError())
    }

    category.name = name
    category.type = type

    await this.categoriesRepository.save(category)
    return right({})
  }
}
