
import { Either, left, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'

import { Transaction } from '../entities/transaction'
import { TransactionFilters, TransactionsRepository } from '../repositories/transaction-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FetchTransactionsRequest {
  filters: TransactionFilters & {
    year?: number
    month?: number
  }
  pagination?: PaginationParams
}
type FetchTransactionsUseCaseResponse = Either<ResourceNotFoundError, {
  transactions: Transaction[]
}>;

export class FetchTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ filters, pagination }: FetchTransactionsRequest): Promise<FetchTransactionsUseCaseResponse> {
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

    const transactions = await this.transactionsRepository.findMany(parsedFilters, pagination)

      if(transactions.length === 0 ){
          return left(new ResourceNotFoundError())
        }
    return right({transactions})
  }
}