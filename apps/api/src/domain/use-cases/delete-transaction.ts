import { Either, left, right } from '@/core/either'
import { BudgetsRepository } from '../repositories/budget-repository'
import { TransactionsRepository } from '../repositories/transaction-repository'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface DeleteTransactionUseCaseRequest {
  transactionId: string
  budgetId: string
  userId: string
}

type DeleteTransactionUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {}
>

export class DeleteTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private budgetsRepository: BudgetsRepository,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({
    transactionId,
    budgetId,
    userId,
  }: DeleteTransactionUseCaseRequest): Promise<DeleteTransactionUseCaseResponse> {
    const transaction =
      await this.transactionsRepository.findById(transactionId)

    const budget = await this.budgetsRepository.findById(budgetId)

    if (!budget) {
      return left(new ResourceNotFoundError())
    }

    if (!transaction) {
      return left(new ResourceNotFoundError())
    }
    const userBudget = await this.userBudgetRepository.findByUserIdAndBudgetId(
      userId,
      budgetId,
    )
    if (!userBudget) {
      return left(new UnauthorizedError())
    }

    await this.transactionsRepository.delete(transaction)
    return right({})
  }
}
