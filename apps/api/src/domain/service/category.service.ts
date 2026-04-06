import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '../entities/category'
import { CategoriesRepository } from '../repositories/category-repository'

type TypeTransaction = 'INCOMES' | 'EXPENSES'
interface CreateCategoryServiceRequest {
  name: string
  budgetId: string
  type: TypeTransaction
}

type CreateCategoryServiceResponse = Either<
  null,
  {
    category: Category
  }
>

export class CategoryService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async create({
    name,
    budgetId,
    type,
  }: CreateCategoryServiceRequest): Promise<CreateCategoryServiceResponse> {
    const category = Category.create({
      name,
      budgetId: new UniqueEntityID(budgetId),
      type,
    })

    await this.categoriesRepository.create(category)

    return right({ category })
  }
}
