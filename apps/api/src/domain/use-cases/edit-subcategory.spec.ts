import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCategory } from 'test/factories/make-category'
import { makeSubcategory } from 'test/factories/make-subcategory'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { EditSubcategoryUseCase } from './edit-subcategory'

let inMemorySubcategoriesRepository: InMemorySubcategoriesRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: EditSubcategoryUseCase

describe('Edit Subcategory Use Case', () => {
  beforeEach(() => {
    inMemorySubcategoriesRepository = new InMemorySubcategoriesRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    sut = new EditSubcategoryUseCase(
      inMemorySubcategoriesRepository,
      inMemoryCategoriesRepository,
      inMemoryUserBudgetRepository,
    )
  })

  it('should be able to edit a subcategory', async () => {
    const newCategory = makeCategory(
      { name: 'Category 01', budgetId: new UniqueEntityID('budget-01') },
      new UniqueEntityID('category-01'),
    )
    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    const newSubcategory = makeSubcategory(
      { name: 'Subcategory 01', categoryId: newCategory.id },
      new UniqueEntityID('subcategory-01'),
    )

    await inMemoryCategoriesRepository.create(newCategory)
    await inMemoryUserBudgetRepository.create(userBudget)
    await inMemorySubcategoriesRepository.create(newSubcategory)

    await sut.execute({
      subcategoryId: 'subcategory-01',
      name: 'new subcategory',
      categoryId: 'category-01',
      userId: 'user-01',
    })

    expect(inMemorySubcategoriesRepository.items[0]).toMatchObject({
      name: 'new subcategory',
    })
  })
})
