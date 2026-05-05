import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAccount } from 'test/factories/make-account'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { FetchAccountsUseCase } from './fetch-accounts'

let inMemoryAccountsRepository: InMemoryAccountsRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: FetchAccountsUseCase

describe('Fetch Accounts Use Case', () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    sut = new FetchAccountsUseCase(inMemoryAccountsRepository, inMemoryUserBudgetRepository)
  })

  it('should return accounts sorted by createdAt in descending order', async () => {
    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const account1 = makeAccount({ createdAt: new Date('2023-01-01'), budgetId: new UniqueEntityID('budget-01') })
    const account2 = makeAccount({ createdAt: new Date('2023-02-01'), budgetId: new UniqueEntityID('budget-01') })
    await inMemoryAccountsRepository.create(account1)
    await inMemoryAccountsRepository.create(account2)

    const result = await sut.execute({ budgetId: 'budget-01', userId: 'user-01' })
    expect(result.isRight()).toBe(true)
    if (!result.isRight()) throw result.value
    expect(result.value.accounts).toEqual([account2, account1])
  })

  it('should be able to get accounts by budgetId', async () => {
    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-test'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const newAccount = makeAccount(
      { budgetId: new UniqueEntityID('budget-test') },
      new UniqueEntityID('account-01'),
    )
    await inMemoryAccountsRepository.create(newAccount)

    const result = await sut.execute({ budgetId: 'budget-test', userId: 'user-01' })
    expect(result.isRight()).toBe(true)
    if (!result.isRight()) throw result.value
    expect(result.value.accounts).toContainEqual(newAccount)
  })

  it('should return ResourceNotFoundError if no accounts are found for the budgetId', async () => {
    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const result = await sut.execute({ budgetId: 'budget-01', userId: 'user-01' })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
