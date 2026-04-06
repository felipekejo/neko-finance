import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeBudget } from 'test/factories/make-budget'
import { makeSubcategory } from 'test/factories/make-subcategory'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { DeleteSubcategoryUseCase } from './delete-subcategory'

let inMemorySubcategoriesRepository: InMemorySubcategoriesRepository
let sut: DeleteSubcategoryUseCase

describe('Delete Subcategory Use Case', () => {
  beforeEach(() => {
    inMemorySubcategoriesRepository = new InMemorySubcategoriesRepository()

    sut = new DeleteSubcategoryUseCase(
      inMemorySubcategoriesRepository
    )
  })

  it('should be able to delete a subcategory', async () => {
    const newSubcategory = makeSubcategory(
      {},
      new UniqueEntityID('subcategory-01'),
    )

    const newBudget = makeBudget(
      {
        name: 'Budget 01',
      },
      new UniqueEntityID('budget-01'),
    )


    await inMemorySubcategoriesRepository.create(newSubcategory)

    await sut.execute({
      subcategoryId: 'subcategory-01',
      userId: 'user-01',
      budgetId: 'budget-01',
    })

    expect(inMemorySubcategoriesRepository.items).toHaveLength(0)
  })

})
