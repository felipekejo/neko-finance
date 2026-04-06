import { InMemorySubcategoriesRepository } from "test/repositories/in-memory-subcategories-repository"
import { SubcategoryService } from "./subcategory.service"



let inMemorySubcategoriesRepository: InMemorySubcategoriesRepository
let sut: SubcategoryService

describe('Subcategory Service', () => {
  beforeEach(() => {
    inMemorySubcategoriesRepository = new InMemorySubcategoriesRepository()

    sut = new SubcategoryService(
      inMemorySubcategoriesRepository,
    )
  })

  it('should be able to create a new subcategory', async () => {


    const result = await sut.create({
      name: 'New Subcategory',
      categoryId: 'category-01',
      
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemorySubcategoriesRepository.items[0]).toEqual(
        result.value.subcategory,
      )
    }
  })
})
