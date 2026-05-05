import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCategory } from 'test/factories/make-category'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { SubcategoryService } from '../service/subcategory.service'
import { CreateSubcategoryUseCase } from './create-subcategory'

let inMemorySubcategoriesRepository: InMemorySubcategoriesRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let subcategoryService: SubcategoryService
let sut: CreateSubcategoryUseCase

describe('Create Subcategory Use Case', () => {
  beforeEach(() => {
    inMemorySubcategoriesRepository = new InMemorySubcategoriesRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    subcategoryService = new SubcategoryService(inMemorySubcategoriesRepository)
    sut = new CreateSubcategoryUseCase(subcategoryService, inMemoryCategoriesRepository, inMemoryUserBudgetRepository)
  })

  it('should be able to create a new subcategory', async () => {
    const category = makeCategory(
      { budgetId: new UniqueEntityID('budget-01') },
      new UniqueEntityID('category-01'),
    )
    await inMemoryCategoriesRepository.create(category)

    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const result = await sut.execute({
      name: 'new subcategory',
      categoryId: 'category-01',
      userId: 'user-01',
    })

    expect(result.isRight()).toBe(true)
    if (!result.isRight()) throw result.value
    expect(inMemorySubcategoriesRepository.items[0]).toEqual(
      result.value.subcategory,
    )
  })
})
