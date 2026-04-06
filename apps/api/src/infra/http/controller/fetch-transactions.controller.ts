import { FetchTransactionsUseCase } from "@/domain/use-cases/fetch-transactions"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { TransactionPresenter } from "../presenters/transaction-presenter"


interface FetchTransactionsQuery {
  page?: number
  perPage?: number
  year?: number
  month?: number
  accountId?: string
  categoryId?: string
  budgetId?: string
  type?: 'INCOMES' | 'EXPENSES'
  dateFrom?: Date
  dateTo?: Date
}

@ApiTags('Transactions')
@Controller('/budgets/:budgetId/transactions')
export class FetchTransactionsController {
  constructor(private fetchTransactions: FetchTransactionsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('budgetId') budgetId: string,
    @Query() query: FetchTransactionsQuery,
  ) {

    const filters={
      budgetId,
      accountId: query.accountId,
      categoryId: query.categoryId,
      type: query.type,
      year: query.year,
      month: query.month,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    }
    const pagination = {
      page: query.page ?? 1,
      perPage: query.perPage ?? 10,
    }

    const result = await this.fetchTransactions.execute({
      filters,
      pagination,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const transactions = result.value.transactions
    return { transactions: transactions.map(TransactionPresenter.toHTTP) }
  }
}