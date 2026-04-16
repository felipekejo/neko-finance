import { PaginationParams } from '@/core/repositories/pagination-params'
import { Transaction } from '@/domain/entities/transaction'
import { TransactionsRepository, type TransactionFilters } from '@/domain/repositories/transaction-repository'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []

  async findMany(filters: TransactionFilters, { page = 1, perPage = 10 }: PaginationParams) {
    const transactions = this.items.filter((transaction) => {
      let matches = true

      if (filters.accountId) {
        matches = matches && transaction.accountId.toString() === filters.accountId
      }
      if (filters.categoryId) {
        matches = matches && transaction.categoryId.toString() === filters.categoryId
      }
      if (filters.budgetId) {
        matches = matches && transaction.budgetId.toString() === filters.budgetId
      }
      if (filters.type) {
        matches = matches && transaction.type === filters.type
      }
      if (filters.dateFrom) {
        matches = matches && transaction.date >= filters.dateFrom
      }
      if (filters.dateTo) {
        matches = matches && transaction.date <= filters.dateTo
      }

      return matches
    })

    return transactions.slice((page - 1) * perPage, page * perPage)
  }

  async sumAmountBy(filters: Omit<TransactionFilters, 'dateFrom' | 'dateTo'>) {
    const transactions = this.items.filter((transaction) => {
      let matches = true

      if (filters.accountId) {
        matches = matches && transaction.accountId.toString() === filters.accountId
      }
      if (filters.categoryId) {
        matches = matches && transaction.categoryId.toString() === filters.categoryId
      }
      if (filters.budgetId) {
        matches = matches && transaction.budgetId.toString() === filters.budgetId
      }
      if (filters.type) {
        matches = matches && transaction.type === filters.type
      }

      return matches
    })

    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  }

  async create(transaction: Transaction): Promise<void> {
    this.items.push(transaction)
  }

  async delete(transaction: Transaction) {
    const index = this.items.findIndex((item) => item.id === transaction.id)
    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async findById(id: string) {
    const transaction = this.items.find((item) => item.id.toString() === id)

    if (!transaction) {
      return null
    }

    return transaction
  }

  async findManyRecent({ page }: PaginationParams) {
    const transactions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return transactions
  }

  async save(transaction: Transaction) {
    const index = this.items.findIndex((item) => item.id === transaction.id)
    if (index >= 0) {
      this.items[index] = transaction
    }
  }
}
