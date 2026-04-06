import { makeTransaction } from 'test/factories/make-transaction'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { GetTransactionByIdUseCase } from './get-transaction-by-id'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: GetTransactionByIdUseCase
describe('Get Account by Id Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new GetTransactionByIdUseCase(inMemoryTransactionsRepository)
  })

  it('should be able to get an account by id', async () => {
    const newTransaction = makeTransaction()
    await inMemoryTransactionsRepository.create(newTransaction)

    const result = await sut.execute({
      id: newTransaction.id.toValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      transaction: {
        id: newTransaction.id,
        description: newTransaction.description,
      },
    })
  })
})
