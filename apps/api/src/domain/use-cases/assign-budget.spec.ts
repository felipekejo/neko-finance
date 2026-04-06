import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FakeHasher } from 'test/cryptography/fake-hash'
import { makeBudget } from 'test/factories/make-budget'
import { makeUser } from 'test/factories/make-user'
import { InMemoryBudgetsRepository } from 'test/repositories/in-memory-budgets-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { AssignBudgetUseCase } from './assign-budget'

let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let inMemoryBudgetsRepository: InMemoryBudgetsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: AssignBudgetUseCase

describe('Assign Budget Use Case', () => {
  beforeEach(() => {
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    inMemoryBudgetsRepository = new InMemoryBudgetsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    sut = new AssignBudgetUseCase(
      inMemoryBudgetsRepository,
      inMemoryUsersRepository,
      inMemoryUserBudgetRepository,
    )
  })

  it('should be able to assign a new budget', async () => {
    const user = makeUser(
      {
        password: await fakeHasher.hash('123456'),
        email: 'john.doe@example.com',
      },
      new UniqueEntityID('user-01'),
    )

    const budget = makeBudget(
      {
        name: 'New Budget',
      },
      new UniqueEntityID('budget-01'),
    )

    await inMemoryUsersRepository.create(user)
    await inMemoryBudgetsRepository.create(budget)
    const result = await sut.execute({
      userId: 'user-01',
      budgetId: 'budget-01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserBudgetRepository.items[0].userId.toValue()).toEqual(
      'user-01',
    )
    expect(inMemoryUserBudgetRepository.items[0].budgetId.toValue()).toEqual(
      'budget-01',
    )
  })
})
