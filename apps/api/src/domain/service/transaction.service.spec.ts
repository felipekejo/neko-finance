
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAccount } from 'test/factories/make-account'
import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { TransactionService } from './transaction.service'


let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemoryAccountsRepository: InMemoryAccountsRepository
let sut: TransactionService

describe('Transaction Service', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryAccountsRepository = new InMemoryAccountsRepository()

    sut = new TransactionService(
      inMemoryTransactionsRepository,
      inMemoryAccountsRepository,
    )
  })

  it('should be able to create a new transaction', async () => {

    const newAccount = makeAccount(
      {
        ownerId: new UniqueEntityID('user-01'),
      },
      new UniqueEntityID('account-01'),
    )

    await inMemoryAccountsRepository.create(newAccount)

    const result = await sut.createTransaction({
      description: 'New transaction',
      accountId: 'account-01',
      budgetId: 'budget-01',
      type: 'INCOMES',
      amount: 100,
      date: new Date(),
      categoryId: 'category-01',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryTransactionsRepository.items[0]).toEqual(
        result.value.transaction,
      )
    }
  })
})
