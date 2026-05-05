import { Either, left, right } from '@/core/either'
import { Subcategory } from '../entities/subcategory'
import { CategoriesRepository } from '../repositories/category-repository'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { SubcategoryService } from '../service/subcategory.service'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface CreateSubcategoryUseCaseRequest {
  name: string
  categoryId: string
  userId: string
}

type CreateSubcategoryUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError | null,
  {
    subcategory: Subcategory
  }
>

export class CreateSubcategoryUseCase {
  constructor(
    private subcategoryService: SubcategoryService,
    private categoriesRepository: CategoriesRepository,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({
    name,
    categoryId,
    userId,
  }: CreateSubcategoryUseCaseRequest): Promise<CreateSubcategoryUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId)
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

    const result = await this.subcategoryService.create({ name, categoryId })
    if (result.isLeft()) {
      return result
    }

    return right({ subcategory: result.value.subcategory })
  }
}
