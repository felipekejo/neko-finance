
import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { AccountService } from './account.service'

let inMemoryAccountsRepository: InMemoryAccountsRepository
let sut: AccountService

describe('Account Service', () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository()

    sut = new AccountService(
      inMemoryAccountsRepository,
    )
  })

  it('should be able to create a new account', async () => {


    const result = await sut.createAccount({
      name: 'New Account',
      ownerId: 'user-01',
      budgetId: 'budget-01',
      balance: 0,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryAccountsRepository.items[0]).toEqual(
        result.value.account,
      )
    }
  })
})
