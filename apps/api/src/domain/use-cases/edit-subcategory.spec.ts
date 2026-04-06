import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeBudget } from 'test/factories/make-budget'
import { makeCategory } from 'test/factories/make-category'
import { makeSubcategory } from 'test/factories/make-subcategory'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { EditSubcategoryUseCase } from './edit-subcategory'

let inMemorySubcategoriesRepository: InMemorySubcategoriesRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: EditSubcategoryUseCase

describe('Edit Subcategory Use Case', () => {
  beforeEach(() => {
    inMemorySubcategoriesRepository = new InMemorySubcategoriesRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new EditSubcategoryUseCase(
      inMemorySubcategoriesRepository,
      inMemoryCategoriesRepository,
    )
  })

  it('should be able to edit a subcategory', async () => {
    const newBudget = makeBudget({
      name: 'Budget 01',
    },
        new UniqueEntityID('budget-01'),
    )
    const newCategory = makeCategory(
      {
        name: 'Category 01',
      },
      new UniqueEntityID('category-01'),
    )
    const newSubcategory = makeSubcategory(
      {
        name: 'Subcategory 01',
        categoryId: newCategory.id,
      },
      new UniqueEntityID('subcategory-01'),
    )
    await inMemoryCategoriesRepository.create(newCategory)
    await inMemorySubcategoriesRepository.create(newSubcategory)
    await sut.execute({
      subcategoryId: 'subcategory-01',
      name: 'new subcategory',
      categoryId: 'category-01'
    })

    expect(inMemorySubcategoriesRepository.items[0]).toMatchObject({
      name: 'new subcategory',
    })
  })

})
