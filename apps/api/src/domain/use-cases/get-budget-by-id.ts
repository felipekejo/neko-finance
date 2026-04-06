import { Either, left, right } from '@/core/either'
import { Budget } from '../entities/budget'
import { BudgetsRepository } from '../repositories/budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetBudgetByIdUseCaseRequest {
  budgetId: string
}

type GetBudgetByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    budget: Budget
  }
>

export class GetBudgetByIdUseCase {
  constructor(private budgetsRepository: BudgetsRepository) {}

  async execute({
    budgetId,
  }: GetBudgetByIdUseCaseRequest): Promise<GetBudgetByIdUseCaseResponse> {
    const budget = await this.budgetsRepository.findById(budgetId)
    if (!budget) {
      return left(new ResourceNotFoundError())
    }

    return right({ budget })
  }
}
