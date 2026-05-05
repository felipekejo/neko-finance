import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeBudget } from 'test/factories/make-budget'
import { makeCategory } from 'test/factories/make-category'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryBudgetsRepository } from 'test/repositories/in-memory-budgets-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { EditCategoryUseCase } from './edit-category'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryBudgetsRepository: InMemoryBudgetsRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: EditCategoryUseCase

describe('Edit Category Use Case', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryBudgetsRepository = new InMemoryBudgetsRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    sut = new EditCategoryUseCase(
      inMemoryCategoriesRepository,
      inMemoryBudgetsRepository,
      inMemoryUserBudgetRepository,
    )
  })

  it('should be able to edit a category', async () => {
    const newCategory = makeCategory(
      { budgetId: new UniqueEntityID('budget-01'), type: 'EXPENSES' },
      new UniqueEntityID('category-01'),
    )
    const newBudget = makeBudget({ name: 'Budget 01' }, new UniqueEntityID('budget-01'))
    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })

    await inMemoryCategoriesRepository.create(newCategory)
    await inMemoryBudgetsRepository.create(newBudget)
    await inMemoryUserBudgetRepository.create(userBudget)

    await sut.execute({
      categoryId: 'category-01',
      type: 'INCOMES',
      name: 'new category',
      budgetId: 'budget-01',
      userId: 'user-01',
    })

    expect(inMemoryCategoriesRepository.items[0]).toMatchObject({
      type: 'INCOMES',
      name: 'new category',
    })
  })
})
