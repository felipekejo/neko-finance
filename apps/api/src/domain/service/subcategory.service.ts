import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Either, right } from '@/core/either'
import { Subcategory } from '../entities/subcategory'
import { SubcategoriesRepository } from '../repositories/subcategory-repository'

interface CreateSubcategoryServiceRequest {
  name: string
  categoryId: string
}

type CreateSubcategoryServiceResponse = Either<
  null,
  {
    subcategory: Subcategory
  }
>

export class SubcategoryService {
  constructor(private subcategoriesRepository: SubcategoriesRepository) {}

  async create({
    name,
    categoryId,
  }: CreateSubcategoryServiceRequest): Promise<CreateSubcategoryServiceResponse> {
    const subcategory = Subcategory.create({
      name,
      categoryId: new UniqueEntityID(categoryId),
    })

    await this.subcategoriesRepository.create(subcategory)

    return right({ subcategory })
  }
}
