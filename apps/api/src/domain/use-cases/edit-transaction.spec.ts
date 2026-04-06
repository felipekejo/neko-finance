import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAccount } from 'test/factories/make-account'
import { makeTransaction } from 'test/factories/make-transaction'
import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { EditTransactionUseCase } from './edit-transaction'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemoryAccountsRepository: InMemoryAccountsRepository
let sut: EditTransactionUseCase

describe('Edit Transaction Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    sut = new EditTransactionUseCase(
      inMemoryTransactionsRepository,
      inMemoryAccountsRepository,
    )
  })

  it('should be able to edit a transaction', async () => {
    const newTransaction = makeTransaction(
      {
        type: 'EXPENSES',
        accountId: new UniqueEntityID('account-01'),
        amount: 100,
      },
      new UniqueEntityID('transaction-01'),
    )
    const newAccount = makeAccount(
      {
        ownerId: new UniqueEntityID('user-01'),
      },
      new UniqueEntityID('account-01'),
    )

    await inMemoryAccountsRepository.create(newAccount)

    await inMemoryTransactionsRepository.create(newTransaction)

    await sut.execute({
      ownerId: 'user-01',
      transactionId: 'transaction-01',
      accountId: 'account-01',
      type: 'INCOMES',
      amount: 200,
      description: 'new description',
    })

    expect(inMemoryTransactionsRepository.items[0]).toMatchObject({
      type: 'INCOMES',
      amount: 200,
      description: 'new description',
    })
  })

  it('should not be able to edit a transaction if you are not the owner', async () => {
    const newTransaction = makeTransaction(
      {
        budgetId: new UniqueEntityID('budget-01'),
      },
      new UniqueEntityID('transaction-01'),
    )
    const newAccount = makeAccount(
      {
        ownerId: new UniqueEntityID('user-01'),
      },
      new UniqueEntityID('account-01'),
    )

    await inMemoryAccountsRepository.create(newAccount)

    await inMemoryTransactionsRepository.create(newTransaction)

    const result = await sut.execute({
      ownerId: 'user-02',
      transactionId: 'transaction-01',
      accountId: 'account-01',
      type: 'INCOMES',
      amount: 200,
      description: 'new description',

    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })

  it('should be able to update the balance of the new and old account', async () => {

    const oldAccount = makeAccount(
      {
        ownerId: new UniqueEntityID('user-01'),
        balance: 300,
        budgetId: new UniqueEntityID('budget-01'),
      },
      new UniqueEntityID('account-01'),
    )
    const newAccount = makeAccount(
      {
        ownerId: new UniqueEntityID('user-01'),
        balance: 300,
        budgetId: new UniqueEntityID('budget-01'),
      },
      new UniqueEntityID('account-02'),
    )
    await inMemoryAccountsRepository.create(oldAccount)
    await inMemoryAccountsRepository.create(newAccount)

    const newTransaction = makeTransaction(
      {
        type: 'INCOMES',
        accountId: new UniqueEntityID('account-01'),
        amount: 100,
        budgetId: new UniqueEntityID('budget-01'),
      },
      new UniqueEntityID('transaction-01'),
    )
    oldAccount.balance+=100
    await inMemoryAccountsRepository.save(oldAccount)
    await inMemoryTransactionsRepository.create(newTransaction)

    await sut.execute({
      ownerId: 'user-01',
      transactionId: 'transaction-01',
      accountId: 'account-02',
      type: 'INCOMES',
      amount: 200,
      description: 'new description',
    })

    
    expect(inMemoryAccountsRepository.items[0]).toMatchObject({
      balance: 300,
    })
    expect(inMemoryAccountsRepository.items[1]).toMatchObject({
      balance: 500,
    })
  })
})
