import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCategory } from 'test/factories/make-category'
import { makeSubcategory } from 'test/factories/make-subcategory'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { FetchSubcategoriesUseCase } from './fetch-subcategories'

let inMemorySubcategoriesRepository: InMemorySubcategoriesRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: FetchSubcategoriesUseCase

describe('Fetch Subcategories Use Case', () => {
  beforeEach(() => {
    inMemorySubcategoriesRepository = new InMemorySubcategoriesRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    sut = new FetchSubcategoriesUseCase(
      inMemorySubcategoriesRepository,
      inMemoryCategoriesRepository,
      inMemoryUserBudgetRepository,
    )
  })

  it('should return subcategories sorted by createdAt in descending order', async () => {
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

    const subcategory1 = makeSubcategory({ createdAt: new Date('2023-01-01'), categoryId: new UniqueEntityID('category-01') })
    const subcategory2 = makeSubcategory({ createdAt: new Date('2023-02-01'), categoryId: new UniqueEntityID('category-01') })
    await inMemorySubcategoriesRepository.create(subcategory1)
    await inMemorySubcategoriesRepository.create(subcategory2)

    const result = await sut.execute({ categoryId: 'category-01', userId: 'user-01' })
    expect(result.isRight()).toBe(true)
    if (!result.isRight()) throw result.value
    expect(result.value.subcategories).toEqual([subcategory1, subcategory2])
  })

  it('should be able to get subcategories by categoryId', async () => {
    const category = makeCategory(
      { budgetId: new UniqueEntityID('budget-01') },
      new UniqueEntityID('category-test'),
    )
    await inMemoryCategoriesRepository.create(category)

    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const newSubcategory = makeSubcategory({ categoryId: new UniqueEntityID('category-test') })
    await inMemorySubcategoriesRepository.create(newSubcategory)

    const result = await sut.execute({ categoryId: 'category-test', userId: 'user-01' })
    expect(result.isRight()).toBe(true)
    if (!result.isRight()) throw result.value
    expect(result.value.subcategories).toContainEqual(newSubcategory)
  })

  it('should return ResourceNotFoundError if the category does not exist', async () => {
    const result = await sut.execute({ categoryId: 'non-existing-category', userId: 'user-01' })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
