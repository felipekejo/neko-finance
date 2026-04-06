import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'

import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
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
let sut: ImportTransactionsUseCase

describe('Import Transaction Use Case', () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemorySubcategoriesRepository = new InMemorySubcategoriesRepository()
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

    )
  })

  it('should be able to create a new transaction', async () => {
    const csvData = `description,amount,date,category,account,type,subcategory
    Lunch,15,2023-10-01,Food,Wallet,EXPENSES,NewSubcategory`


     const result = await sut.execute({
      budgetId: 'budget-1',
      ownerId: 'user-1',
      csvBuffer: Buffer.from(csvData),
    })
    console.log('felipe',inMemoryAccountsRepository.items)
    expect(result.isRight()).toBe(true)
    expect(inMemoryAccountsRepository.items[0].name).toEqual(
      'Wallet'
    )
    expect(inMemoryAccountsRepository.items[0].balance).toEqual(
      15
    )
    expect(inMemoryCategoriesRepository.items[0].name).toEqual(
      'Food'
    )
    expect(inMemorySubcategoriesRepository.items[0].name).toEqual(
      'NewSubcategory'
    )
    expect(inMemoryTransactionsRepository.items[0].type).toEqual(
      'EXPENSES'
    )
  })
})
