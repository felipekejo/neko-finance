import { Either, right } from '@/core/either'
import { TransactionsRepository } from '../repositories/transaction-repository'

interface GetTransactionsEvolutionRequest {
  budgetId: string
  year: number
  accountId?: string
}

export interface MonthEvolution {
  month: number
  year: number
  totalIncomes: number
  totalExpenses: number
  balance: number
}

type GetTransactionsEvolutionResponse = Either<null, { evolution: MonthEvolution[] }>

export class GetTransactionsEvolutionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    budgetId,
    year,
    accountId,
  }: GetTransactionsEvolutionRequest): Promise<GetTransactionsEvolutionResponse> {
    const months = Array.from({ length: 12 }, (_, i) => i + 1)

    const evolution = await Promise.all(
      months.map(async (month) => {
        const dateFrom = new Date(year, month - 1, 1)
        const dateTo = new Date(year, month, 0, 23, 59, 59)
        const baseFilters = { budgetId, accountId, dateFrom, dateTo }

        const [totalIncomes, totalExpenses] = await Promise.all([
          this.transactionsRepository.sumAmountBy({ ...baseFilters, type: 'INCOMES' }),
          this.transactionsRepository.sumAmountBy({ ...baseFilters, type: 'EXPENSES' }),
        ])

        return {
          month,
          year,
          totalIncomes,
          totalExpenses,
          balance: totalIncomes - totalExpenses,
        }
      }),
    )

    return right({ evolution })
  }
}
