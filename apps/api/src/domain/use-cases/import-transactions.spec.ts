import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { AccountService } from '../service/account.service'
import { CategoryService } from '../service/category.service'
import { SubcategoryService } from '../service/subcategory.service'
import { TransactionService } from '../service/transaction.service'
import { ImportTransactionsUseCase } from './import-transactions'

let accountService: AccountService
let categoryService: CategoryService
let transactionService: TransactionService
let subcategoryService: SubcategoryService
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryAccountsRepository: InMemoryAccountsRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemorySubcategoriesRepository: InMemorySubcategoriesRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: ImportTransactionsUseCase

describe('Import Transaction Use Case', () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemorySubcategoriesRepository = new InMemorySubcategoriesRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    transactionService = new TransactionService(inMemoryTransactionsRepository, inMemoryAccountsRepository)
    accountService = new AccountService(inMemoryAccountsRepository)
    categoryService = new CategoryService(inMemoryCategoriesRepository)
    subcategoryService = new SubcategoryService(inMemorySubcategoriesRepository)
    sut = new ImportTransactionsUseCase(
      transactionService,
      categoryService,
      accountService,
      subcategoryService,
      inMemoryAccountsRepository,
      inMemoryCategoriesRepository,
      inMemorySubcategoriesRepository,
      inMemoryUserBudgetRepository,
    )
  })

  it('should be able to import transactions from CSV', async () => {
    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-1'),
      budgetId: new UniqueEntityID('budget-1'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const csvData = `description,amount,date,category,account,type,subcategory
    Lunch,15,2023-10-01,Food,Wallet,EXPENSES,NewSubcategory`

    const result = await sut.execute({
      budgetId: 'budget-1',
      ownerId: 'user-1',
      csvBuffer: Buffer.from(csvData),
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryAccountsRepository.items[0].name).toEqual('Wallet')
    expect(inMemoryAccountsRepository.items[0].balance).toEqual(-15)
    expect(inMemoryCategoriesRepository.items[0].name).toEqual('Food')
    expect(inMemorySubcategoriesRepository.items[0].name).toEqual('NewSubcategory')
    expect(inMemoryTransactionsRepository.items[0].type).toEqual('EXPENSES')
  })
})
