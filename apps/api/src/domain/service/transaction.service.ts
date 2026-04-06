import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TransactionsRepository } from '@/domain/repositories/transaction-repository'
import { TypeTransaction } from '../entities/category'
import { Transaction } from '../entities/transaction'
import { AccountsRepository } from '../repositories/account-repository'
import { ResourceNotFoundError } from '../use-cases/errors/resource-not-found-error'

interface CreateTransactionServiceRequest {
  budgetId: string
  accountId: string
  description: string
  amount: number
  type: TypeTransaction
  date: Date
  categoryId: string
  subcategoryId?: string
}

type CreateTransactionServiceResponse = Either<
  ResourceNotFoundError,
  {
    transaction: Transaction
  }
>

export class TransactionService {
  constructor(    
    private transactionsRepository: TransactionsRepository,
    private accountsRepository: AccountsRepository,
  ) {}

  async createTransaction({
    description,
    accountId,
    budgetId,
    amount,
    type,
    date,
    categoryId,
    subcategoryId,

  }: CreateTransactionServiceRequest): Promise<CreateTransactionServiceResponse> {
    const transaction = Transaction.create({
      description,
      accountId: new UniqueEntityID(accountId),
      budgetId: new UniqueEntityID(budgetId),
      amount,
      type,
      date,
      categoryId: new UniqueEntityID(categoryId),
      subcategoryId: subcategoryId ? new UniqueEntityID(subcategoryId) : undefined,
    })
    await this.transactionsRepository.create(transaction)

    const account = await this.accountsRepository.findById(accountId)

    if (!account) {
      return left(new ResourceNotFoundError())
    }

    account.applyTransaction(amount, type)

    await this.accountsRepository.save(account)

    return right({ transaction })
  }
}