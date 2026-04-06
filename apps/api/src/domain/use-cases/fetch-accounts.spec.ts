import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAccount } from 'test/factories/make-account'
import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { FetchAccountsUseCase } from './fetch-accounts'

let inMemoryAccountsRepository: InMemoryAccountsRepository
let sut: FetchAccountsUseCase
describe('Fetch Accounts Use Case', () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    sut = new FetchAccountsUseCase(inMemoryAccountsRepository)
  })
  it('should return accounts sorted by createdAt in descending order', async () => {
    const account1 = makeAccount({ createdAt: new Date('2023-01-01'), budgetId: new UniqueEntityID('budget-01') })
    const account2 = makeAccount({ createdAt: new Date('2023-02-01'), budgetId: new UniqueEntityID('budget-01') })
    await inMemoryAccountsRepository.create(account1)
    await inMemoryAccountsRepository.create(account2)

    const result = await sut.execute({
      budgetId: 'budget-01',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.accounts).toEqual([account2, account1])
  })
  it('should be able to get accounts by budgetId', async () => {
    const newAccount = makeAccount(
      { budgetId: new UniqueEntityID('budget-test') },
      new UniqueEntityID('account-01')
    )
    await inMemoryAccountsRepository.create(newAccount)

    const result = await sut.execute({
      budgetId: 'budget-test',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.accounts).toContainEqual(newAccount)
  })
})
  it('should return ResourceNotFoundError if no accounts are found for the budgetId', async () => {
    const result = await sut.execute({
      budgetId: 'non-existing-budget-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

