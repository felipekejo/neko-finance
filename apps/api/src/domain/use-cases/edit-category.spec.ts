import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeBudget } from 'test/factories/make-budget'
import { makeCategory } from 'test/factories/make-category'
import { InMemoryBudgetsRepository } from 'test/repositories/in-memory-budgets-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { EditCategoryUseCase } from './edit-category'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryBudgetsRepository: InMemoryBudgetsRepository
let sut: EditCategoryUseCase

describe('Edit Category Use Case', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryBudgetsRepository = new InMemoryBudgetsRepository()

    sut = new EditCategoryUseCase(
      inMemoryCategoriesRepository,
      inMemoryBudgetsRepository
    )
  })

  it('should be able to edit a category', async () => {
    const newCategory = makeCategory(
      {
        budgetId: new UniqueEntityID('budget-01'),
        type: 'EXPENSES',
      },
      new UniqueEntityID('category-01'),
    )
    const newBudget = makeBudget(
      {
        name: 'Budget 01',
      },
      new UniqueEntityID('budget-01'),
    )

    await inMemoryCategoriesRepository.create(newCategory)
    await inMemoryBudgetsRepository.create(newBudget)

    await sut.execute({
      categoryId: 'category-01',
      type: 'INCOMES',
      name: 'new category',
      budgetId: 'budget-01',
    })

    expect(inMemoryCategoriesRepository.items[0]).toMatchObject({
      type: 'INCOMES',
      name: 'new category',
    })
  })
})
