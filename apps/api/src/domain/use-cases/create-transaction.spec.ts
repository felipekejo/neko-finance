import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAccount } from 'test/factories/make-account'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { TransactionService } from '../service/transaction.service'
import { CreateTransactionUseCase } from './create-transaction'

let transactionService: TransactionService
let inMemoryAccountsRepository: InMemoryAccountsRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: CreateTransactionUseCase

describe('Create Transaction Use Case', () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    transactionService = new TransactionService(
      inMemoryTransactionsRepository,
      inMemoryAccountsRepository,
    )
    sut = new CreateTransactionUseCase(transactionService, inMemoryUserBudgetRepository)
  })

  it('should be able to create a new transaction', async () => {
    const newAccount = makeAccount(
      { ownerId: new UniqueEntityID('user-01'), balance: 100 },
      new UniqueEntityID('account-01'),
    )
    await inMemoryAccountsRepository.create(newAccount)

    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const result = await sut.execute({
      description: 'New transaction',
      accountId: 'account-01',
      budgetId: 'budget-01',
      type: 'INCOMES',
      amount: 100,
      date: new Date(),
      categoryId: 'category-01',
      userId: 'user-01',
    })

    expect(result.isRight()).toBe(true)
    if (!result.isRight()) throw result.value
    expect(inMemoryTransactionsRepository.items[0]).toEqual(
      result.value.transaction,
    )
  })

  it('should be able to increase the account balance', async () => {
    const newAccount = makeAccount(
      { ownerId: new UniqueEntityID('user-01'), balance: 100 },
      new UniqueEntityID('account-01'),
    )
    await inMemoryAccountsRepository.create(newAccount)

    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    await sut.execute({
      description: 'New transaction',
      accountId: 'account-01',
      budgetId: 'budget-01',
      type: 'INCOMES',
      amount: 100,
      date: new Date(),
      categoryId: 'category-01',
      userId: 'user-01',
    })

    expect(inMemoryAccountsRepository.items[0].balance).toEqual(200)
  })

  it('should be able to decrease the account balance', async () => {
    const newAccount = makeAccount(
      { ownerId: new UniqueEntityID('user-01'), balance: 200 },
      new UniqueEntityID('account-01'),
    )
    await inMemoryAccountsRepository.create(newAccount)

    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    await sut.execute({
      description: 'New transaction',
      accountId: 'account-01',
      budgetId: 'budget-01',
      type: 'EXPENSES',
      amount: 100,
      date: new Date(),
      categoryId: 'category-01',
      userId: 'user-01',
    })

    expect(inMemoryAccountsRepository.items[0].balance).toEqual(100)
  })
})
