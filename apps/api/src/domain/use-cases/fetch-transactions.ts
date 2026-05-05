import { Either, left, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'

import { Transaction } from '../entities/transaction'
import { TransactionFilters, TransactionsRepository } from '../repositories/transaction-repository'
import { UserBudgetRepository } from '../repositories/user-budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface FetchTransactionsRequest {
  userId: string
  filters: TransactionFilters & {
    year?: number
    month?: number
  }
  pagination?: PaginationParams
}

type FetchTransactionsUseCaseResponse = Either<ResourceNotFoundError | UnauthorizedError, {
  transactions: Transaction[]
  total: number
}>;

export class FetchTransactionsUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({ userId, filters, pagination }: FetchTransactionsRequest): Promise<FetchTransactionsUseCaseResponse> {
    if (filters.budgetId) {
      const userBudget = await this.userBudgetRepository.findByUserIdAndBudgetId(userId, filters.budgetId)
      if (!userBudget) {
        return left(new UnauthorizedError())
      }
    }

    let parsedFilters: TransactionFilters = { ...filters }

    if (filters.month && filters.year) {
      const startDate = new Date(filters.year, filters.month - 1, 1)
      const endDate = new Date(filters.year, filters.month, 0, 23, 59, 59)

      parsedFilters = {
        ...filters,
        dateFrom: startDate,
        dateTo: endDate,
      }

      delete (parsedFilters as any).month
      delete (parsedFilters as any).year
    }

    const [transactions, total] = await Promise.all([
      this.transactionsRepository.findMany(parsedFilters, pagination),
      this.transactionsRepository.countMany(parsedFilters),
    ])

    if (transactions.length === 0) {
      return left(new ResourceNotFoundError())
    }

    return right({ transactions, total })
  }
}
