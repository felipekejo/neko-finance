import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { SubcategoryService } from '../service/subcategory.service'
import { CreateSubcategoryUseCase } from './create-subcategory'

let inMemorySubcategoriesRepository: InMemorySubcategoriesRepository
let subcategoryService: SubcategoryService
let sut: CreateSubcategoryUseCase

describe('Create Subcategory Use Case', () => {
  beforeEach(() => {
    inMemorySubcategoriesRepository = new InMemorySubcategoriesRepository()
    subcategoryService = new SubcategoryService(inMemorySubcategoriesRepository)
    sut = new CreateSubcategoryUseCase(subcategoryService)
  })

  it('should be able to create a new category', async () => {
    const result = await sut.execute({
      name: 'new subcategory',
      categoryId: 'category-01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemorySubcategoriesRepository.items[0]).toEqual(
      result.value?.subcategory,
    )
  })
})
