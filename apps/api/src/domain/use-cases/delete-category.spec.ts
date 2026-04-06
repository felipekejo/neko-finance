import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeBudget } from 'test/factories/make-budget'
import { makeCategory } from 'test/factories/make-category'
import { makeUserBudget } from 'test/factories/make-user-budget'
import { InMemoryBudgetsRepository } from 'test/repositories/in-memory-budgets-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryUserBudgetRepository } from 'test/repositories/in-memory-user-budget-repository'
import { DeleteCategoryUseCase } from './delete-category'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryBudgetsRepository: InMemoryBudgetsRepository
let inMemoryUserBudgetRepository: InMemoryUserBudgetRepository
let sut: DeleteCategoryUseCase

describe('Delete Category Use Case', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryBudgetsRepository = new InMemoryBudgetsRepository()
    inMemoryUserBudgetRepository = new InMemoryUserBudgetRepository()

    sut = new DeleteCategoryUseCase(
      inMemoryCategoriesRepository,
      inMemoryBudgetsRepository,
      inMemoryUserBudgetRepository,
    )
  })

  it('should be able to delete a category', async () => {
    const newCategory = makeCategory(
      {
        budgetId: new UniqueEntityID('budget-01'),
      },
      new UniqueEntityID('category-01'),
    )

    const newBudget = makeBudget(
      {
        name: 'Budget 01',
      },
      new UniqueEntityID('budget-01'),
    )
    const userBudget = makeUserBudget(
      {
        userId: new UniqueEntityID('user-01'),
        budgetId: new UniqueEntityID('budget-01'),
      },
      new UniqueEntityID('user-budget-01'),
    )

    await inMemoryBudgetsRepository.create(newBudget)
    await inMemoryCategoriesRepository.create(newCategory)
    inMemoryUserBudgetRepository.items.push(userBudget)
    await sut.execute({
      categoryId: 'category-01',
      userId: 'user-01',
      budgetId: 'budget-01',
    })

    expect(inMemoryCategoriesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a category if you are not the owner', async () => {
    const newCategory = makeCategory(
      {
        budgetId: new UniqueEntityID('budget-01'),
      },
      new UniqueEntityID('category-01'),
    )

    const newBudget = makeBudget(
      {
        name: 'Budget 01',
      },
      new UniqueEntityID('budget-01'),
    )
    const userBudget = makeUserBudget(
      {
        userId: new UniqueEntityID('user-01'),
        budgetId: new UniqueEntityID('budget-01'),
      },
      new UniqueEntityID('user-budget-01'),
    )
    await inMemoryBudgetsRepository.create(newBudget)
    await inMemoryCategoriesRepository.create(newCategory)
    inMemoryUserBudgetRepository.items.push(userBudget)
    const result = await sut.execute({
      categoryId: 'category-01',
      userId: 'user-02',
      budgetId: 'budget-01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
