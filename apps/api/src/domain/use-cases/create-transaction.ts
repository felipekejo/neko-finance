import { Either, right } from '@/core/either'
import { Transaction, TypeTransaction } from '../entities/transaction'
import { TransactionService } from '../service/transaction.service'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CreateTransactionUseCaseRequest {
  budgetId: string
  accountId: string
  description: string
  amount: number
  type: TypeTransaction
  date: Date
  categoryId: string
}

type CreateTransactionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    transaction: Transaction
  }
>

export class CreateTransactionUseCase {
  constructor(
    private transactionService: TransactionService,
  ) {}

  async execute(request: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const result = await this.transactionService.createTransaction(request)

    if (result.isLeft()) {
      return result 
    }

    return right({ transaction: result.value.transaction })
  }
}
