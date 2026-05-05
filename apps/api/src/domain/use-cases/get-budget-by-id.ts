import { Either, left, right } from '@/core/either'
import { Budget } from '../entities/budget'
import { BudgetsRepository } from '../repositories/budget-repository'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface GetBudgetByIdUseCaseRequest {
  budgetId: string
  userId: string
}

type GetBudgetByIdUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    budget: Budget
  }
>

export class GetBudgetByIdUseCase {
  constructor(
    private budgetsRepository: BudgetsRepository,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({
    budgetId,
    userId,
  }: GetBudgetByIdUseCaseRequest): Promise<GetBudgetByIdUseCaseResponse> {
    const budget = await this.budgetsRepository.findById(budgetId)
    if (!budget) {
      return left(new ResourceNotFoundError())
    }

    const userBudget = await this.userBudgetRepository.findByUserIdAndBudgetId(userId, budgetId)
    if (!userBudget) {
      return left(new UnauthorizedError())
    }

    return right({ budget })
  }
}
