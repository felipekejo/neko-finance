import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { AccountService } from '../service/account.service'
import { CreateAccountUseCase } from './create-account'
    
let accountService: AccountService
let inMemoryAccountsRepository: InMemoryAccountsRepository
let sut: CreateAccountUseCase

describe('Create Account Use Case', () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    accountService = new AccountService(inMemoryAccountsRepository)
    sut = new CreateAccountUseCase(accountService)
  })

  it('should be able to create a new account', async () => {
    const result = await sut.execute({
      name: 'New account',
      ownerId: 'user-01',
      budgetId: 'budget-01',
      balance: 0,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAccountsRepository.items[0].id).toEqual(
      result.value?.account.id,
    )
  })
})
