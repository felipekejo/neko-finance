import { left, right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserBudget } from '../entities/user-budget'
import { BudgetsRepository } from '../repositories/budget-repository'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface AssignBudgetUseCaseRequest {
  budgetId: string
  userId: string
}

type AssignBudgetUseCaseResponse = Either<ResourceNotFoundError, {}>

export class AssignBudgetUseCase {
  constructor(
    private budgetsRepository: BudgetsRepository,
    private userBudgetsRepository: UserBudgetRepository,
  ) { }

  async execute({ budgetId, userId }: AssignBudgetUseCaseRequest): Promise<AssignBudgetUseCaseResponse> {
    const budget = await this.budgetsRepository.findById(budgetId)
    if (!budget) {
      return left(new ResourceNotFoundError())
    }

    const userBudget = UserBudget.create({
      userId: new UniqueEntityID(userId),
      budgetId: budget.id,
    })

    await this.userBudgetsRepository.create(userBudget)
    return right({})
  }
}
