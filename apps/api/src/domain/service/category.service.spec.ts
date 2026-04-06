import { InMemoryCategoriesRepository } from "test/repositories/in-memory-category-repository"
import { CategoryService } from "./category.service"


let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: CategoryService

describe('Category Service', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()

    sut = new CategoryService(
      inMemoryCategoriesRepository,
    )
  })

  it('should be able to create a new category', async () => {


    const result = await sut.create({
      name: 'New Category',
      budgetId: 'budget-01',
      type: 'INCOMES',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCategoriesRepository.items[0]).toEqual(
        result.value.category,
      )
    }
  })

    it('should be able to create a INCOME', async () => {


    const result = await sut.create({
      name: 'New Category',
      budgetId: 'budget-01',
      type: 'INCOMES',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCategoriesRepository.items[0].type).toEqual(
        'INCOMES'
      )
    }
  })

      it('should be able to create a Expense', async () => {


    const result = await sut.create({
      name: 'New Category',
      budgetId: 'budget-01',
      type: 'EXPENSES',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCategoriesRepository.items[0].type).toEqual(
        'EXPENSES'
      )
    }
  })
})
