import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCategory } from 'test/factories/make-category'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { FetchCategoriesUseCase } from './fetch-categories'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: FetchCategoriesUseCase

describe('Fetch Categories Use Case', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()
    sut = new FetchCategoriesUseCase(inMemoryCategoriesRepository, inMemoryUserBudgetRepository)
  })

  it('should return categories sorted by createdAt in descending order', async () => {
    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const category1 = makeCategory({ createdAt: new Date('2023-01-01'), budgetId: new UniqueEntityID('budget-01') })
    const category2 = makeCategory({ createdAt: new Date('2023-02-01'), budgetId: new UniqueEntityID('budget-01') })
    await inMemoryCategoriesRepository.create(category1)
    await inMemoryCategoriesRepository.create(category2)

    const result = await sut.execute({ budgetId: 'budget-01', userId: 'user-01' })
    expect(result.isRight()).toBe(true)
    if (!result.isRight()) throw result.value
    expect(result.value.categories).toEqual([category1, category2])
  })

  it('should be able to get categories by budgetId', async () => {
    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-test'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const newCategory = makeCategory(
      { budgetId: new UniqueEntityID('budget-test') },
      new UniqueEntityID('category-01'),
    )
    await inMemoryCategoriesRepository.create(newCategory)

    const result = await sut.execute({ budgetId: 'budget-test', userId: 'user-01' })
    expect(result.isRight()).toBe(true)
    if (!result.isRight()) throw result.value
    expect(result.value.categories).toContainEqual(newCategory)
  })

  it('should return ResourceNotFoundError if no categories are found for the budgetId', async () => {
    const userBudget = makeUserBudget({
      userId: new UniqueEntityID('user-01'),
      budgetId: new UniqueEntityID('budget-01'),
    })
    await inMemoryUserBudgetRepository.create(userBudget)

    const result = await sut.execute({ budgetId: 'budget-01', userId: 'user-01' })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
