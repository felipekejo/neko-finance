import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeSubcategory } from 'test/factories/make-subcategory'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { FetchSubcategoriesUseCase } from './fetch-subcategories'

let inMemorySubcategoriesRepository: InMemorySubcategoriesRepository
let sut: FetchSubcategoriesUseCase
describe('Fetch Subcategories Use Case', () => {
  beforeEach(() => {
    inMemorySubcategoriesRepository = new InMemorySubcategoriesRepository()
    sut = new FetchSubcategoriesUseCase(inMemorySubcategoriesRepository)
  })
  it('should return categories sorted by createdAt in descending order', async () => {
    const subcategory1 = makeSubcategory({ createdAt: new Date('2023-01-01'), categoryId: new UniqueEntityID('category-01') })
    const subcategory2 = makeSubcategory({ createdAt: new Date('2023-02-01'), categoryId: new UniqueEntityID('category-01') })
    await inMemorySubcategoriesRepository.create(subcategory1)
    await inMemorySubcategoriesRepository.create(subcategory2)

    const result = await sut.execute({
      categoryId: 'category-01',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.subcategories).toEqual([subcategory1, subcategory2])
  })
  it('should be able to get subcategories by categoryId', async () => {
    const newSubcategory = makeSubcategory(
      { categoryId: new UniqueEntityID('category-test') }
    )
    await inMemorySubcategoriesRepository.create(newSubcategory)

    const result = await sut.execute({
      categoryId: 'category-test',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.subcategories).toContainEqual(newSubcategory)
  })
})
  it('should return ResourceNotFoundError if no subcategories are found for the categoryId', async () => {
    const result = await sut.execute({
      categoryId: 'non-existing-budget-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

