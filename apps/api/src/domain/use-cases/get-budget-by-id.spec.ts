import { makeBudget } from 'test/factories/make-budget'
import { InMemoryBudgetsRepository } from 'test/repositories/in-memory-budgets-repository'
import { GetBudgetByIdUseCase } from './get-budget-by-id'

let inMemoryBudgetsRepository: InMemoryBudgetsRepository
let sut: GetBudgetByIdUseCase

describe('Get Budget by Id Use Case', () => {
  beforeEach(() => {
    inMemoryBudgetsRepository = new InMemoryBudgetsRepository()

    sut = new GetBudgetByIdUseCase(inMemoryBudgetsRepository)
  })

  it('should be able to get a budget by id', async () => {
    const newBudget = makeBudget()

    await inMemoryBudgetsRepository.create(newBudget)

    const result = await sut.execute({
      budgetId: newBudget.id.toValue(),
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
