import { CreateTransactionUseCase } from '@/domain/use-cases/create-transaction'
import { DeleteTransactionUseCase } from '@/domain/use-cases/delete-transaction'
import { EditTransactionUseCase } from '@/domain/use-cases/edit-transaction'
import { FetchTransactionsUseCase } from '@/domain/use-cases/fetch-transactions'
import { GetTransactionByIdUseCase } from '@/domain/use-cases/get-transaction-by-id'
import { GetTransactionsSummaryUseCase } from '@/domain/use-cases/get-transactions-summary'
import { GetTransactionsEvolutionUseCase } from '@/domain/use-cases/get-transactions-evolution'
import { ImportTransactionsUseCase } from '@/domain/use-cases/import-transactions'
import { AccountService } from '@/domain/service/account.service'
import { CategoryService } from '@/domain/service/category.service'
import { SubcategoryService } from '@/domain/service/subcategory.service'
import { TransactionService } from '@/domain/service/transaction.service'
import { PrismaAccountsRepository } from '@/infra/database/prisma/repositories/prisma-accounts-repository'
import { PrismaBudgetsRepository } from '@/infra/database/prisma/repositories/prisma-budgets-repository'
import { PrismaSubcategoriesRepository } from '@/infra/database/prisma/repositories/prisma-subcategory-repository'
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

export function makeGetTransactionsEvolutionUseCase() {
  return new GetTransactionsEvolutionUseCase(transactionsRepository())
}

export function makeImportTransactionsUseCase() {
  const accountsRepo = new PrismaAccountsRepository(prisma)
  const categoriesRepo = new PrismaCategoryRepository(prisma)
  const subcategoriesRepo = new PrismaSubcategoriesRepository(prisma)

  return new ImportTransactionsUseCase(
    new TransactionService(transactionsRepository(), accountsRepo),
    new CategoryService(categoriesRepo),
    new AccountService(accountsRepo),
    new SubcategoryService(subcategoriesRepo),
    accountsRepo,
    categoriesRepo,
    subcategoriesRepo,
  )
}
