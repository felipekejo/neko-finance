import { PaginationParams } from '@/core/repositories/pagination-params'
import { Transaction } from '../entities/transaction'

export interface TransactionFilters {
  accountId?: string
  categoryId?: string
  budgetId?: string
  type?: 'INCOMES' | 'EXPENSES'
  dateFrom?: Date
  dateTo?: Date
}

export abstract class TransactionsRepository {
  abstract create(transaction: Transaction): Promise<void>
  abstract findById(id: string): Promise<Transaction | null>
  abstract findMany(filters: TransactionFilters, pagination?: PaginationParams): Promise<Transaction[]>
  abstract sumAmountBy(filters: Omit<TransactionFilters, 'date'>): Promise<number>
  abstract save(transaction: Transaction): Promise<void>
  abstract delete(transaction: Transaction): Promise<void>
}
