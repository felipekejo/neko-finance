import { makeAccount } from 'test/factories/make-account'
import { InMemoryAccountsRepository } from 'test/repositories/in-memory-accounts-repository'
import { GetAccountByIdUseCase } from './get-account-by-id'

let inMemoryAccountsRepository: InMemoryAccountsRepository
let sut: GetAccountByIdUseCase
describe('Get Account by Id Use Case', () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    sut = new GetAccountByIdUseCase(inMemoryAccountsRepository)
  })

  it('should be able to get an account by id', async () => {
    const newAccount = makeAccount()
    await inMemoryAccountsRepository.create(newAccount)

    const result = await sut.execute({
      id: newAccount.id.toValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.account.id).toEqual(newAccount.id)
  })
})
