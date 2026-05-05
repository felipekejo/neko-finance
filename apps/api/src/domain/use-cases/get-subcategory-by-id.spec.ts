import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCategory } from 'test/factories/make-category'
import { makeSubcategory } from 'test/factories/make-subcategory'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { GetSubcategoryByIdUseCase } from './get-subcategory-by-id'

let inMemorySubcategoriesRepository: InMemorySubcategoriesRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: GetSubcategoryByIdUseCase

describe('Get Subcategory by Id Use Case', () => {
  beforeEach(() => {
    inMemorySubcategoriesRepository = new InMemorySubcategoriesRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    sut = new GetSubcategoryByIdUseCase(
      inMemorySubcategoriesRepository,
      inMemoryCategoriesRepository,
      inMemoryUserBudgetRepository,
    )
  })

  it('should be able to get a subcategory by id', async () => {
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

    const newSubcategory = makeSubcategory(
      { categoryId: new UniqueEntityID('category-01') },
    )
    await inMemorySubcategoriesRepository.create(newSubcategory)

    const result = await sut.execute({
      subcategoryId: newSubcategory.id.toValue(),
      userId: 'user-01',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      subcategory: {
        id: newSubcategory.id,
        name: newSubcategory.name,
      },
    })
  })
})
