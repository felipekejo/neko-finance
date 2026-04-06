import { InMemoryBudgetsRepository } from 'test/repositories/in-memory-budgets-repository'
import { CreateBudgetUseCase } from './create-budget'

let inMemoryBudgetsRepository: InMemoryBudgetsRepository

let sut: CreateBudgetUseCase

describe('Create Budget Use Case', () => {
  beforeEach(() => {
    inMemoryBudgetsRepository = new InMemoryBudgetsRepository()

    sut = new CreateBudgetUseCase(inMemoryBudgetsRepository)
  })

  it('should be able to create a new budget', async () => {
    const result = await sut.execute({
      name: 'New Budget',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryBudgetsRepository.items[0].id).toEqual(
      result.value?.budget.id,
    )
  })
})
