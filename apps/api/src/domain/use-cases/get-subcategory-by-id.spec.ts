import { makeSubcategory } from 'test/factories/make-subcategory'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { GetSubcategoryByIdUseCase } from './get-subcategory-by-id'

let inMemorySubcategoriesRepository: InMemorySubcategoriesRepository
let sut: GetSubcategoryByIdUseCase
describe('Get Subcategory by Id Use Case', () => {
  beforeEach(() => {
    inMemorySubcategoriesRepository = new InMemorySubcategoriesRepository()
    sut = new GetSubcategoryByIdUseCase(inMemorySubcategoriesRepository)
  })

  it('should be able to get an subcategory by id', async () => {
    const newSubcategory = makeSubcategory()
    await inMemorySubcategoriesRepository.create(newSubcategory)

    const result = await sut.execute({
      subcategoryId: newSubcategory.id.toValue(),
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
