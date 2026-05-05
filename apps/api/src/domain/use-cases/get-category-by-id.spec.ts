import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCategory } from 'test/factories/make-category'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { GetCategoryByIdUseCase } from './get-category-by-id'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: GetCategoryByIdUseCase

describe('Get Category by Id Use Case', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    sut = new GetCategoryByIdUseCase(inMemoryCategoriesRepository, inMemoryUserBudgetRepository)
  })

  it('should be able to get a category by id', async () => {
    const newCategory = makeCategory(
      { budgetId: new UniqueEntityID('budget-01') },
      new UniqueEntityID('category-01'),
    )
    await inMemoryCategoriesRepository.create(newCategory)

    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const result = await sut.execute({
      categoryId: 'category-01',
      budgetId: 'budget-01',
      userId: 'user-01',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      category: {
        id: newCategory.id,
        name: newCategory.name,
      },
    })
  })
})
