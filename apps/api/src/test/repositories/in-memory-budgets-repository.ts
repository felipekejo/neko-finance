import { Budget } from '@/domain/entities/budget'
import { BudgetsRepository } from '@/domain/repositories/budget-repository'

export class InMemoryBudgetsRepository implements BudgetsRepository {
  public items: Budget[] = []
  async findById(id: string) {
    const budget = this.items.find((item) => item.id.toString() === id)
    if (!budget) {
      return null
    }

    return budget
  }

  async create(data: Budget) {
    this.items.push(data)
  }

  async delete(budget: Budget): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === budget.id)

    this.items.splice(itemIndex, 1)
  }

  async save(budget: Budget): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === budget.id)
    this.items[itemIndex] = budget
  }
}
