import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeBudget } from 'test/factories/make-budget'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryBudgetsRepository } from 'test/repositories/in-memory-budgets-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { GetBudgetByIdUseCase } from './get-budget-by-id'

let inMemoryBudgetsRepository: InMemoryBudgetsRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: GetBudgetByIdUseCase

describe('Get Budget by Id Use Case', () => {
  beforeEach(() => {
    inMemoryBudgetsRepository = new InMemoryBudgetsRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    sut = new GetBudgetByIdUseCase(inMemoryBudgetsRepository, inMemoryUserBudgetRepository)
  })

  it('should be able to get a budget by id', async () => {
    const newBudget = makeBudget({}, new UniqueEntityID('budget-01'))
    await inMemoryBudgetsRepository.create(newBudget)

    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const result = await sut.execute({
      budgetId: 'budget-01',
      userId: 'user-01',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      budget: {
        id: newBudget.id,
        name: newBudget.name,
      },
    })
  })
})
