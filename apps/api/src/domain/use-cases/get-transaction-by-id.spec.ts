import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeTransaction } from 'test/factories/make-transaction'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { GetTransactionByIdUseCase } from './get-transaction-by-id'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: GetTransactionByIdUseCase

describe('Get Transaction by Id Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    sut = new GetTransactionByIdUseCase(inMemoryTransactionsRepository, inMemoryUserBudgetRepository)
  })

  it('should be able to get a transaction by id', async () => {
    const newTransaction = makeTransaction({
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryTransactionsRepository.create(newTransaction)

    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const result = await sut.execute({
      id: newTransaction.id.toValue(),
      userId: 'user-01',
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
