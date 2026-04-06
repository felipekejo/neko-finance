import { Either, left, right } from '@/core/either'
import { Subcategory } from '../entities/subcategory'
import { SubcategoriesRepository } from '../repositories/subcategory-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetSubcategoryByIdUseCaseRequest {
  subcategoryId: string
}

type GetSubcategoryByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    subcategory: Subcategory
  }
>

export class GetSubcategoryByIdUseCase {
  constructor(private subcategoriesRepository: SubcategoriesRepository) {}

  async execute({
    subcategoryId,
  }: GetSubcategoryByIdUseCaseRequest): Promise<GetSubcategoryByIdUseCaseResponse> {
    const subcategory = await this.subcategoriesRepository.findById(subcategoryId)
    if (!subcategory) {
      return left(new ResourceNotFoundError())
    }
    return right({ subcategory })
  }
}
