import { left, right, type Either } from '@/core/either'
import { UserBudget } from '../entities/user-budget'
import { BudgetsRepository } from '../repositories/budget-repository'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { UsersRepository } from '../repositories/user-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface AssignBudgetUseCaseRequest {
  budgetId: string
  userId: string
}

type AssignBudgetUseCaseResponse = Either<ResourceNotFoundError, {}>

export class AssignBudgetUseCase {
  constructor(
    private budgetsRepository: BudgetsRepository,
    private usersRepository: UsersRepository,
    private userBudgetsRepository: UserBudgetRepository,
  ) {}

  async execute({
    budgetId,
    userId,
  }: AssignBudgetUseCaseRequest): Promise<AssignBudgetUseCaseResponse> {
    const budget = await this.budgetsRepository.findById(budgetId)
    if (!budget) {
      return left(new ResourceNotFoundError())
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const userBudget = UserBudget.create({
      userId: user.id,
      budgetId: budget.id,
    })

    await this.userBudgetsRepository.create(userBudget)

    return right({})
  }
}
