import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { CategoryService } from '../service/category.service'
import { CreateCategoryUseCase } from './create-category'

let categoryService: CategoryService
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: CreateCategoryUseCase

describe('Create Category Use Case', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    categoryService = new CategoryService(inMemoryCategoriesRepository)
    sut = new CreateCategoryUseCase(categoryService)
  })

  it('should be able to create a new category', async () => {
    const result = await sut.execute({
      name: 'new category',
      budgetId: 'budget-01',
      type: 'INCOMES',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCategoriesRepository.items[0].id).toEqual(
      result.value?.category.id,
    )
  })
})
