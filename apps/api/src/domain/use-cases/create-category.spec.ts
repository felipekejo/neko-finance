import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { CategoryService } from '../service/category.service'
import { CreateCategoryUseCase } from './create-category'

let categoryService: CategoryService
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: CreateCategoryUseCase

describe('Create Category Use Case', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    categoryService = new CategoryService(inMemoryCategoriesRepository)
    sut = new CreateCategoryUseCase(categoryService, inMemoryUserBudgetRepository)
  })

  it('should be able to create a new category', async () => {
    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const result = await sut.execute({
      name: 'new category',
      budgetId: 'budget-01',
      type: 'INCOMES',
      userId: 'user-01',
    })

    expect(result.isRight()).toBe(true)
    if (!result.isRight()) throw result.value
    expect(inMemoryCategoriesRepository.items[0].id).toEqual(
      result.value.category.id,
    )
  })
})
