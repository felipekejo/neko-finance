import { Either, left, right } from '@/core/either'
import { TypeTransaction } from '../entities/category'
import { BudgetsRepository } from '../repositories/budget-repository'
import { CategoriesRepository } from '../repositories/category-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface EditCategoryUseCaseRequest {
  categoryId: string
  budgetId: string
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
  ) {}

  async execute({
    categoryId,
    budgetId,
    name,
    type,
  }: EditCategoryUseCaseRequest): Promise<EditCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId)
    const budget = await this.budgetsRepository.findById(budgetId)
    if (!category) {
      return left(new ResourceNotFoundError())
    }
    if (!budget) {
      return left(new ResourceNotFoundError())
    }

    category.name = name
    category.type = type

    await this.categoriesRepository.save(category)
    return right({})
  }
}
