import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { GetCategoryByIdUseCase } from './get-category-by-id'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: GetCategoryByIdUseCase
describe('Get Account by Id Use Case', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new GetCategoryByIdUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to get an account by id', async () => {
    
    const newCategory = makeCategory()
    await inMemoryCategoriesRepository.create(newCategory)

    const result = await sut.execute({
      categoryId: newCategory.id.toValue(),
      budgetId: newCategory.budgetId.toValue()
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toMatchObject({
      category: {
        id: newCategory.id,
        name: newCategory.name,
      },
    })
  })
})
