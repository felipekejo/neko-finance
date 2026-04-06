import { Either, left, right } from '@/core/either'
import { CategoriesRepository } from '../repositories/category-repository'
import { SubcategoriesRepository } from '../repositories/subcategory-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface EditSubcategoryUseCaseRequest {
  subcategoryId: string
  categoryId: string
  name: string
}

type EditSubcategoryUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {}
>

export class EditSubcategoryUseCase {
  constructor(
    private subcategoriesRepository: SubcategoriesRepository,
    private categoriesRepository: CategoriesRepository
  ) {}

  async execute({
    subcategoryId,
    categoryId,
    name
  }: EditSubcategoryUseCaseRequest): Promise<EditSubcategoryUseCaseResponse> {

    const subcategory =
      await this.subcategoriesRepository.findById(subcategoryId)

    const category = await this.categoriesRepository.findById(categoryId)

    if (!subcategory) {
      return left(new ResourceNotFoundError())
    }
    if (!category) {
      return left(new ResourceNotFoundError())
    }

    subcategory.name = name

    await this.subcategoriesRepository.save(subcategory)
    return right({})
  }
}
