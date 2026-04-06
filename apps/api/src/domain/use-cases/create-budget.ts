import { Either, right } from '@/core/either'
import { Budget } from '../entities/budget'
import { BudgetsRepository } from '../repositories/budget-repository'

interface CreateBudgetUseCaseRequest {
  name: string
}

type CreateBudgetUseCaseResponse = Either<
  null,
  {
    budget: Budget
  }
>

export class CreateBudgetUseCase {
  constructor(private budgetsRepository: BudgetsRepository) {}

  async execute({
    name,
  }: CreateBudgetUseCaseRequest): Promise<CreateBudgetUseCaseResponse> {
    const budget = Budget.create({
      name,
    })

    await this.budgetsRepository.create(budget)

    return right({ budget })
  }
}
