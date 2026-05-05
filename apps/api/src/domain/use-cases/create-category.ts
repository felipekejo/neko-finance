import { Either, left, right } from '@/core/either'
import { Category } from '../entities/category'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { CategoryService } from '../service/category.service'
import { UnauthorizedError } from './errors/unauthorized-error'

type TypeTransaction = 'INCOMES' | 'EXPENSES'

interface CreateCategoryUseCaseRequest {
  name: string
  budgetId: string
  userId: string
  type: TypeTransaction
}

type CreateCategoryUseCaseResponse = Either<
  UnauthorizedError | null,
  {
    category: Category
  }
>

export class CreateCategoryUseCase {
  constructor(
    private categoryService: CategoryService,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({
    name,
    budgetId,
    userId,
    type,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const userBudget = await this.userBudgetRepository.findByUserIdAndBudgetId(userId, budgetId)
    if (!userBudget) {
      return left(new UnauthorizedError())
    }

    const result = await this.categoryService.create({ name, budgetId, type })
    if (result.isLeft()) {
      return result
    }

    return right({ category: result.value.category })
  }
}
