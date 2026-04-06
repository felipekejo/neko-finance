import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeBudget } from 'test/factories/make-budget'
import { makeTransaction } from 'test/factories/make-transaction'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryBudgetsRepository } from 'test/repositories/in-memory-budgets-repository'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { DeleteTransactionUseCase } from './delete-transaction'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemoryBudgetsRepository: InMemoryBudgetsRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: DeleteTransactionUseCase

describe('Delete Transaction Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryBudgetsRepository = new InMemoryBudgetsRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    sut = new DeleteTransactionUseCase(
      inMemoryTransactionsRepository,
      inMemoryBudgetsRepository,
      inMemoryUserBudgetRepository,
    )
  })

  it('should be able to delete a transaction', async () => {
    const newTransaction = makeTransaction(
      {
        budgetId: new UniqueEntityID('budget-01'),
      },
      new UniqueEntityID('transaction-01'),
    )
    const newBudget = makeBudget(
      {
        name: 'Budget 01',
      },
      new UniqueEntityID('budget-01'),
    )

    const userBudget = makeUserBudget(
      {
        userId: new UniqueEntityID('user-01'),
        budgetId: new UniqueEntityID('budget-01'),
      },
      new UniqueEntityID('user-budget-01'),
    )
    await inMemoryBudgetsRepository.create(newBudget)

    await inMemoryTransactionsRepository.create(newTransaction)
    inMemoryUserBudgetRepository.items.push(userBudget)

    await sut.execute({
      userId: 'user-01',
      transactionId: 'transaction-01',
      budgetId: 'budget-01',
    })

    expect(inMemoryTransactionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a transaction if you are not the owner', async () => {
    const newTransaction = makeTransaction(
      {
        budgetId: new UniqueEntityID('budget-01'),
      },
      new UniqueEntityID('transaction-01'),
    )
    const newBudget = makeBudget(
      {
        name: 'Budget 01',
      },
      new UniqueEntityID('budget-01'),
    )
    const userBudget = makeUserBudget(
      {
        userId: new UniqueEntityID('user-01'),
        budgetId: new UniqueEntityID('budget-01'),
      },
      new UniqueEntityID('user-budget-01'),
    )

    await inMemoryBudgetsRepository.create(newBudget)

    await inMemoryTransactionsRepository.create(newTransaction)
    inMemoryUserBudgetRepository.items.push(userBudget)
    const result = await sut.execute({
      userId: 'user-02',
      transactionId: 'transaction-01',
      budgetId: 'budget-01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
