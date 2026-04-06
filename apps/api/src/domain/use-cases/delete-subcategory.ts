import { Either, left, right } from '@/core/either'
import { SubcategoriesRepository } from '../repositories/subcategory-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface DeleteSubcategoryUseCaseRequest {
  subcategoryId: string
  userId: string
  budgetId: string
}

type DeleteSubcategoryUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {}
>

export class DeleteSubcategoryUseCase {
  constructor(
    private subcategoriesRepository: SubcategoriesRepository,
  ) {}

  async execute({
    subcategoryId,
  }: DeleteSubcategoryUseCaseRequest): Promise<DeleteSubcategoryUseCaseResponse> {
    const subcategory =
      await this.subcategoriesRepository.findById(subcategoryId)

    if (!subcategory) {
      return left(new ResourceNotFoundError())
    }


    await this.subcategoriesRepository.delete(subcategory)
    return right({})
  }
}
