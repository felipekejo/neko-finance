import { Either, right } from '@/core/either'
import { Category } from '../entities/category'
import { CategoryService } from '../service/category.service'

type TypeTransaction = 'INCOMES' | 'EXPENSES'
interface CreateCategoryUseCaseRequest {
  name: string
  budgetId: string
  type: TypeTransaction
}

type CreateCategoryUseCaseResponse = Either<
  null,
  {
    category: Category
  }
>

export class CreateCategoryUseCase {
  constructor(private categoryService: CategoryService) {}

  async execute({
    name,
    budgetId,
    type,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const result = await this.categoryService.create({
      name,
      budgetId,
      type,
    })

    if (result.isLeft()) {
      return result
    }

    return right({ category: result.value.category })
  }
}
