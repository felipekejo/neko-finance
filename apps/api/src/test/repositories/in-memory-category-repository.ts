import { Category } from '@/domain/entities/category'
import { CategoriesRepository, type FindByNameProps } from '@/domain/repositories/category-repository'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []
  async create(category: Category) {
    this.items.push(category)
  }

  async findById(id: string) {
    const category = this.items.find((item) => item.id.toString() === id)
    if (!category) {
      return null
    }
    return category
  }

  async delete(category: Category): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)
    this.items.splice(itemIndex, 1)
  }

  async save(category: Category): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)

    this.items[itemIndex] = category
  }

  async findMany(filters: { type?: 'EXPENSES' | 'INCOMES' },budgetId:string): Promise<Category[]> {
    let categories = this.items.filter((item) => item.budgetId.toString() === budgetId)
    if (filters.type) {
      filters.type = filters.type.toUpperCase() as 'EXPENSES' | 'INCOMES'
      categories = categories.filter((item) => item.type === filters.type)
      
    }

    return categories.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime()
    }
    )
  }

  async findByName({name, budgetId}: FindByNameProps): Promise<Category | null> {
    const category = this.items.find(
      (item) => item.name === name && item.budgetId.toString() === budgetId
    )
    if (!category) {
      return null
    }
    return category
  }
}
