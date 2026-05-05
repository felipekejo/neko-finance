import { Either, left, right } from '@/core/either'
import { CategoriesRepository } from '../repositories/category-repository'
import { SubcategoriesRepository } from '../repositories/subcategory-repository'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface EditSubcategoryUseCaseRequest {
  subcategoryId: string
  categoryId: string
  userId: string
  name: string
}

type EditSubcategoryUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {}
>

export class EditSubcategoryUseCase {
  constructor(
    private subcategoriesRepository: SubcategoriesRepository,
    private categoriesRepository: CategoriesRepository,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({
    subcategoryId,
    categoryId,
    userId,
    name,
  }: EditSubcategoryUseCaseRequest): Promise<EditSubcategoryUseCaseResponse> {
    const subcategory = await this.subcategoriesRepository.findById(subcategoryId)
    if (!subcategory) {
      return left(new ResourceNotFoundError())
    }

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

    subcategory.name = name
    await this.subcategoriesRepository.save(subcategory)
    return right({})
  }
}
