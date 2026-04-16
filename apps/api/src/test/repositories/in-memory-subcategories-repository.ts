import { Subcategory } from '@/domain/entities/subcategory'
import { SubcategoriesRepository } from '@/domain/repositories/subcategory-repository'

export class InMemorySubcategoriesRepository
  implements SubcategoriesRepository
{
  public items: Subcategory[] = []

  async findById(id: string) {
    const subcategory = this.items.find((item) => {
      return item.id.toString() === id
    })

    if (!subcategory) {
      return null
    }

    return subcategory
  }

  async create(subcategory: Subcategory) {
    this.items.push(subcategory)
  }

  async delete(subcategory: Subcategory): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === subcategory.id)
    this.items.splice(itemIndex, 1)
  }

  async save(subcategory: Subcategory): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === subcategory.id)

    this.items[itemIndex] = subcategory
  }
  async findMany(categoryId: string): Promise<Subcategory[]> {
    return this.items.filter((item) => item.categoryId.toString() === categoryId)
  }
  async findByName(name: string): Promise<Subcategory | null> {
    const subcategory = this.items.find((item) => item.name === name)
    if (!subcategory) {
      return null
    }
    return subcategory
  }
}
