import { Either, left, right } from '@/core/either'
import { Transaction, TypeTransaction } from '../entities/transaction'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { TransactionService } from '../service/transaction.service'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface CreateTransactionUseCaseRequest {
  userId: string
  budgetId: string
  accountId: string
  description: string
  amount: number
  type: TypeTransaction
  date: Date
  categoryId: string
}

type CreateTransactionUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    transaction: Transaction
  }
>

export class CreateTransactionUseCase {
  constructor(
    private transactionService: TransactionService,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute(request: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const userBudget = await this.userBudgetRepository.findByUserIdAndBudgetId(
      request.userId,
      request.budgetId,
    )
    if (!userBudget) {
      return left(new UnauthorizedError())
    }

    const result = await this.transactionService.createTransaction(request)
    if (result.isLeft()) {
      return result
    }

    return right({ transaction: result.value.transaction })
  }
}
