import { makeTransaction } from "test/factories/make-transaction"
import { InMemoryTransactionsRepository } from "test/repositories/in-memory-transactions-repository"
import { FetchTransactionsUseCase } from "./fetch-transactions"

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: FetchTransactionsUseCase
describe('Fetch Transactions Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new FetchTransactionsUseCase(inMemoryTransactionsRepository)
  })
  it('should be able to bring all transactions in specific period',async ()=>{
      const [transaction1, transaction2, transaction3] = await Promise.all([
        makeTransaction({
          date: new Date('2024-08-22'),
          description:'transaction1'
        }),
        makeTransaction({
          date: new Date('2024-07-22'),
          description:'transaction2'
        }),
        makeTransaction({
          date: new Date('2024-08-01'),
          description:'transaction3'
        })
      ])
        await inMemoryTransactionsRepository.create(transaction1)
        await inMemoryTransactionsRepository.create(transaction2)
        await inMemoryTransactionsRepository.create(transaction3)

        const filters = {
          year:2024,
          month:8
        }
        const pagination =
          {page: 1, perPage: 10}
        const result = await sut.execute({
          filters,
          pagination
        })
        expect(result.isRight()).toBe(true)
        expect(result.value?.transactions).toContainEqual(transaction1)
        expect(result.value?.transactions).toContainEqual(transaction3)

  })
})