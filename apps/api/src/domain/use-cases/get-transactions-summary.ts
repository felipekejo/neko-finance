import { Either, right } from '@/core/either'
import { CategoriesRepository } from '../repositories/category-repository'
import { TransactionFilters, TransactionsRepository } from '../repositories/transaction-repository'

interface GetTransactionsSummaryRequest {
  budgetId: string
  accountId?: string
  type?: 'INCOMES' | 'EXPENSES'
  month?: number
  year?: number
}

export interface CategorySummary {
  categoryId: string
  categoryName: string
  type: 'INCOMES' | 'EXPENSES'
  total: number
}

export interface TransactionsSummary {
  totalIncomes: number
  totalExpenses: number
  balance: number
  byCategory: CategorySummary[]
}

type GetTransactionsSummaryResponse = Either<null, { summary: TransactionsSummary }>

export class GetTransactionsSummaryUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    budgetId,
    accountId,
    type,
    month,
    year,
  }: GetTransactionsSummaryRequest): Promise<GetTransactionsSummaryResponse> {
    const filters: TransactionFilters = { budgetId, accountId, type }

    if (month && year) {
      filters.dateFrom = new Date(year, month - 1, 1)
      filters.dateTo = new Date(year, month, 0, 23, 59, 59)
    } else if (year) {
      filters.dateFrom = new Date(year, 0, 1)
      filters.dateTo = new Date(year, 11, 31, 23, 59, 59)
    }

    const [groups, categories] = await Promise.all([
      this.transactionsRepository.groupAmountByCategory(filters),
      this.categoriesRepository.findMany({ type }, budgetId),
    ])

    const categoryMap = new Map(categories.map((c) => [c.id.toString(), c]))

    const byCategory: CategorySummary[] = groups
      .map((g) => {
        const category = categoryMap.get(g.categoryId)
        if (!category) return null
        return {
          categoryId: g.categoryId,
          categoryName: category.name,
          type: category.type,
          total: g.total,
        }
      })
      .filter((item): item is CategorySummary => item !== null)

    const totalIncomes = byCategory
      .filter((c) => c.type === 'INCOMES')
      .reduce((sum, c) => sum + c.total, 0)

    const totalExpenses = byCategory
      .filter((c) => c.type === 'EXPENSES')
      .reduce((sum, c) => sum + c.total, 0)

    return right({
      summary: {
        totalIncomes,
        totalExpenses,
        balance: totalIncomes - totalExpenses,
        byCategory,
      },
    })
  }
}
