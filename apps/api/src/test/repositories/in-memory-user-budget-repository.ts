import { UserBudget } from '@/domain/entities/user-budget'
import { UserBudgetRepository } from '@/domain/repositories/user-budget-repository'

export class InMemoryUserBudgetRepository implements UserBudgetRepository {
  public items: UserBudget[] = []
  async findByUserIdAndBudgetId(userId: string, budgetId: string) {
    const budget = this.items.find(
      (item) =>
        item.budgetId.toString() === budgetId &&
        item.userId.toString() === userId,
    )
    if (!budget) {
      return null
    }

    return budget
  }

  async create(userBudget: UserBudget) {
    this.items.push(userBudget)
  }

  async delete(userId: string, budgetId: string) {
    const index = this.items.findIndex(
      (item) =>
        item.budgetId.toString() === budgetId &&
        item.userId.toString() === userId,
    )

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }
}
