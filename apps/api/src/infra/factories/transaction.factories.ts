import { CreateTransactionUseCase } from '@/domain/use-cases/create-transaction'
import { DeleteTransactionUseCase } from '@/domain/use-cases/delete-transaction'
import { EditTransactionUseCase } from '@/domain/use-cases/edit-transaction'
import { FetchTransactionsUseCase } from '@/domain/use-cases/fetch-transactions'
import { GetTransactionByIdUseCase } from '@/domain/use-cases/get-transaction-by-id'
import { GetTransactionsSummaryUseCase } from '@/domain/use-cases/get-transactions-summary'
import { TransactionService } from '@/domain/service/transaction.service'
import { PrismaAccountsRepository } from '@/infra/database/prisma/repositories/prisma-accounts-repository'
import { PrismaBudgetsRepository } from '@/infra/database/prisma/repositories/prisma-budgets-repository'
import { PrismaCategoryRepository } from '@/infra/database/prisma/repositories/prisma-category-repository'
import { PrismaTransactionsRepository } from '@/infra/database/prisma/repositories/prisma-transactions-repository'
import { PrismaUserBudgetRepository } from '@/infra/database/prisma/repositories/prisma-user-budget-repository'
import { prisma } from '@/lib/prisma'

function transactionsRepository() {
  return new PrismaTransactionsRepository(prisma)
}

function accountsRepository() {
  return new PrismaAccountsRepository(prisma)
}

export function makeCreateTransactionUseCase() {
  return new CreateTransactionUseCase(
    new TransactionService(transactionsRepository(), accountsRepository()),
  )
}

export function makeDeleteTransactionUseCase() {
  return new DeleteTransactionUseCase(
    transactionsRepository(),
    new PrismaBudgetsRepository(prisma),
    new PrismaUserBudgetRepository(prisma),
  )
}

export function makeEditTransactionUseCase() {
  return new EditTransactionUseCase(transactionsRepository(), accountsRepository())
}

export function makeFetchTransactionsUseCase() {
  return new FetchTransactionsUseCase(transactionsRepository())
}

export function makeGetTransactionByIdUseCase() {
  return new GetTransactionByIdUseCase(transactionsRepository())
}

export function makeGetTransactionsSummaryUseCase() {
  return new GetTransactionsSummaryUseCase(
    transactionsRepository(),
    new PrismaCategoryRepository(prisma),
  )
}
