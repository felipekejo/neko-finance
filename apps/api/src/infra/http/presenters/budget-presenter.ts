import type { Budget } from '@/domain/entities/budget'

export class BudgetPresenter {
  static toHTTP(budget: Budget) {
    return {
      id: budget.id.toString(),
      name: budget.name,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    }
  }
}
