import { Either, left, right } from '@/core/either'
import { Category } from '../entities/category'
import { CategoriesRepository } from '../repositories/category-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetCategoryByIdUseCaseRequest {
  categoryId: string,
  budgetId: string
}

type GetCategoryByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    category: Category
  }
>

export class GetCategoryByIdUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    categoryId,
    budgetId,
  }: GetCategoryByIdUseCaseRequest): Promise<GetCategoryByIdUseCaseResponse> {
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
