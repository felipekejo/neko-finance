import { Either, left, right } from '@/core/either'
import { Transaction } from '../entities/transaction'
import { TransactionsRepository } from '../repositories/transaction-repository'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface GetTransactionByIdUseCaseRequest {
  id: string
  userId: string
}

type GetTransactionByIdUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    transaction: Transaction
  }
>

export class GetTransactionByIdUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({
    id,
    userId,
  }: GetTransactionByIdUseCaseRequest): Promise<GetTransactionByIdUseCaseResponse> {
    const transaction = await this.transactionsRepository.findById(id)
    if (!transaction) {
      return left(new ResourceNotFoundError())
    }

    const userBudget = await this.userBudgetRepository.findByUserIdAndBudgetId(
      userId,
      transaction.budgetId.toString(),
    )
    if (!userBudget) {
      return left(new UnauthorizedError())
    }

    return right({ transaction })
  }
}
